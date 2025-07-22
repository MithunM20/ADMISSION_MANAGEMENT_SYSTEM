const Payment = require("../models/Payment");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Existing createOrder (unchanged)
exports.createOrder = async (req, res) => {
  try {
    const { admissionId, amount, currency, courseName, paymentMethod } = req.body;

    if (!admissionId || !amount || !courseName || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const payment = new Payment({
      admissionId,
      courseName,
      amount,
      currency,
      status: "pending",
      transactionId: order.id,
      paymentMethod,
    });

    await payment.save();
    console.log("Payment saved:", payment); // Debug log

    res.status(201).json({
      message: "Order created",
      orderId: order.id,
      amount: order.amount,
      payment,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ message: "Error creating order", error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: "Missing payment verification data" });
    }

    const crypto = require("crypto");
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const paymentDetails = await razorpay.payments.fetch(paymentId);
    if (paymentDetails.status !== "captured") {
      throw new Error("Payment not captured by Razorpay");
    }

    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: orderId },
      { status: "completed", transactionId: paymentId },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    console.log("Payment verified and updated:", updatedPayment); // Debug log
    res.status(200).json({ message: "Payment verified", payment: updatedPayment });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
};

// Existing verifyPayment (unchanged)
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: "Missing payment verification data" });
    }

    const crypto = require("crypto");
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const paymentDetails = await razorpay.payments.fetch(paymentId);
    if (paymentDetails.status !== "captured") {
      throw new Error("Payment not captured by Razorpay");
    }

    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: orderId },
      { status: "completed", transactionId: paymentId },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment verified", payment: updatedPayment });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
};

// Existing getPayments (unchanged)
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().lean();
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};

// New endpoint for admin to update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { transactionId, status } = req.body;

    if (!transactionId || !status) {
      return res.status(400).json({ message: "Missing transactionId or status" });
    }

    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId },
      { status },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment status updated", payment: updatedPayment });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Error updating payment status", error: error.message });
  }
};