const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  // New fields for personalized stats
  age: { type: Number, required: true },
  gender: { type: String, enum: ['M', 'F'], required: true }, // 'M' for Male, 'F' for Female
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
