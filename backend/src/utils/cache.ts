import redis from '../config/redis';

export async function setCache(key: string, data: any, ttl = 300): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(data));
}

export async function getCache<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.stringify(data) as T;
}

export async function deleteCache(key: string): Promise<void> {
    await redis.del(key);
}

export async function deleteCachePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
        await redis.del(...keys);
    }
}