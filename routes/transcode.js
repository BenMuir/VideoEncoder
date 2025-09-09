const express = require('express');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const verifyToken = require('../middleware/authMiddleware');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const router = express.Router();

router.post('/', verifyToken, (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    console.log('❌ No filename provided in request body');
    return res.status(400).json({ message: 'Missing filename' });
  }

  const inputPath = path.join(__dirname, '../uploads', filename);
  console.log('📥 Received filename:', filename);
  console.log('📁 Resolved input path:', inputPath);

  if (!fs.existsSync(inputPath)) {
    console.log('❌ File not found at:', inputPath);
    return res.status(404).json({ message: `Original file not found: ${filename}` });
  }

  const outputFilename = `${Date.now()}_transcoded.webm`;
  const outputPath = path.join(__dirname, '../uploads', outputFilename);

  ffmpeg(inputPath)
    .output(outputPath)
    .on('end', () => {
      ffmpeg.ffprobe(outputPath, (err, metadata) => {
        if (err) {
          console.error('ffprobe error:', err.message);
          return res.status(500).json({ message: 'Metadata extraction failed', error: err.message });
        }

        let sizeMB = '0.00';
        try {
          const stats = fs.statSync(outputPath);
          sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        } catch (err) {
          console.error('Failed to get file size:', err.message);
        }

        const duration = metadata?.format?.duration
          ? metadata.format.duration.toFixed(2)
          : '0.00';

        const newMetadata = {
          user: req.user.username,
          filename: outputFilename,
          originalName: filename,
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
          console.log('✅ Metadata updated:', newMetadata);
        } catch (err) {
          console.error('Failed to write metadata:', err.message);
        }

        res.json({ message: 'Transcoding complete', file: outputFilename });
      });
    })
    .on('error', (err) => {
      console.error('Transcoding error:', err.message);
      res.status(500).json({ message: 'Transcoding failed', error: err.message });
    })
    .run();
});

module.exports = router;