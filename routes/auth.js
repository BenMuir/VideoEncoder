// ─────────────────────────────────────────────
// Import dependencies
// ─────────────────────────────────────────────
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ─────────────────────────────────────────────
// 👥 Hardcoded user list (for demo/testing only)
// Replace with database or external auth in production
// ─────────────────────────────────────────────
const users = [
  { id: 1, username: 'ben', password: 'pass123' },
  { id: 2, username: 'admin', password: 'admin123' }
];

// Secret key for JWT signing
const SECRET_KEY = process.env.SECRET_KEY;

// ─────────────────────────────────────────────
// POST /login route: Authenticate user and issue token
// ─────────────────────────────────────────────
router.post('/login', (req, res) => {
  // Extract credentials from request body
  const { username, password } = req.body;

  // Find matching user in hardcoded list
  const user = users.find(u => u.username === username && u.password === password);

  // If no match, return 401 Unauthorized
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // If match, generate JWT token with 2-hour expiry
  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: '2h' }
  );

  // Respond with access token
  res.json({ accessToken: token });
});

// ─────────────────────────────────────────────
// Export router for use in main app
// ─────────────────────────────────────────────
module.exports = router;