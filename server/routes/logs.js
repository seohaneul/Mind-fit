const express = require("express");
const path = require("path");
// Removed unused model imports since controller handles them
import { createPhysicalLog, getPhysicalLogs, getLatestPhysicalLog, createMentalLog, getMentalLogs, getLatestMentalLog, resetLogs } from "../controller/Logs.controller.js";
const router = express.Router();
import { requireAuth } from "../middleware/auth.js";


// Helper: getUserId moved to controller

router.use(requireAuth);

// =============================================================================
// Physical Logs Routes
// =============================================================================

// POST /api/logs/physical -> 신체 기록 저장
router.post("/physical", createPhysicalLog);


// GET /api/logs/physical -> 모든 신체 기록, 날짜순(desc)
router.get("/physical", getPhysicalLogs);


// GET /api/logs/physical/latest -> 가장 최근 신체 기록
router.get("/physical/latest", getLatestPhysicalLog);

// =============================================================================
// Mental Logs Routes
// =============================================================================

// POST /api/logs/mental -> 마음 상태 기록 저장
router.post("/mental", createMentalLog);;

// GET /api/logs/mental -> 모든 마음 기록, 날짜순(desc)
router.get("/mental", getMentalLogs);



// GET /api/logs/mental/latest -> 가장 최근 마음 기록
router.get("/mental/latest", getLatestMentalLog);



// DELETE /api/logs/reset -> 모든 기록 초기화
router.delete("/reset", resetLogs);


module.exports = router;

