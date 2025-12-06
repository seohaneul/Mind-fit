const express = require("express");
const path = require("path");
const User = require(path.join(__dirname, "..", "model", "user"));
const router = express.Router();

// POST /api/auth/login
// Simple "login" that creates a user if not exists based on email/username
router.post("/login", async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        // Simple find or create
        let user = await User.findOne({ email: username }).exec(); // treating username as email/id
        if (!user) {
            user = await User.create({
                email: username,
                password: "default_password_for_prototype", // In real app, hash this
                name: username
            });
        }

        res.json({
            _id: user._id,
            email: user.email,
            name: user.name || user.email
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;
