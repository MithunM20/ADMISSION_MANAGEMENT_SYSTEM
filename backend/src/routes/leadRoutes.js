const express = require("express");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { getLeads, createLead, updateLead, deleteLead } = require("../controllers/leadController.js");

const router = express.Router();

// Public route - Anyone can submit a lead inquiry (no authentication)
router.post("/", createLead);

// Admin-only routes
router.get("/", getLeads);
router.put("/:id", authenticate, authorize(["admin"]), updateLead);
router.delete("/:id", authenticate, authorize(["admin"]), deleteLead);

module.exports = router;

