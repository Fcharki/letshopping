const buckets = new Map();

const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}, 60 * 1000);

if (typeof cleanup.unref === "function") {
  cleanup.unref();
}

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = "Too many requests, please try again later.",
} = {}) => {
  return (req, res, next) => {
    if (process.env.NODE_ENV === "test") {
      return next();
    }

    const now = Date.now();
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    let bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;

    res.setHeader("RateLimit-Limit", max);
    res.setHeader("RateLimit-Remaining", Math.max(0, max - bucket.count));
    res.setHeader("RateLimit-Reset", Math.ceil(bucket.resetAt / 1000));

    if (bucket.count > max) {
      return res.status(429).json({ message });
    }

    return next();
  };
};
