const express = require("express");
const { createAdmission, updateAdmission, getAdmissions, uploadDocuments, deleteAdmission, getMyAdmission } = require("../controllers/admissionController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post("/", upload, createAdmission);
router.get("/", getAdmissions); // List all admissions (might need to restrict this in production)
router.get("/me", getMyAdmission); // New route to fetch admission by email (no token required)
router.put("/:id", updateAdmission);
router.post("/upload/:id", upload, uploadDocuments);
router.delete("/:id", deleteAdmission);

module.exports = router;