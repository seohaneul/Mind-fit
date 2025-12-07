const express = require("express");
const path = require("path");
const User = require(path.join(__dirname, "..", "model", "user"));
const router = express.Router("/api/auth");
import { registerUser, loginUser, updateUser, deleteUser } from "../controller/User.Controller.js";


// POST /api/auth/register 유저 로그인 
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);
   

// PUT /api/auth/update 유저 업뎃
router.put("/update", updateUser);
   

// DELETE /api/auth/delete
router.delete("/delete", deleteUser);
  
module.exports = router;
