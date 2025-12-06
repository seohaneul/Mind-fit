const express = require("express");
const path = require("path");
const PhysicalLog = require(path.join(__dirname, "..", "model", "PhysicalLog"));
const MentalLog = require(path.join(__dirname, "..", "model", "MentalLog"));
const User = require(path.join(__dirname, "..", "model", "user"));
const router = express.Router();

// helper: ensure test user exists and return its _id
async function ensureTestUser() {
  const email = "test_user@local";
  let user = await User.findOne({ email }).exec();
  if (!user) {
    user = await User.create({ email, password: "test" });
  }
  return user._id;
}

// =============================================================================
// Physical Logs Routes
// =============================================================================

// POST /api/logs/physical -> 신체 기록 저장
router.post("/physical", async (req, res) => {
  try {
    const metrics = req.body.metrics || {};
    const date = req.body.date ? new Date(req.body.date) : new Date();
    const userId = await ensureTestUser();

    const doc = await PhysicalLog.create({
      user: userId,
      date,
      metrics,
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error("Error saving physical log:", err);
    res
      .status(500)
      .json({ error: "Failed to save physical log", details: err.message });
  }
});

// GET /api/logs/physical -> 모든 신체 기록 (test user), 날짜순(desc)
router.get("/physical", async (req, res) => {
  try {
    const userId = await ensureTestUser();
    const logs = await PhysicalLog.find({ user: userId })
      .sort({ date: -1 })
      .lean();
    res.json(logs);
  } catch (err) {
    console.error("Error fetching physical logs:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch physical logs", details: err.message });
  }
});

// GET /api/logs/physical/latest -> 가장 최근 신체 기록
router.get("/physical/latest", async (req, res) => {
  try {
    const userId = await ensureTestUser();
    const latestLog = await PhysicalLog.findOne({ user: userId })
      .sort({ date: -1 })
      .lean();

    if (!latestLog) {
      return res.status(404).json({
        error: "No physical log found",
        message: "Please create your first physical log"
      });
    }

    res.json(latestLog);
  } catch (err) {
    console.error("Error fetching latest physical log:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch latest physical log", details: err.message });
  }
});

// =============================================================================
// Mental Logs Routes
// =============================================================================

// POST /api/logs/mental -> 마음 상태 기록 저장
router.post("/mental", async (req, res) => {
  try {
    const { mood, stress, energy, note } = req.body;
    const date = req.body.date ? new Date(req.body.date) : new Date();
    const userId = await ensureTestUser();

    const doc = await MentalLog.create({
      user: userId,
      date,
      mood,
      stress,
      energy,
      note,
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error("Error saving mental log:", err);
    res
      .status(500)
      .json({ error: "Failed to save mental log", details: err.message });
  }
});

// GET /api/logs/mental -> 모든 마음 기록 (test user), 날짜순(desc)
router.get("/mental", async (req, res) => {
  try {
    const userId = await ensureTestUser();
    const logs = await MentalLog.find({ user: userId })
      .sort({ date: -1 })
      .lean();
    res.json(logs);
  } catch (err) {
    console.error("Error fetching mental logs:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch mental logs", details: err.message });
  }
});

// GET /api/logs/mental/latest -> 가장 최근 마음 기록
router.get("/mental/latest", async (req, res) => {
  try {
    const userId = await ensureTestUser();
    const latestLog = await MentalLog.findOne({ user: userId })
      .sort({ date: -1 })
      .lean();

    if (!latestLog) {
      return res.status(404).json({
        error: "No mental log found",
        message: "Please create your first mental log"
      });
    }

    res.json(latestLog);
  } catch (err) {
    console.error("Error fetching latest mental log:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch latest mental log", details: err.message });
  }
});

module.exports = router;

