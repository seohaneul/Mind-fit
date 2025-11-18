const mongoose = require("mongoose");
const { Schema } = mongoose;

const PhysicalLogSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true, default: Date.now },
    metrics: { type: Schema.Types.Mixed, default: {} }, // flexible, e.g. { "run_time_sec": 300 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PhysicalLog", PhysicalLogSchema);
