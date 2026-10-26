import { Router } from "express";
import upload from "../services/multerConfig.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const multerRouter = Router();

multerRouter.post("/upload", protect, admin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded." });
  }

  res.json({
    imageUrl: req.file.path,
    imageId: req.file.filename,
  });
});

export default multerRouter;
