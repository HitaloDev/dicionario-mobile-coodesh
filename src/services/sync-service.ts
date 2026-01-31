import 'reflect-metadata';
import { injectable } from 'tsyringe';
import { supabase } from './supabase';

export interface FavoriteItem {
  id: string;
  user_id: string;
  word: string;
  added_at: string;
}

export interface HistoryItem {
  id: string;
  user_id: string;
  word: string;
  viewed_at: string;
}

@injectable()
export class SyncService {
  async getFavorites(): Promise<FavoriteItem[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    return data || [];
  }

  async addFavorite(word: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, word });

    if (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  async removeFavorite(word: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('word', word);

    if (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  async getHistory(): Promise<HistoryItem[]> {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('viewed_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching history:', error);
      return [];
    }

    return data || [];
  }

  async addToHistory(word: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('history')
      .insert({ user_id: user.id, word });

    if (error) {
      console.error('Error adding to history:', error);
      throw error;
    }
  }

  async clearHistory(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('history')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  }
}

export const syncService = new SyncService();
