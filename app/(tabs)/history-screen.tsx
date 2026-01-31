import React from 'react';
import { View, Text, FlatList, ListRenderItem } from 'react-native';
import { useDictionary } from '@/src/contexts';
import { EmptyState } from '@/src/components';
import { HistoryWord } from '@/src/types';
import { styles } from './styles/_history';

export default function HistoryScreen() {
  const { history } = useDictionary();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem: ListRenderItem<HistoryWord> = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.word}>{item.word}</Text>
        <Text style={styles.timestamp}>{formatDate(item.viewedAt)}</Text>
      </View>
    </View>
  );

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState message="Nenhuma palavra visualizada ainda" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList<HistoryWord>
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.word + item.viewedAt}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}
