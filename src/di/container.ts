import 'reflect-metadata';
import { container } from 'tsyringe';
import { DictionaryApiService } from '../services/api';
import { CacheService } from '../services/cache';
import { WordsService } from '../services/words-service';
import { SyncService } from '../services/sync-service';
import { StorageService } from '../utils/storage';

export function setupDependencyInjection() {
  container.register('DictionaryApiService', {
    useClass: DictionaryApiService,
  });

  container.register('CacheService', {
    useClass: CacheService,
  });

  container.register('WordsService', {
    useClass: WordsService,
  });

  container.register('SyncService', {
    useClass: SyncService,
  });

  container.register('StorageService', {
    useClass: StorageService,
  });
}

export { container };
