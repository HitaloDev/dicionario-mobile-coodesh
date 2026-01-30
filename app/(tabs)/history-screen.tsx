import React from 'react';
import { View, Text, FlatList, ListRenderItem } from 'react-native';
import { styles } from './styles/history';

interface HistoryItem {
  word: string;
  timestamp: string;
}

export default function HistoryScreen() {
  const historyData: HistoryItem[] = [];

  const renderItem: ListRenderItem<HistoryItem> = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.word}>{item.word}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  if (historyData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhuma palavra visualizada ainda
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList<HistoryItem>
        data={historyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.word}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}
