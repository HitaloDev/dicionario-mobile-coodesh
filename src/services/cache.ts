import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word } from '../types';

const CACHE_PREFIX = '@dictionary_cache:';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

interface CacheItem {
  data: Word;
  timestamp: number;
}

export const cacheService = {
  async get(key: string): Promise<Word | null> {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (!cached) {
        return null;
      }

      const cacheItem: CacheItem = JSON.parse(cached);
      const now = Date.now();

      if (now - cacheItem.timestamp > CACHE_EXPIRATION) {
        await AsyncStorage.removeItem(cacheKey);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  async set(key: string, data: Word): Promise<void> {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const cacheItem: CacheItem = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      await AsyncStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  },
};
