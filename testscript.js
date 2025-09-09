// ─────────────────────────────────────────────
// Load Testing Script for Transcoding Endpoint
// Sends 1 request every 2 seconds for 5 minutes to simulate sustained CPU load
// ─────────────────────────────────────────────

const axios = require('axios');

// Use EC2 public IP or Docker bridge IP if running inside EC2
const API_URL = 'http://3.27.219.164/api/transcode';

// Valid JWT token from login
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJiZW4iLCJpYXQiOjE3NTY1MzYzODQsImV4cCI6MTc1NjU0MzU4NH0.KwrcV-rYIs8Z_tPzWJYx-JKzsK0Fb9SARqKbzDMh_Ok';

// Filename must exist in /uploads on EC2
const FILENAME = '1755857725065_1755748950948_Yee.mp4';

// Total requests and interval between each
const TOTAL_REQUESTS = 20;
const INTERVAL_MS = 2000; // 2 seconds

// Send a single POST request to /api/transcode
async function sendRequest(label) {
  try {
    console.log(`Request ${label}: Sending with filename: ${FILENAME}`);
    const res = await axios.post(API_URL, { filename: FILENAME }, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`Request ${label}: Success`, res.data);
  } catch (err) {
    console.error(`Request ${label}: Failed`, err.response?.data || err.message);
  }
}

// Run requests spaced 2 seconds apart
(async () => {
  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    await sendRequest(i);
    if (i < TOTAL_REQUESTS) {
      await new Promise(resolve => setTimeout(resolve, INTERVAL_MS));
    }
  }
})();