const express = require("express");
const path = require("path");
const User = require(path.join(__dirname, "..", "model", "user"));
const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { email, password, name, age, gender } = req.body;

        // Basic validation
        if (!email || !password || !name || !age || !gender) {
            return res.status(400).json({ error: "모든 필드를 입력해야 합니다." });
        }

        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(400).json({ error: "이미 존재하는 이메일입니다." });
        }

        const user = await User.create({
            email,
            password, // Note: In production, hash this password!
            name,
            age: Number(age),
            gender
        });

        res.status(201).json({ message: "회원가입 성공" });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: "회원가입 중 오류가 발생했습니다." });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "이메일과 비밀번호를 입력하세요." });
        }

        // Find user by email
        const user = await User.findOne({ email }).exec();

        // Simple password check (PlainText for prototype)
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "이메일 또는 비밀번호가 일치하지 않습니다." });
        }

        res.json({
            _id: user._id,
            email: user.email,
            name: user.name,
            age: user.age,
            gender: user.gender
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "로그인 중 서버 오류가 발생했습니다." });
    }
});

module.exports = router;
