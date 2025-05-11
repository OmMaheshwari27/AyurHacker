const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  console.log('Headers received:', JSON.stringify(req.headers));
  
  // Get token from various header formats
  let token = req.header('x-auth-token') || 
              req.header('authorization') || 
              req.header('Authorization');
  
  // Check for Bearer token format
  if (token && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }
  
  // Log the auth attempt
  console.log('Auth middleware accessed, token present:', !!token);

  // Check if no token
  if (!token) {
    console.log('Authentication failed: No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Check for JWT_SECRET
  if (!process.env.JWT_SECRET) {
    console.error('Server Error: JWT_SECRET not defined in environment variables');
    return res.status(500).json({ msg: 'Server configuration error' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Log successful authentication
    console.log('Authentication successful for user:', decoded.user.id);
    console.log('User role:', decoded.user.role);
    
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token format' });
    }
    res.status(401).json({ msg: 'Token is not valid' });
  }
}; 