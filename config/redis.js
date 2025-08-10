// redisClient.js
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Optional: Use environment variables to configure Redis (recommended for production)
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost', // default localhost
  port: process.env.REDIS_PORT || 6379,       // default Redis port
  password: process.env.REDIS_PASSWORD || undefined, // optional password
  db: 0, // Default DB index
  // retryStrategy: times => Math.min(times * 50, 2000) // optional reconnection strategy
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

export default redis;
