const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  balance: { type: Number, default: 500000, min: 0 }, // Saldo inicial de $500,000 COP
  creationDate: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User
