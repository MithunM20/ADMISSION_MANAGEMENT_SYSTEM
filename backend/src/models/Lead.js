const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  source: { 
    type: String, 
    required: true, 
    enum: ["website", "social media", "referral", "event"],
    default: "website" // Optional: Set default to match frontend
  },
  interestLevel: { 
    type: Number, 
    min: 1, 
    max: 10, 
    required: true, 
    default: 5 
  },
  course: { 
    type: String, 
    required: true 
  }, // New field for interested course
  notes: { type: String }, // Optional
  status: { 
    type: String, 
    enum: ["new", "contacted", "qualified", "converted", "lost"], 
    default: "new" 
  },
  assignedTo: { type: String }, // Optional, can be set later
  followUpDate: { type: Date }, // Optional, set later by admin or AI
}, { timestamps: true }); // Optional: Adds createdAt and updatedAt fields

module.exports = mongoose.model("Lead", leadSchema);