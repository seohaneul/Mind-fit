// ...existing code...
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mindfit";

app.use(cors());
app.use(express.json());

// Mongoose 설정 및 연결
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected:", MONGO_URI))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// 기존에 직접 만든 스키마/모델 정의 블록을 제거하고 model 파일을 사용합니다.
const path = require("path");

const Facility = require(path.join(__dirname, "model", "Facility"));
const Program = require(path.join(__dirname, "model", "Program"));
// Stat 모델이 없을 수도 있으므로 안전하게 require 시도
let Stat;
try {
  Stat = require(path.join(__dirname, "model", "Stat"));
} catch (e) {
  Stat = mongoose.models.Stat; // 이미 컴파일된 모델이 있으면 사용
}

// 간단한 라우트: 헬스체크
app.get("/health", (req, res) => res.json({ status: "ok", time: new Date() }));

// Programs CRUD (간단 예시)
app.get("/api/programs", async (req, res) => {
  const programs = await Program.find().populate("facility").lean();
  res.json(programs);
});
app.post("/api/programs", async (req, res) => {
  const doc = new Program(req.body);
  await doc.save();
  res.status(201).json(doc);
});

const facilitiesRouter = require("./routes/facilities");
const statsRouter = require("./routes/stats");
const logsRouter = require("./routes/logs");

app.use("/api/facilities", facilitiesRouter);
app.use("/api/stats", statsRouter);
app.use("/api/logs", logsRouter);

// 서버 시작
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// graceful shutdown
process.on("SIGINT", async () => {
  console.log("SIGINT received, closing server and MongoDB connection...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
});
