// ─────────────────────────────────────────────
// Import dependencies
// ─────────────────────────────────────────────
const express = require('express');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middleware/authMiddleware'); // JWT auth middleware

const router = express.Router();

// ─────────────────────────────────────────────
// DELETE /api/delete
// Requires: { filename }
// Authenticated route — only the owner can delete their file
// ─────────────────────────────────────────────
router.delete('/', verifyToken, async (req, res) => {
  const { filename } = req.body;

  // Validate input
  if (!filename) {
    return res.status(400).json({ message: 'Missing filename' });
  }

  // Construct file and metadata paths
  const filePath = path.join(__dirname, '../uploads', filename);
  const metadataPath = path.join(__dirname, '../metadata.json');

  // Check if file exists on disk
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found on server' });
  }

  // Load metadata file (if exists)
  let metadata = [];
  if (fs.existsSync(metadataPath)) {
    try {
      const raw = fs.readFileSync(metadataPath, 'utf8');
      metadata = raw.trim() ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('Failed to parse metadata.json:', err.message);
      return res.status(500).json({ message: 'Metadata read error' });
    }
  }

  // Check ownership — only allow deletion if user owns the file
  const entry = metadata.find(v => v.filename === filename && v.user === req.user.username);
  if (!entry) {
    return res.status(403).json({ message: 'You do not have permission to delete this file' });
  }

  try {
    // Delete file from disk
    await fs.promises.unlink(filePath);
  } catch (err) {
    console.error('Failed to delete file:', err.message);
    return res.status(500).json({ message: 'File deletion error' });
  }

  // Remove file entry from metadata
  const updated = metadata.filter(v => v.filename !== filename);
  try {
    fs.writeFileSync(metadataPath, JSON.stringify(updated, null, 2));
  } catch (err) {
    console.error('Failed to update metadata.json:', err.message);
    return res.status(500).json({ message: 'Metadata update error' });
  }

  // Respond with success
  res.json({ message: 'File deleted successfully', file: filename });
});

// ─────────────────────────────────────────────
// Export router for use in main app
// ─────────────────────────────────────────────
module.exports = router;