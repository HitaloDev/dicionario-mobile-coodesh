import { useAuth } from '@/src/contexts';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './_header-styles';

export function TabHeader() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Dicionário</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="exit-outline" size={24} color="#5956E9" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
