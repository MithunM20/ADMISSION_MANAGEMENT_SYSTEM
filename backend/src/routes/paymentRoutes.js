const express = require("express");
const { createOrder, verifyPayment, getPayments, updatePaymentStatus } = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/", getPayments);
router.post("/update-status", updatePaymentStatus); // New route for admin

module.exports = router;