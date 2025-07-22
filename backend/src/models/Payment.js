const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    admissionId: {
      type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String for flexibility
      required: true,
      ref: "Admission",
    },
    courseName: {
      type: String, // Add course name to track which course the payment is for
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // Ensure amount is non-negative
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR"], // Restrict to INR for now, or expand if needed
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "UPI", "net banking", "wallet"],
      required: true,
    },
    receiptUrl: { type: String }, // Optional field for receipt
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;