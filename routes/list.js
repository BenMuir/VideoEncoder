// ─────────────────────────────────────────────
// Import dependencies
// ─────────────────────────────────────────────
const express = require('express');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middleware/authMiddleware'); // JWT auth middleware

// Create a new router instance
const router = express.Router();

// ─────────────────────────────────────────────
// GET /api/list
// Returns a list of videos uploaded by the authenticated user
// ─────────────────────────────────────────────

router.get('/', verifyToken, (req, res) => {
  // Path to metadata file containing video info
  const metadataPath = path.join(__dirname, '../metadata.json');

  // If metadata file doesn't exist, return empty list
  if (!fs.existsSync(metadataPath)) {
    return res.json({ videos: [] });
  }

  try {
    // Read and parse metadata.json
    const raw = fs.readFileSync(metadataPath, 'utf8');
    const allVideos = raw.trim() ? JSON.parse(raw) : [];

    // Filter videos belonging to the authenticated user
    const userVideos = allVideos.filter(video => video.user === req.user.username);

    // Respond with user's video list
    res.json({ videos: userVideos });
  } catch (err) {
    // Handle JSON parsing or file read errors
    console.error('Failed to read metadata:', err.message);
    res.status(500).json({ message: 'Could not retrieve video list' });
  }
});

// ─────────────────────────────────────────────
// Export router for use in main app
// ─────────────────────────────────────────────

module.exports = router;