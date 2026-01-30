import { Word } from '../types';

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export const dictionaryApi = {
  async getWord(word: string): Promise<Word> {
    try {
      const response = await fetch(`${BASE_URL}/${word}`);
      
      if (!response.ok) {
        throw new Error('Word not found');
      }

      const data = await response.json();
      return data[0];
    } catch (error) {
      throw new Error(`Failed to fetch word: ${error}`);
    }
  },
};
