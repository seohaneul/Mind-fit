const express = require("express");
const path = require("path");
const Stat = require(path.join(__dirname, "..", "model", "stat"));
const router = express.Router();
import { requireAuth } from "../middleware/auth.js";
Router.use(requireAuth);
// GET /api/stats/ -> 모든 통계 데이터 반환 (쿼리 파라미터로 필터링 가능)
// Example: /api/stats?ageGroup=20s&gender=M
router.get("/", getStats);

// GET /api/stats/average -> 평균값 계산
// Example: /api/stats/average?ageGroup=20s&gender=M
router.get("/average", getAverageStats);
 

module.exports = router;

