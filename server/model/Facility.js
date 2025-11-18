const mongoose = require("mongoose");
const { Schema } = mongoose;

const FacilitySchema = new Schema(
  {
    facilityName: { type: String, required: true }, // 시설명
    address: { type: String }, // 주소
    latitude: { type: Number, required: true }, // 위도
    longitude: { type: Number, required: true }, // 경도
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    metadata: Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// GeoJSON 2dsphere 인덱스
FacilitySchema.index({ location: "2dsphere" });

// 위도/경도 기반으로 location을 자동 채움
FacilitySchema.pre("save", function (next) {
  if (this.longitude != null && this.latitude != null) {
    this.location = {
      type: "Point",
      coordinates: [Number(this.longitude), Number(this.latitude)],
    };
  }
  next();
});

module.exports = mongoose.model("Facility", FacilitySchema);
