// ...existing code...
const mongoose = require("mongoose");

const MentalLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true, default: Date.now },
    mood: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MentalLog", MentalLogSchema);
// ...existing code...
