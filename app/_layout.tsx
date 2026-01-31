import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { DictionaryProvider } from '@/src/contexts';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <DictionaryProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="word-details" 
            options={{ 
              title: 'Detalhes da Palavra',
              headerBackTitle: 'Voltar',
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </DictionaryProvider>
  );
}
