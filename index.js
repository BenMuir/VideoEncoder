// ─────────────────────────────────────────────
// Import dependencies
// ─────────────────────────────────────────────
const express = require('express');
const fileUpload = require('express-fileupload'); // Middleware for handling file uploads
const path = require('path');
const cors = require('cors'); // Enable cross-origin requests

// Initialize Express app
const app = express();

// ─────────────────────────────────────────────
// Global Middleware
// ─────────────────────────────────────────────
app.use(express.json());       // Parse incoming JSON request bodies
app.use(fileUpload());         // Enable file upload handling via req.files
app.use(cors());               // Allow frontend to communicate with backend

// ─────────────────────────────────────────────
// Static File Serving
// ─────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'frontend'))); // Serve frontend assets (HTML, CSS, JS)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded videos for preview/download

// ─────────────────────────────────────────────
// API Route Mounting
// ─────────────────────────────────────────────
app.use('/api/upload', require('./routes/upload'));         // Upload endpoint
app.use('/api/auth', require('./routes/auth'));             // Login/authentication
app.use('/api/list', require('./routes/list'));             // List user’s uploaded videos
app.use('/api/transcode', require('./routes/transcode'));   // Transcode video files
app.use('/api/download', require('./routes/download'));     // Download video files
app.use('/api/delete', require('./routes/delete'));         // Delete video files

// ─────────────────────────────────────────────
// Root Route: Serve main HTML page
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ─────────────────────────────────────────────
// Fallback Route: Handle unknown endpoints
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});