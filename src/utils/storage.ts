import 'reflect-metadata';
import { injectable } from 'tsyringe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteWord, HistoryWord } from '../types';

const FAVORITES_KEY = '@dictionary:favorites';
const HISTORY_KEY = '@dictionary:history';

@injectable()
export class StorageService {
  async getFavorites(): Promise<FavoriteWord[]> {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  async setFavorites(favorites: FavoriteWord[]): Promise<void> {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error setting favorites:', error);
    }
  }

  async addFavorite(word: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const exists = favorites.some(fav => fav.word === word);
      
      if (!exists) {
        const newFavorite: FavoriteWord = {
          word,
          addedAt: new Date().toISOString(),
        };
        favorites.push(newFavorite);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }

  async removeFavorite(word: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const filtered = favorites.filter(fav => fav.word !== word);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  async getHistory(): Promise<HistoryWord[]> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  async setHistory(history: HistoryWord[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error setting history:', error);
    }
  }

  async addToHistory(word: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const filtered = history.filter(item => item.word !== word);
      
      const newHistoryItem: HistoryWord = {
        word,
        viewedAt: new Date().toISOString(),
      };
      
      filtered.unshift(newHistoryItem);
      
      const limitedHistory = filtered.slice(0, 100);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  }

  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }
}

export const storageService = new StorageService();
