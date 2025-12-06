const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProgramSchema = new Schema(
  {
    programName: { type: String, required: true }, // 프로그램명 (예: 요가)
    category: { type: String }, // 예: 힐링, 도전
    centerName: { type: String }, // 운영 센터 이름
    facilityId: { type: Schema.Types.ObjectId, ref: "Facility" }, // 선택적: Facility와 연결
  },
  { timestamps: true }
);

module.exports = mongoose.models.Program || mongoose.model("Program", ProgramSchema);
