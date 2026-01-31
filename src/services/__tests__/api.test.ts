import { DictionaryApiService } from '../api';
import { Word } from '../../types';

describe('DictionaryApiService', () => {
  let apiService: DictionaryApiService;
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
    apiService = new DictionaryApiService();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should fetch word data successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockWord],
    });

    const result = await apiService.getWord('hello');
    
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.dictionaryapi.dev/api/v2/entries/en/hello'
    );
    expect(result).toEqual(mockWord);
  });

  it('should throw error when API returns error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(apiService.getWord('invalidword')).rejects.toThrow();
  });

  it('should throw error when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(apiService.getWord('hello')).rejects.toThrow();
  });
});
