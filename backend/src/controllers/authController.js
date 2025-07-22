const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  // Validate role (ensure it’s either "admin" or "student")
  const validRoles = ["admin", "student"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role. Role must be 'admin' or 'student'." });
  }

  // Create new user with the role from the request
  const user = new User({ name, email, password, role });
  await user.save();

  // Generate token
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);

  // Return response with the role
  res.status(201).json({
    token,
    role: user.role,
    name: user.name,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, user: { name: user.name, role: user.role } });
};