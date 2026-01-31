import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FavoriteWord, HistoryWord } from '../types';
import { storageService } from '../utils/storage';
import { syncService } from '../services/sync-service';
import { supabase } from '../services/supabase';

interface DictionaryContextData {
  favorites: FavoriteWord[];
  history: HistoryWord[];
  addFavorite: (word: string) => Promise<void>;
  removeFavorite: (word: string) => Promise<void>;
  addToHistory: (word: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  isFavorite: (word: string) => boolean;
  syncData: () => Promise<void>;
}

const DictionaryContext = createContext<DictionaryContextData>({} as DictionaryContextData);

interface DictionaryProviderProps {
  children: ReactNode;
}

export function DictionaryProvider({ children }: DictionaryProviderProps) {
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);
  const [history, setHistory] = useState<HistoryWord[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        syncData();
      } else {
        loadLocalData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkAuthAndLoadData() {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    
    if (session) {
      await syncData();
    } else {
      await loadLocalData();
    }
  }

  async function loadLocalData() {
    const [favoritesData, historyData] = await Promise.all([
      storageService.getFavorites(),
      storageService.getHistory(),
    ]);
    setFavorites(favoritesData);
    setHistory(historyData);
  }

  async function syncData() {
    try {
      const [remoteFavorites, remoteHistory] = await Promise.all([
        syncService.getFavorites(),
        syncService.getHistory(),
      ]);

      const formattedFavorites: FavoriteWord[] = remoteFavorites.map(fav => ({
        word: fav.word,
        addedAt: fav.added_at,
      }));

      const formattedHistory: HistoryWord[] = remoteHistory.map(hist => ({
        word: hist.word,
        viewedAt: hist.viewed_at,
      }));

      setFavorites(formattedFavorites);
      setHistory(formattedHistory);

      await storageService.setFavorites(formattedFavorites);
      await storageService.setHistory(formattedHistory);
    } catch (error) {
      console.error('Error syncing data:', error);
      await loadLocalData();
    }
  }

  async function addFavorite(word: string) {
    if (isAuthenticated) {
      try {
        await syncService.addFavorite(word);
        await syncData();
      } catch (error) {
        console.error('Error adding favorite to server:', error);
      }
    } else {
      await storageService.addFavorite(word);
      const updatedFavorites = await storageService.getFavorites();
      setFavorites(updatedFavorites);
    }
  }

  async function removeFavorite(word: string) {
    if (isAuthenticated) {
      try {
        await syncService.removeFavorite(word);
        await syncData();
      } catch (error) {
        console.error('Error removing favorite from server:', error);
      }
    } else {
      await storageService.removeFavorite(word);
      const updatedFavorites = await storageService.getFavorites();
      setFavorites(updatedFavorites);
    }
  }

  async function addToHistory(word: string) {
    if (isAuthenticated) {
      try {
        await syncService.addToHistory(word);
        await syncData();
      } catch (error) {
        console.error('Error adding to history on server:', error);
      }
    } else {
      await storageService.addToHistory(word);
      const updatedHistory = await storageService.getHistory();
      setHistory(updatedHistory);
    }
  }

  async function clearHistory() {
    if (isAuthenticated) {
      try {
        await syncService.clearHistory();
        await syncData();
      } catch (error) {
        console.error('Error clearing history on server:', error);
      }
    } else {
      await storageService.clearHistory();
      setHistory([]);
    }
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
        syncData,
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
