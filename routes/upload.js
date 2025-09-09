// ─────────────────────────────────────────────
//   Import dependencies
// ─────────────────────────────────────────────
const express = require('express');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const verifyToken = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────
//   Set FFmpeg and FFprobe paths for Docker
// ─────────────────────────────────────────────
ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
ffmpeg.setFfprobePath('/usr/bin/ffprobe');

// ─────────────────────────────────────────────
//   Create router
// ─────────────────────────────────────────────

const router = express.Router();

// ─────────────────────────────────────────────
//   POST /api/upload
// ─────────────────────────────────────────────
router.post('/', verifyToken, (req, res) => {
  console.log('Upload request from:', req.user?.username);
  console.log('Incoming files:', req.files);

  if (!req.files || !req.files.video) {
    console.warn('No video file found in request');
    return res.status(400).json({ message: 'No video file uploaded' });
  }

  const video = req.files.video;
  const filename = `${Date.now()}_${video.name}`;
  const uploadsDir = path.join(__dirname, '../uploads');
  const uploadPath = path.join(uploadsDir, filename);

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory:', uploadsDir);
  }

  console.log('Saving file:', video.name);
  console.log('Destination path:', uploadPath);

  // Move file to uploads folder
  video.mv(uploadPath, (err) => {
    if (err) {
      console.error('File move error:', err.message);
      return res.status(500).json({ message: 'Upload failed', error: err.message });
    }

    if (!fs.existsSync(uploadPath)) {
      console.error('File not found after saving');
      return res.status(500).json({ message: 'File not found after saving' });
    }

    // Get file size in MB
    let sizeMB = '0.00';
    try {
      const stats = fs.statSync(uploadPath);
      sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log('File size (MB):', sizeMB);
    } catch (err) {
      console.error('Failed to get file size:', err.message);
    }

    // Extract video duration with ffprobe
    ffmpeg.ffprobe(uploadPath, (err, metadata) => {
      console.log('Running ffprobe on:', uploadPath);

      if (err) {
        console.error('ffprobe error:', err.message);
        return res.status(500).json({ message: 'Failed to analyze video duration', error: err.message });
      }

      const duration = metadata?.format?.duration
        ? metadata.format.duration.toFixed(2)
        : '0.00';

      if (duration === '0.00') {
        console.warn('Duration missing or zero');
      }

      const newMetadata = {
        user: req.user.username,
        filename,
        originalName: video.name,
        uploadedAt: new Date().toISOString(),
        sizeMB,
        duration
      };

      const metadataPath = path.join(__dirname, '../metadata.json');
      let existing = [];

      if (fs.existsSync(metadataPath)) {
        try {
          const raw = fs.readFileSync(metadataPath, 'utf8');
          existing = raw.trim() ? JSON.parse(raw) : [];
        } catch (err) {
          console.error('Failed to parse metadata.json:', err.message);
        }
      }

      existing.push(newMetadata);
      try {
        fs.writeFileSync(metadataPath, JSON.stringify(existing, null, 2));
        console.log('Metadata updated:', newMetadata);
      } catch (err) {
        console.error('Failed to write metadata:', err.message);
      }

      res.json({ message: 'Upload successful', file: filename });
    });
  });
});

module.exports = router;