/**
 * Middleware to check if the user has the required role
 * @param {Array|String} roles - Role or array of roles allowed to access the route
 * @returns {Function} - Express middleware function
 */
module.exports = function checkRole(roles) {
  // Convert string to array if only one role is provided
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return function(req, res, next) {
    // Auth middleware should be called before this middleware
    if (!req.user) {
      console.error('checkRole middleware used without auth middleware');
      return res.status(500).json({ msg: 'Server configuration error' });
    }

    console.log(`Role check: User role ${req.user.role}, Required roles: ${roles.join(', ')}`);

    if (roles.includes(req.user.role)) {
      next();
    } else {
      console.log(`Access denied: User role ${req.user.role} not in allowed roles [${roles.join(', ')}]`);
      return res.status(403).json({ 
        msg: 'Access denied. You do not have the required role for this resource.'
      });
    }
  };
}; 