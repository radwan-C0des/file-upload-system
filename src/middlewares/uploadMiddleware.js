
import multer from "multer";
import path from "path";
import {v4 as uuidv4} from "uuid";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "/uploads")
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
})
const fileFilter = (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(",");
    if(allowedTypes.includes(file.mimType)) {
        cb(null, true);
    } else {
        cb(new Error("invalid file type only PDF and image allowed"), false )
    }
};

export const upload = multer ({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE)
    }
})