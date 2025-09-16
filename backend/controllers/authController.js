import jwt from "jsonwebtoken";
import User from "../models/User.js";

/** POST /api/register */
export const register = async (req, res) => {
  const { name, email, password } = req.body || {};
  console.log("REGISTER body:", req.body);

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "name, email, and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already registered" });
    }

    const user = new User({ name, email, password }); // hashed by pre('save')
    await user.save();

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ success: false, message: "Server misconfigured: JWT secret missing" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already registered" });
    }
    console.error("REGISTER_ERROR:", error?.message || error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/** POST /api/login */
export const login = async (req, res) => {
  const { email, password } = req.body || {};
  console.log("LOGIN body:", req.body);

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ success: false, message: "Server misconfigured: JWT secret missing" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Logged in",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("LOGIN_ERROR:", error?.message || error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
