const express = require("express");
const path = require("path");
const Facility = require(path.join(__dirname, "..", "model", "Facility"));
const router = express.Router();

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/facilities/  -> 모든 시설 (limit 100)
router.get("/", async (req, res) => {
  try {
    const facilities = await Facility.find().limit(100).lean();
    res.json(facilities);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch facilities", details: err.message });
  }
});

// GET /api/facilities/nearby?lat=...&lon=...  -> 반경 5km (location 사용)
router.get("/nearby", async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return res.status(400).json({
        error: "lat and lon query parameters are required and must be numbers",
      });
    }

    const maxDistance = 5000; // meters
    const docs = await Facility.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lon, lat] },
          $maxDistance: maxDistance,
        },
      },
    })
      .limit(100)
      .lean();

    res.json(docs);
  } catch (err) {
    // Geo queries can throw if no index or bad data
    res
      .status(500)
      .json({ error: "Nearby query failed", details: err.message });
  }
});

// NEW: GET /api/facilities/search?keyword=요가
// 검색어가 facilityName 또는 address에 포함된 문서 최대 5개 반환 (case-insensitive)
router.get("/search", async (req, res) => {
  try {
    const keyword = (req.query.keyword || "").trim();
    if (!keyword)
      return res
        .status(400)
        .json({ error: "keyword query parameter is required" });

    const re = new RegExp(escapeRegex(keyword), "i");
    const docs = await Facility.find({
      $or: [{ facilityName: { $regex: re } }, { address: { $regex: re } }],
    })
      .limit(5)
      .select("facilityName address location")
      .lean();

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Search failed", details: err.message });
  }
});

module.exports = router;
