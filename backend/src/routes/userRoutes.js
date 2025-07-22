const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register); // Changed from "/register" to match Navbar
router.post("/login", login);

module.exports = router;