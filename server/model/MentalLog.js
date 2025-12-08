// ...existing code...
const mongoose = require("mongoose");

const MentalLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true, default: Date.now },
    mood: { type: String },
    stress: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.MentalLog || mongoose.model("MentalLog", MentalLogSchema);
// ...existing code...
