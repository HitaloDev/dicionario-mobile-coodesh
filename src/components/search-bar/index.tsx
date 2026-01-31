import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { styles } from './styles';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBar({ value, onChangeText, onClear, placeholder = 'Buscar palavra...', isLoading = false }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <IconSymbol name="magnifyingglass" size={20} color="#6B7280" style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {isLoading ? (
        <View style={styles.clearButton}>
          <ActivityIndicator size="small" color="#5956E9" />
        </View>
      ) : value.length > 0 ? (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <IconSymbol name="xmark.circle.fill" size={20} color="#6B7280" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
