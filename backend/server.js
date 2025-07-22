const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db.js");
const path = require("path");

dotenv.config(); // Load .env file once here

const authRoutes = require("./src/routes/userRoutes.js");
const leadRoutes = require("./src/routes/leadRoutes.js");
const admissionRoutes = require("./src/routes/admissionRoutes.js");
const paymentRoutes = require("./src/routes/paymentRoutes.js");

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("AI-Driven CRM API is running...");
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});