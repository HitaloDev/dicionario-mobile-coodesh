import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FavoriteWord, HistoryWord } from '../types';
import { storageService } from '../utils/storage';

interface DictionaryContextData {
  favorites: FavoriteWord[];
  history: HistoryWord[];
  addFavorite: (word: string) => Promise<void>;
  removeFavorite: (word: string) => Promise<void>;
  addToHistory: (word: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  isFavorite: (word: string) => boolean;
}

const DictionaryContext = createContext<DictionaryContextData>({} as DictionaryContextData);

interface DictionaryProviderProps {
  children: ReactNode;
}

export function DictionaryProvider({ children }: DictionaryProviderProps) {
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);
  const [history, setHistory] = useState<HistoryWord[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [favoritesData, historyData] = await Promise.all([
      storageService.getFavorites(),
      storageService.getHistory(),
    ]);
    setFavorites(favoritesData);
    setHistory(historyData);
  }

  async function addFavorite(word: string) {
    await storageService.addFavorite(word);
    const updatedFavorites = await storageService.getFavorites();
    setFavorites(updatedFavorites);
  }

  async function removeFavorite(word: string) {
    await storageService.removeFavorite(word);
    const updatedFavorites = await storageService.getFavorites();
    setFavorites(updatedFavorites);
  }

  async function addToHistory(word: string) {
    await storageService.addToHistory(word);
    const updatedHistory = await storageService.getHistory();
    setHistory(updatedHistory);
  }

  async function clearHistory() {
    await storageService.clearHistory();
    setHistory([]);
  }

  function isFavorite(word: string): boolean {
    return favorites.some(fav => fav.word === word);
  }

  return (
    <DictionaryContext.Provider
      value={{
        favorites,
        history,
        addFavorite,
        removeFavorite,
        addToHistory,
        clearHistory,
        isFavorite,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  
  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  
  return context;
}
