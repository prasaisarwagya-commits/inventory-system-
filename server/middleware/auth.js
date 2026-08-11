const jwt = require('jsonwebtoken');

// Protects routes: rejects requests without a valid JWT (401/403)
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, username }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired session. Please log in again.' });
  }
}

module.exports = requireAuth;
