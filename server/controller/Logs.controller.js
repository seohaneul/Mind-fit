// Helper to get user ID from header
const getUserId = (req) => {
  const uid = req.headers["x-user-id"];
  if (!uid) throw new Error("Unauthorized: User Login Required");
  return uid;
};

export const createPhysicalLog = async (req, res) => {
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
}

export const getPhysicalLogs = async (req, res) => {
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
}

export const getLatestPhysicalLog = async (req, res) => {
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
}

export const createMentalLog = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { mood, stress, energy, note } = req.body; // Added stress
    const date = req.body.date ? new Date(req.body.date) : new Date();

    const doc = await MentalLog.create({
      user: userId,
      date,
      mood,
      stress, // Added stress
      energy,
      notes: note, // Client sends 'note', schema has 'notes' (or check schema again? Schema has 'notes' in line 9 of MentalLog.js, but I should verify if I changed it. I just changed it to keep notes.) 
      // Wait, previous file view of MentalLog.js showed `notes: { type: String }`.
      // LandingPage sends `note`. App.jsx state is `userNote`.
      // I will map `note` from body to `notes` in DB or `note` if I change schema?
      // The schema has `notes`. I will map it here.
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error("Error saving mental log:", err);
    res.status(err.message.includes("Unauthorized") ? 401 : 500)
      .json({ error: "Failed to save mental log", details: err.message });
  }
}

export const getMentalLogs = async (req, res) => {
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
}

export const getLatestMentalLog = async (req, res) => {
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
}

export const resetLogs = async (req, res) => {
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
}

export default {
  createPhysicalLog,
  getPhysicalLogs,
  getLatestPhysicalLog,
  createMentalLog,
  getMentalLogs,
  getLatestMentalLog,
  resetLogs
}