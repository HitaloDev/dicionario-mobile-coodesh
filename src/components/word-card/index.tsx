import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

interface WordCardProps {
  word: string;
  isFavorite: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
}

export function WordCard({ word, isFavorite, onPress, onFavoritePress }: WordCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.word}>{word}</Text>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            onFavoritePress();
          }}
        >
          <Text style={styles.favoriteIcon}>
            {isFavorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
