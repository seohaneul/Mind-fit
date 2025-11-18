const express = require("express");
const path = require("path");
const PhysicalLog = require(path.join("..", "model", "PhysicalLog"));
const User = require(path.join("..", "model", "user"));
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

// POST /api/logs/physical  -> 신체 기록 저장
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
    res
      .status(500)
      .json({ error: "Failed to fetch physical logs", details: err.message });
  }
});

module.exports = router;
