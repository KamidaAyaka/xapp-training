// server/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../db");
require("dotenv").config();

const router = express.Router();

// POST /api/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "username and password required" });

    const [rows] = await pool.query(
      "SELECT id, password_hash FROM users WHERE username = ? LIMIT 1",
      [username]
    );
    if (rows.length === 0)
      return res.status(401).json({ error: "invalid credentials" });

    const user = rows[0];

    // bcryptではなく平文比較を使う場合（研修中用）：
    if (password !== user.password_hash)
      return res.status(401).json({ error: "invalid credentials" });

    // トークン発行
    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "8h" }
    );

    res.json({ token, userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
