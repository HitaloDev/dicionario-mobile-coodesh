import 'reflect-metadata';
import { injectable } from 'tsyringe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word } from '../types';

const CACHE_PREFIX = '@dictionary:cache:';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

interface CacheItem {
  data: Word;
  timestamp: number;
}

@injectable()
export class CacheService {
  async get(key: string): Promise<Word | null> {
    try {
      const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
      
      if (!cached) {
        return null;
      }
      
      const item: CacheItem = JSON.parse(cached);
      const now = Date.now();
      
      if (now - item.timestamp > CACHE_EXPIRATION) {
        await this.remove(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.error('Error getting from cache:', error);
      return null;
    }
  }

  async set(key: string, data: Word): Promise<void> {
    try {
      const item: CacheItem = {
        data,
        timestamp: Date.now(),
      };
      
      await AsyncStorage.setItem(
        `${CACHE_PREFIX}${key}`,
        JSON.stringify(item)
      );
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (error) {
      console.error('Error removing from cache:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export const cacheService = new CacheService();
