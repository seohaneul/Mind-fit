// =============================================================================
// Mind-Fit Backend Server
// =============================================================================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mindfit";
const NODE_ENV = process.env.NODE_ENV || "development";

// =============================================================================
// Middleware Configuration
// =============================================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// =============================================================================
// Database Connection
// =============================================================================
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log(`📍 Database: ${MONGO_URI}`);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    if (NODE_ENV === "production") {
      process.exit(1);
    } else {
      console.log("⚠️  Running in development mode without database");
    }
  });

// =============================================================================
// Models
// =============================================================================
const Facility = require(path.join(__dirname, "model", "Facility"));
const Program = require(path.join(__dirname, "model", "Program"));
let Stat;
try {
  Stat = require(path.join(__dirname, "model", "Stat"));
} catch (e) {
  Stat = mongoose.models.Stat;
}

// =============================================================================
// Routes - Health & Basic Endpoints
// =============================================================================

// Health check endpoint
app.get("/health", (req, res) => {
  const healthCheck = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  };
  res.json(healthCheck);
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Mind-Fit API Server",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      facilities: "/api/facilities",
      programs: "/api/programs",
      stats: "/api/stats",
      logs: "/api/logs",
    },
  });
});

// =============================================================================
// Routes - Programs CRUD
// =============================================================================
app.get("/api/programs", async (req, res) => {
  try {
    const programs = await Program.find().populate("facility").lean();
    res.json(programs);
  } catch (err) {
    console.error("Error fetching programs:", err);
    res.status(500).json({
      error: "Failed to fetch programs",
      details: err.message
    });
  }
});

app.post("/api/programs", async (req, res) => {
  try {
    const doc = new Program(req.body);
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error("Error creating program:", err);
    res.status(500).json({
      error: "Failed to create program",
      details: err.message
    });
  }
});

// =============================================================================
// Routes - Import Module Routes
// =============================================================================
const facilitiesRouter = require("./routes/facilities");
const statsRouter = require("./routes/stats");
const logsRouter = require("./routes/logs");

app.use("/api/facilities", facilitiesRouter);
app.use("/api/stats", statsRouter);
app.use("/api/logs", logsRouter);

// =============================================================================
// Error Handling Middleware
// =============================================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: ["/health", "/api/facilities", "/api/programs", "/api/stats", "/api/logs"],
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
});

// =============================================================================
// Server Startup
// =============================================================================
const server = app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 Mind-Fit Server Started");
  console.log("=".repeat(60));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`📊 Database: ${mongoose.connection.readyState === 1 ? "✅ Connected" : "⚠️  Disconnected"}`);
  console.log("=".repeat(60) + "\n");
});

// =============================================================================
// Graceful Shutdown
// =============================================================================
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received, closing server and MongoDB connection...`);
  server.close(() => {
    console.log("✅ HTTP server closed");
    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

