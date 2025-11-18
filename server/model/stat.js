const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
  // 1. 측정 항목 이름 (예: "악력", "BMI", "윗몸일으키기", "체지방률")
  metric: {
    type: String,
    required: true,
  },

  // 2. 연령대 (예: "20대", "30대", "10대")
  ageGroup: {
    type: String,
    required: true,
  },

  // 3. 성별 (예: "M", "F")
  gender: {
    type: String,
    required: true,
  },

  // 4. 평균값 (Raw 데이터에서 우리가 직접 계산한 대한민국 평균 수치)
  mean: {
    type: Number,
    required: true,
  },

  // 5. 백분위 (평균값이니까 기본 50으로 저장됨, 나중에 고도화 가능)
  percentile: {
    type: Number,
    default: 50,
  },
});

// (팁) 나중에 "20대 남성의 악력 평균은?" 하고 찾을 때 검색 속도 빨라지라고 인덱스 걸어둠
statSchema.index({ ageGroup: 1, gender: 1, metric: 1 });

module.exports = mongoose.model("Stat", statSchema);
