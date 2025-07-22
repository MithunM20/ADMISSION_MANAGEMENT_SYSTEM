const Lead = require("../models/Lead.js");

// Get all leads
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads", error });
  }
};

// Create a new lead
exports.createLead = async (req, res, next) => {
  try {
    const leadData = req.body; // Expecting { name, email, phone, source, interestLevel, notes }
    const newLead = new Lead({
      ...leadData,
      status: "new", // Default status for anonymous submissions
      assignedTo: "Sales Rep 2", // Optional, can be set dynamically or hardcoded
      followUpDate: new Date("2025-04-03T10:00:00Z"), // Optional, can be set later
    });

    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    next(error);
  }
};

// Update a lead
exports.updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json({ message: "Lead updated", lead: updatedLead });
  } catch (error) {
    res.status(500).json({ message: "Error updating lead", error });
  }
};

// Delete a lead
exports.deleteLead = async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json({ message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lead", error });
  }
};
