const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|png|pdf|doc|docx/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, PDF, DOC, and DOCX are allowed."));
    }
  },
}).fields([
  { name: "photoId", maxCount: 1 },
  { name: "proofDocument", maxCount: 1 },
  { name: "certificate", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

module.exports = upload;