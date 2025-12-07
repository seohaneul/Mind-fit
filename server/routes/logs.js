const express = require("express");
const path = require("path");
const PhysicalLog = require(path.join(__dirname, "..", "model", "PhysicalLog"));
const MentalLog = require(path.join(__dirname, "..", "model", "MentalLog"));
const User = require(path.join(__dirname, "..", "model", "user"));
const router = express.Router();

// Helper: Get user ID from header
const getUserId = (req) => {
  const uid = req.headers["x-user-id"];
  if (!uid) throw new Error("Unauthorized: User Login Required");
  return uid;
};

// =============================================================================
// Physical Logs Routes
// =============================================================================

// POST /api/logs/physical -> 신체 기록 저장
router.post("/physical", async (req, res) => {
  try {
    const userId = getUserId(req);
    const metrics = req.body.metrics || {};
    const date = req.body.date ? new Date(req.body.date) : new Date();

    const doc = await PhysicalLog.create({
      user: userId,
      date,
      metrics,
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error("Error saving physical log:", err);
    res.status(err.message.includes("Unauthorized") ? 401 : 500)
      .json({ error: "Failed to save physical log", details: err.message });
  }
});

// GET /api/logs/physical -> 모든 신체 기록, 날짜순(desc)
router.get("/physical", async (req, res) => {
  try {
    const userId = getUserId(req);
    const logs = await PhysicalLog.find({ user: userId })
      .sort({ date: -1 })
      .lean();
    res.json(logs);
  } catch (err) {
    console.error("Error fetching physical logs:", err);
    res.status(err.message.includes("Unauthorized") ? 401 : 500)
      .json({ error: "Failed to fetch physical logs", details: err.message });
  }
});

// GET /api/logs/physical/latest -> 가장 최근 신체 기록
router.get("/physical/latest", async (req, res) => {
  try {
    const userId = getUserId(req);
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
    res.status(err.message.includes("Unauthorized") ? 401 : 500)
      .json({ error: "Failed to fetch latest physical log", details: err.message });
  }
});

// =============================================================================
// Mental Logs Routes
// =============================================================================

// POST /api/logs/mental -> 마음 상태 기록 저장
router.post("/mental", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { mood, stress, energy, note } = req.body;
    const date = req.body.date ? new Date(req.body.date) : new Date();

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
    res.status(err.message.includes("Unauthorized") ? 401 : 500)
      .json({ error: "Failed to save mental log", details: err.message });
  }
});

// GET /api/logs/mental -> 모든 마음 기록, 날짜순(desc)
router.get("/mental", async (req, res) => {
  try {
    const userId = getUserId(req);
    const logs = await MentalLog.find({ user: userId })
      .sort({ date: -1 })
      .lean();
    res.json(logs);
  } catch (err) {
    console.error("Error fetching mental logs:", err);
    res.status(err.message.includes("Unauthorized") ? 401 : 500)
      .json({ error: "Failed to fetch mental logs", details: err.message });
  }
});

// GET /api/logs/mental/latest -> 가장 최근 마음 기록
router.get("/mental/latest", async (req, res) => {
  try {
    const userId = getUserId(req);
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
    res.status(err.message.includes("Unauthorized") ? 401 : 500)
      .json({ error: "Failed to fetch latest mental log", details: err.message });
  }
});

// DELETE /api/logs/reset -> 모든 기록 초기화
router.delete("/reset", async (req, res) => {
  try {
    const userId = getUserId(req);
    await PhysicalLog.deleteMany({ user: userId });
    await MentalLog.deleteMany({ user: userId });
    res.json({ message: "모든 기록이 초기화되었습니다." });
  } catch (err) {
    console.error("Error resetting logs:", err);
    res.status(err.message.includes("Unauthorized") ? 401 : 500)
      .json({ error: "Failed to reset logs", details: err.message });
  }
});

module.exports = router;

