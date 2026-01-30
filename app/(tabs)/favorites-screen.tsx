import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import { styles } from './styles/favorites';

interface FavoriteItem {
  word: string;
}

export default function FavoritesScreen() {
  const favoritesData: FavoriteItem[] = [];

  const renderItem: ListRenderItem<FavoriteItem> = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.word}>{item.word}</Text>
      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  if (favoritesData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhuma palavra favoritada ainda
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList<FavoriteItem>
        data={favoritesData}
        renderItem={renderItem}
        keyExtractor={(item) => item.word}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}
