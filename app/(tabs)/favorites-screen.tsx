import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import { useDictionary } from '@/src/contexts';
import { EmptyState } from '@/src/components';
import { FavoriteWord } from '@/src/types';
import { styles } from './styles/_favorites';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useDictionary();

  const handleRemove = async (word: string) => {
    await removeFavorite(word);
  };

  const renderItem: ListRenderItem<FavoriteWord> = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.word}>{item.word}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemove(item.word)}
      >
        <Text style={styles.deleteButtonText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState message="Nenhuma palavra favoritada ainda" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList<FavoriteWord>
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.word + item.addedAt}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}
