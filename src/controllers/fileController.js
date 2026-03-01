import db from "../config/database.js"
import {files} from "../../db/schema.js"
import {uploadToCloudinary, uploadOptimizedImage, deleteFromCloudinary} from "../services/cloudinaryService.js"

import {eq, and} from "drizzle-orm"
import fs from "fs";

export const uploadFile = async(req, res) => {
    try {
       if(!req.file) {
        return res.status(400).json({error:"no file uploaded"});

       } 
       const userId = req.userId;
       const localFilePath = req.file.path;
       const isImage = req.file.mimtype.startsWith("image/");

       let cloudinaryResult;

       if(isImage){
        cloudinaryResult = await uploadOptimizedImage(localFilePath, "user-uploads")
       } else {
        cloudinaryResult = await uploadToCloudinary(localFilePath, "user-uploads")
       }

       const [newFile] = await db.insert(files).values({
        userId:userId,
        originalName: req.file.originalname,
        fileName: cloudinaryResult.public_id,
        fileUrl:cloudinaryResult.secure_url,
        fileSize:cloudinaryResult.bytes,
        MimeType: req.file.mimtype,
        isOptimized: isImage,
        optimizedUrl: isImage ? cloudinaryResult.secure_url : null
       }).returning();

       fs.unlinkSync(localFilePath);

       return res.status(201).json({
        message: "file uploaded succesfully",
        file: {
            id: newFile.id,
            originalName: newFile.originalName,
            url: newFile.fileUrl,
            size: newFile.fileSize,
            type: newFile.mimtype,
            optimized: newFile.isOptimized
        }
       });
    } catch (error) {
       if(req.file && req.file.path) {
        try {
            fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
           console.error("cleanup error:", cleanupError) 
        }
       } 
       console.error("upload error:", error);
       return res.status(500).json({error:"File upload failed"})
    }
};

export const getUserFiles = async(req, res) => {
    try {
        const userId = req.userId;

        const userFiles = await db.select().from(files).where(eq(files.userId, userId)).orderBy(files.createdAt)
    } catch (error) {
        console.error("get files error", error);
        return res.status(500).json({error: "failed to retrieve files"})
    }
};

export const getFile = async(req, res) => {
    try {
        const {id} = req.params;
        const userId = req.userId;

        const [file] = await db.select().from(files).where(and(eq(files.id, id), eq(files.userId, userId)
    ));

    if (!file) {
        return res.status(404).json({error: "file not found"})
    }
    return res.status(200).json({ file });
    } catch (error) {
        console.error("Get file error:", error);
        return res.status(500).json({error: "Failed to retrieve file"})
    }
}

export const deleteFile = async(req, res) => {
    try {
        const userId = req.userId;
        const {id} = req.params;

        const [file] = await db.select()
        .from(files)
        .where(and(eq(files.id, id),eq(files.userId.userId)
    ));

    if(!files) {
        return res.status(404).josn({error: "File not found"})
    }

    await deleteFromCloudinary(file.fileName);

    await db.delete(files).where(eq(files.id, id));

    return res.status(200).json({message: "file deleted succesfully"})
    } catch (error) {
        console.error("delete error:", error);
        return res.status(500).json({error: "file deletion failed"})
    }
};