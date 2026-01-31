import AsyncStorage from '@react-native-async-storage/async-storage';
import { CacheService } from '../cache';
import { Word } from '../../types';

describe('CacheService', () => {
  let cacheService: CacheService;
  const mockWord: Word = {
    word: 'hello',
    phonetics: [{ text: '/həˈloʊ/', audio: 'https://example.com/audio.mp3' }],
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'A greeting',
            example: 'She said hello',
            synonyms: [],
            antonyms: [],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    cacheService = new CacheService();
    AsyncStorage.clear();
  });

  it('should return null when cache is empty', async () => {
    const result = await cacheService.get('hello');
    expect(result).toBeNull();
  });

  it('should cache and retrieve a word', async () => {
    await cacheService.set('hello', mockWord);
    const result = await cacheService.get('hello');
    
    expect(result).toBeDefined();
    expect(result?.word).toBe('hello');
  });

  it('should return null for expired cache', async () => {
    const pastTimestamp = Date.now() - (25 * 60 * 60 * 1000);
    const expiredItem = {
      data: mockWord,
      timestamp: pastTimestamp,
    };
    
    await AsyncStorage.setItem(
      '@dictionary:cache:hello',
      JSON.stringify(expiredItem)
    );
    
    const result = await cacheService.get('hello');
    expect(result).toBeNull();
  });

  it('should remove a cached item', async () => {
    await cacheService.set('hello', mockWord);
    await cacheService.remove('hello');
    const result = await cacheService.get('hello');
    
    expect(result).toBeNull();
  });

  it('should clear all cached items', async () => {
    await cacheService.set('hello', mockWord);
    await cacheService.set('world', mockWord);
    await cacheService.clear();
    
    const result1 = await cacheService.get('hello');
    const result2 = await cacheService.get('world');
    
    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });
});
