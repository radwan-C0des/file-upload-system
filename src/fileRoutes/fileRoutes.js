import express from "express"
const router = express.Router()

import { uploadFile, getFile, getUserFiles, deleteFile } from "../controllers/fileController"
import {authenticate} from "../middlewares/authMiddleware.js";
import {upload} from "../middlewares/uploadMiddleware.js"

router.use(authenticate);

router.post("/upload", upload.single("file"), uploadFile);

router.get("/", getUserFiles);

router.get("/:id", getFile);

router.delete("/:id", deleteFile);

export default router;