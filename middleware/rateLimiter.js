const rateLimitMap = new Map();

const createRateLimiter = ({ windowMs = 60000, maxRequests = 100, message = 'Too many requests, please try again later.' } = {}) => {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now - entry.startTime >= windowMs) {
      rateLimitMap.set(key, { count: 1, startTime: now });
      return next();
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.startTime + windowMs - now) / 1000);
      res.set('Retry-After', retryAfter.toString());
      return res.status(429).json({
        message,
        retryAfterSeconds: retryAfter
      });
    }

    entry.count += 1;
    rateLimitMap.set(key, entry);
    next();
  };
};

const cleanupIntervalMs = 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.startTime > 5 * 60 * 1000) {
      rateLimitMap.delete(key);
    }
  }
}, cleanupIntervalMs);

module.exports = createRateLimiter;
