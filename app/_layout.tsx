import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import 'reflect-metadata';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { DictionaryProvider, AuthProvider, useAuth } from '@/src/contexts';
import { setupDependencyInjection } from '@/src/di';
import { CustomSplashScreen } from '@/src/components/custom-splash-screen';

SplashScreen.preventAutoHideAsync();
setupDependencyInjection();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (loading || !appIsReady) return;

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'word-details';

    if (!session && inAuthGroup) {
      router.replace('/login');
    } else if (session && !inAuthGroup) {
      router.replace('/(tabs)/word-list');
    }
  }, [session, segments, loading, appIsReady]);

  if (!appIsReady) {
    return <CustomSplashScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Criar Conta' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="word-details" 
        options={{ 
          title: 'Detalhes da Palavra',
          headerBackTitle: 'Voltar',
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <DictionaryProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </ThemeProvider>
      </DictionaryProvider>
    </AuthProvider>
  );
}
