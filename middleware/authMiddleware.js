// ─────────────────────────────────────────────
// Import dependencies
// ─────────────────────────────────────────────
require('dotenv').config(); // Load environment variables from .env
const jwt = require('jsonwebtoken');

// Retrieve secret key from environment
const SECRET_KEY = process.env.SECRET_KEY;

// ─────────────────────────────────────────────
// Middleware: Verify JWT token from Authorization header
// ─────────────────────────────────────────────
function verifyToken(req, res, next) {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing token' });

  const token = authHeader.split(' ')[1];

  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, SECRET_KEY);

    // Attach decoded user info to request object
    req.user = decoded;
    next();
  } catch (err) {
    // Token invalid or expired
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}

// ─────────────────────────────────────────────
//  Export middleware for use in protected routes
// ─────────────────────────────────────────────
module.exports = verifyToken;