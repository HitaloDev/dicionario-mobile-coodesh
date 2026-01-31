import '@testing-library/jest-native/extend-expect';
import 'reflect-metadata';

process.env.EXPO_USE_STATIC = 'true';

global.__ExpoImportMetaRegistry = new Map();
global.structuredClone = global.structuredClone || ((val) => JSON.parse(JSON.stringify(val)));

jest.mock('expo', () => ({
  Asset: {
    fromModule: jest.fn(() => ({ uri: 'test-uri' })),
  },
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {},
  },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useSegments: jest.fn(),
  Stack: { Screen: 'Screen' },
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  })),
}));

global.fetch = jest.fn();
