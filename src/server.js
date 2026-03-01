import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors"
import fs from "fs";
import authRoutes from "./fileRoutes/authRoutes"
import fileRoutes from "./fileRoutes/fileRoutes"

const app = express();
const PORT = process.env.PORT || 5000;

if(!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

app.use(express.json());

if (process.env.NODE_ENV === "development") {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    }) 
}

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

app.get("/health", (req, res) => {
    return res.json({
        status: "ok",
        timeStamp: new Data().toISOString()
    })
})

app.use("*", (req, res) => {
    res.status(404).json({ error: "route not found"})
})

app.use((err, req,res, next) => {
    console.error(err.stack);
    if (err.message.includes("Invalid file type")) {
        return res.status(400).json({error: err.message});
    }
    if(err.message.includes("file too large")){
        return res.status(400).json({error: "file size exceeds 5MB limit"})
    }
    res.status(500).json({error: "internal server error"});
})

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});