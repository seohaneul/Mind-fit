const express = require("express");
const path = require("path");
const Facility = require(path.join(__dirname, "..", "model", "Facility"));
const router = express.Router();
import { getFacilities, getNearbyFacilities, getSearchFacilities } from "../controller/Facilities.controller.js";
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/facilities/  -> 모든 시설 (limit 100)
router.get("/", getFacilities);

// GET /api/facilities/nearby?lat=...&lon=...  -> 반경 5km (location 사용)
router.get("/nearby", getNearbyFacilities);

// NEW: GET /api/facilities/search?keyword=요가
// 검색어가 facilityName 또는 address에 포함된 문서 최대 5개 반환 (case-insensitive)
router.get("/search", getSearchFacilities);

module.exports = router;
