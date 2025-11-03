const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//register
const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const exist = await User.findOne({ email });
        if (exist) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ name, username, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRETKEY,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}; 
//profile

const profile = async (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
};


module.exports = { register, login, profile };
