// ─────────────────────────────────────────────
// Import dependencies
// ─────────────────────────────────────────────
const express = require('express');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middleware/authMiddleware'); // 🔐 JWT auth middleware

// Create a new router instance
const router = express.Router();

// ─────────────────────────────────────────────
// GET /api/download
// Requires: ?filename=yourfile.mp4
// Authenticated route — only accessible with valid token
// ─────────────────────────────────────────────
router.get('/', verifyToken, (req, res) => {
  // Extract filename from query parameters
  const { filename } = req.query;

  // Validate input
  if (!filename) return res.status(400).json({ message: 'Missing filename' });

  // Construct full path to the requested file
  const filePath = path.join(__dirname, '../uploads', filename);

  // Check if file exists on disk
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  // Send file as a download response
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Download error:', err.message);
      res.status(500).json({ message: 'Download failed' });
    }
  });
});

// ─────────────────────────────────────────────
// Export router for use in main app
// ─────────────────────────────────────────────
module.exports = router;