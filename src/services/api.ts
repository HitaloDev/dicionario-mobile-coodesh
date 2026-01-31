import 'reflect-metadata';
import { injectable } from 'tsyringe';
import { Word } from '../types';

@injectable()
export class DictionaryApiService {
  private baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  async getWord(word: string): Promise<Word> {
    try {
      const response = await fetch(`${this.baseUrl}/${word}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error('Error fetching word from API:', error);
      throw error;
    }
  }
}

export const dictionaryApi = new DictionaryApiService();
