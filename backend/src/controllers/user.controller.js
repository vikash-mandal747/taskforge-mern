require('dotenv').config();
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const JWT_SECRETKEY = process.env.JWT_SECRET;

const registerUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter all required fields." });
        }
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await UserModel.create({ ...req.body, password: hashedPassword });

        if (user) {
            res.status(201).json({ message: "User registered successfully.", user });
        } else {
            res.status(400).json({ message: "Invalid user data." });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration." });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: "Invalid Credentials!" });
        }

        bcrypt.compare(password, user.password, async (err, result) => {
            if (err) {
                return res.status(500).json({ msg: "Internal Server Error!" });
            }

            if (!result) {
                return res.status(401).json({ msg: "Invalid Credentials!" });
            }

            // ✅ ACCESS TOKEN (USED FOR AUTHORIZATION)
            const accessToken = jwt.sign(
                { userId: user._id, role: user.role },
                JWT_SECRETKEY,
                { expiresIn: "5m" }
            );

            // ⚠️ REFRESH TOKEN (NOT USED IN MIDDLEWARE)
            const refreshToken = jwt.sign(
                { userId: user._id, role: user.role },
                JWT_SECRETKEY,
                { expiresIn: "7h" }
            );

            user.refreshToken = refreshToken;
            await user.save();

            return res.status(200).json({
                msg: "Login Success!",
                accessToken,   // 👈 THIS must be used in Authorization header
                refreshToken
            });
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error",
            error: error.message
        });
    }
};


module.exports = { registerUser, loginUser };   