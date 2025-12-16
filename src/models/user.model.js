const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: { type: String, min: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, min: 8 },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    refreshToken: { type: String }
})

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;