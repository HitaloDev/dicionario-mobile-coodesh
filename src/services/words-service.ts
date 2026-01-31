import 'reflect-metadata';
import { injectable } from 'tsyringe';
import { supabase } from './supabase';

export interface WordItem {
  id: number;
  word: string;
  created_at: string;
}

interface WordsResponse {
  words: WordItem[];
  total: number;
  hasMore: boolean;
}

const WORDS_PER_PAGE = 60;

@injectable()
export class WordsService {
  async getWords(page: number = 0): Promise<WordsResponse> {
    try {
      const from = page * WORDS_PER_PAGE;
      const to = from + WORDS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('words')
        .select('*')
        .order('word', { ascending: true })
        .range(from, to);

      if (error) {
        throw error;
      }

      return {
        words: data || [],
        total: 0,
        hasMore: (data?.length || 0) === WORDS_PER_PAGE,
      };
    } catch (error) {
      console.error('Error fetching words:', error);
      throw error;
    }
  }

  async searchWords(query: string, limit: number = 20): Promise<WordItem[]> {
    try {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .ilike('word', `${query}%`)
        .order('word', { ascending: true })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error searching words:', error);
      throw error;
    }
  }

  async getTotalCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('words')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting total count:', error);
      return 0;
    }
  }
}

export const wordsService = new WordsService();
