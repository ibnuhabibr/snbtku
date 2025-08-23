import { createClient } from 'redis';
import { config } from '../config';
import { logger } from './logger';

// Configuration
const REDIS_URL = config.redis.url;
const CACHE_TTL = {
  SHORT: 60, // 1 minute in seconds
  MEDIUM: 300, // 5 minutes in seconds
  LONG: 1800, // 30 minutes in seconds
  VERY_LONG: 86400 // 24 hours in seconds
};

// Redis client instance
let redisClient: ReturnType<typeof createClient> | null = null;

/**
 * Initialize Redis connection
 */
export async function initRedisClient() {
  try {
    if (!redisClient) {
      redisClient = createClient({
        url: REDIS_URL,
        socket: {
          reconnectStrategy: (retries) => {
            // Exponential backoff with max retry time of 10 seconds
            const delay = Math.min(Math.pow(2, retries) * 100, 10000);
            return delay;
          }
        }
      });

      redisClient.on('error', (err) => {
        logger.error('Redis connection error:', err);
      });

      redisClient.on('connect', () => {
        logger.info('Connected to Redis successfully');
      });

      await redisClient.connect();
    }
    return redisClient;
  } catch (error) {
    logger.error('Failed to initialize Redis client:', error);
    throw error;
  }
}

/**
 * Get cached data from Redis
 * @param key Cache key
 * @returns Cached data or null if not found
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    if (!redisClient?.isOpen) {
      await initRedisClient();
    }
    
    const data = await redisClient?.get(key);
    return data ? JSON.parse(data) as T : null;
  } catch (error) {
    logger.error(`Cache get error for key ${key}:`, error);
    return null;
  }
}

/**
 * Set data in Redis cache
 * @param key Cache key
 * @param data Data to cache
 * @param ttl Time to live in seconds (defaults to 5 minutes)
 */
export async function setCache<T>(key: string, data: T, ttl = CACHE_TTL.MEDIUM): Promise<void> {
  try {
    if (!redisClient?.isOpen) {
      await initRedisClient();
    }
    
    await redisClient?.set(key, JSON.stringify(data), { EX: ttl });
  } catch (error) {
    logger.error(`Cache set error for key ${key}:`, error);
  }
}

/**
 * Delete cache entry
 * @param key Cache key to delete
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    if (!redisClient?.isOpen) {
      await initRedisClient();
    }
    
    await redisClient?.del(key);
  } catch (error) {
    logger.error(`Cache delete error for key ${key}:`, error);
  }
}

/**
 * Delete cache entries by pattern
 * @param pattern Pattern to match keys (e.g. "user:*")
 */
export async function deleteCacheByPattern(pattern: string): Promise<void> {
  try {
    if (!redisClient?.isOpen) {
      await initRedisClient();
    }
    
    // Use SCAN to find keys matching pattern
    let cursor = 0;
    do {
      const result = await redisClient?.scan(cursor, { MATCH: pattern, COUNT: 100 });
      if (!result) break;
      
      const [nextCursor, keys] = result;
      cursor = parseInt(nextCursor);
      
      if (keys.length > 0) {
        await redisClient?.del(keys);
      }
    } while (cursor !== 0);
  } catch (error) {
    logger.error(`Cache pattern delete error for pattern ${pattern}:`, error);
  }
}

/**
 * Create a cached version of an async function
 * @param fn Function to cache
 * @param keyFn Function to generate cache key from arguments
 * @param ttl Time to live in seconds
 */
export function withCache<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  keyFn: (...args: Args) => string,
  ttl = CACHE_TTL.MEDIUM
) {
  return async (...args: Args): Promise<T> => {
    const cacheKey = keyFn(...args);
    const cached = await getCache<T>(cacheKey);
    
    if (cached !== null) {
      return cached;
    }
    
    const result = await fn(...args);
    await setCache(cacheKey, result, ttl);
    return result;
  };
}

// Export TTL constants for use in services
export { CACHE_TTL };
