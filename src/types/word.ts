export interface Phonetic {
  text: string;
  audio?: string;
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface Word {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  origin?: string;
}

export interface FavoriteWord {
  word: string;
  addedAt: string;
}

export interface HistoryWord {
  word: string;
  viewedAt: string;
}
