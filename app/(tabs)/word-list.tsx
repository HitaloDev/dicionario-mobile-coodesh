import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ListRenderItem } from 'react-native';
import { styles } from './styles/word-list';

const MOCK_WORDS: string[] = [
  'hello',
  'today',
  'great',
  'peace',
  'chair',
  'diary',
  'value',
  'common',
  'watch',
  'stop',
  'sun',
  'review',
];

export default function WordListScreen() {
  const renderItem: ListRenderItem<string> = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.word}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList<string>
        data={MOCK_WORDS}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
}
