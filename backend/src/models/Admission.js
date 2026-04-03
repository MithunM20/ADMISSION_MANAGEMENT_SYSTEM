const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ["photoId", "proofDocument", "certificate", "resume"] },
  filePath: { type: String},
  uploadDate: { type: Date, default: Date.now },
  encrypted: { type: Boolean, default: true },
  version: { type: Number, default: 1 },
});

const admissionSchema = new mongoose.Schema({
  studentName: { type :String, required:true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "verified", "admitted", "rejected"], 
    default: "pending" 
  },
  documents: [documentSchema],
  admissionDate: { type: Date, default: Date.now },
  referralCode: { type: String },
  studentId: { type: String }, 
}, { timestamps: true });

const Admission = mongoose.model("Admission", admissionSchema);
module.exports = Admission;

