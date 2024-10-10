import { Router } from "express";
import multer from "multer";
import { unlink, rename } from "fs";
import { basename, join } from "path";

const router = Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG/PNG images are allowed"), false);
    }
  },
});

router.put("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "No file uploaded or invalid file type" });
  }

  const file = req.file;
  const fileId = basename(file.path);

  res.status(201).json({
    message: "File uploaded successfully",
    file: {
      id: fileId,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    },
  });
});

router.delete("/delete-file/:id", (req, res) => {
  const fileId = req.params.id;
  const filePath = join(__dirname, "../uploads", fileId);

  unlink(filePath, (err) => {
    if (err) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({ message: "File deleted successfully" });
  });
});

router.post("/rename-file", (req, res) => {
  const { fileId, newName } = req.body;

  if (!fileId || !newName) {
    return res
      .status(400)
      .json({ message: "File ID and new name are required" });
  }

  const oldPath = join(__dirname, "../uploads", fileId);
  const newPath = join(__dirname, "../uploads", newName);

  rename(oldPath, newPath, (err) => {
    if (err) {
      return res
        .status(404)
        .json({ message: "File not found or renaming failed" });
    }

    res.json({ message: "File renamed successfully" });
  });
});

export default router;
