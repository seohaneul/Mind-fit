const express = require("express");
const path = require("path");
const Stat = require(path.join("..", "model", "Stat"));
const router = express.Router();

// GET /api/stats/ -> 모든 통계 데이터 반환
router.get("/", async (req, res) => {
  try {
    const stats = await Stat.find().lean();
    res.json(stats);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch stats", details: err.message });
  }
});

module.exports = router;
