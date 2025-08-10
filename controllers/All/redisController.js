// redisController.js
import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect();

export const setRedisValue = async (key, value, expireSeconds = null) => {
  if (expireSeconds) {
    return await redisClient.set(key, value, { EX: expireSeconds });
  } else {
    return await redisClient.set(key, value);
  }
};

export const getRedisValue = async (key) => {
  return await redisClient.get(key);
};

export const deleteRedisValue = async (key) => {
  return await redisClient.del(key);
};

export const redisClientInstance = redisClient;
