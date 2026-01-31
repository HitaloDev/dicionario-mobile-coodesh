import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from '../storage';
import { FavoriteWord, HistoryWord } from '../../types';

describe('StorageService', () => {
  let storageService: StorageService;

  beforeEach(() => {
    storageService = new StorageService();
    AsyncStorage.clear();
  });

  describe('Favorites', () => {
    it('should return empty array when no favorites exist', async () => {
      const favorites = await storageService.getFavorites();
      expect(favorites).toEqual([]);
    });

    it('should add a favorite word', async () => {
      await storageService.addFavorite('hello');
      const favorites = await storageService.getFavorites();
      
      expect(favorites).toHaveLength(1);
      expect(favorites[0].word).toBe('hello');
      expect(favorites[0].addedAt).toBeDefined();
    });

    it('should not add duplicate favorites', async () => {
      await storageService.addFavorite('hello');
      await storageService.addFavorite('hello');
      const favorites = await storageService.getFavorites();
      
      expect(favorites).toHaveLength(1);
    });

    it('should remove a favorite word', async () => {
      await storageService.addFavorite('hello');
      await storageService.addFavorite('world');
      await storageService.removeFavorite('hello');
      const favorites = await storageService.getFavorites();
      
      expect(favorites).toHaveLength(1);
      expect(favorites[0].word).toBe('world');
    });

    it('should set favorites list', async () => {
      const newFavorites: FavoriteWord[] = [
        { word: 'test', addedAt: new Date().toISOString() },
        { word: 'example', addedAt: new Date().toISOString() },
      ];
      
      await storageService.setFavorites(newFavorites);
      const favorites = await storageService.getFavorites();
      
      expect(favorites).toHaveLength(2);
      expect(favorites[0].word).toBe('test');
      expect(favorites[1].word).toBe('example');
    });
  });

  describe('History', () => {
    it('should return empty array when no history exists', async () => {
      const history = await storageService.getHistory();
      expect(history).toEqual([]);
    });

    it('should add a word to history', async () => {
      await storageService.addToHistory('hello');
      const history = await storageService.getHistory();
      
      expect(history).toHaveLength(1);
      expect(history[0].word).toBe('hello');
      expect(history[0].viewedAt).toBeDefined();
    });

    it('should move existing word to top of history', async () => {
      await storageService.addToHistory('hello');
      await storageService.addToHistory('world');
      await storageService.addToHistory('hello');
      const history = await storageService.getHistory();
      
      expect(history).toHaveLength(2);
      expect(history[0].word).toBe('hello');
      expect(history[1].word).toBe('world');
    });

    it('should limit history to 100 items', async () => {
      for (let i = 0; i < 150; i++) {
        await storageService.addToHistory(`word${i}`);
      }
      const history = await storageService.getHistory();
      
      expect(history).toHaveLength(100);
    });

    it('should clear all history', async () => {
      await storageService.addToHistory('hello');
      await storageService.addToHistory('world');
      await storageService.clearHistory();
      const history = await storageService.getHistory();
      
      expect(history).toEqual([]);
    });

    it('should set history list', async () => {
      const newHistory: HistoryWord[] = [
        { word: 'test', viewedAt: new Date().toISOString() },
        { word: 'example', viewedAt: new Date().toISOString() },
      ];
      
      await storageService.setHistory(newHistory);
      const history = await storageService.getHistory();
      
      expect(history).toHaveLength(2);
      expect(history[0].word).toBe('test');
      expect(history[1].word).toBe('example');
    });
  });
});
