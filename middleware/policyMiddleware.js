const policies = require('../config/policyConfig');

const authorize = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user && req.user.role;

    if (!userRole) {
      return res.status(403).json({
        message: 'User role is missing from token.'
      });
    }

    const allowedPermissions = policies[userRole];

    if (!allowedPermissions) {
      return res.status(403).json({
        message: 'No policy found for this role.'
      });
    }

    if (!allowedPermissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: 'Policy enforcement failed. Access denied.'
      });
    }

    next();
  };
};

module.exports = authorize;
