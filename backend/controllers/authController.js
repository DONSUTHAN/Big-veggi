const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  address: user.address
});

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(409);
      throw new Error("User already exists. Please login instead.");
    }

    if (role === "admin") {
      res.status(403);
      throw new Error("Admin accounts can only be created by the seed/admin flow.");
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === "farmer" ? "farmer" : "customer",
      phone,
      address
    });

    generateToken(res, user._id);
    // After registration the user receives the same secure cookie as login.

    res.status(201).json(userResponse(user));
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      return res.json(userResponse(user));
    }

    res.status(401);
    throw new Error("Invalid email or password");
  } catch (error) {
    next(error);
  }
};

const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  });
  // Clearing the token cookie logs the browser out.

  res.json({ message: "Logged out successfully" });
};

const getMe = (req, res) => {
  res.json(userResponse(req.user));
};

module.exports = { registerUser, loginUser, logoutUser, getMe };
