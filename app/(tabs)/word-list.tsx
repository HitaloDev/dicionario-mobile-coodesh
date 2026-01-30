import React, { useEffect, useState } from 'react';
import { View, FlatList, ListRenderItem, ActivityIndicator, Text } from 'react-native';
import { WordCard } from '@/src/components';
import { useDictionary } from '@/src/contexts';
import { wordsService, WordItem } from '@/src/services/words-service';
import { styles } from './styles/word-list';

export default function WordListScreen() {
  const { addToHistory, addFavorite, removeFavorite, isFavorite } = useDictionary();
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await wordsService.getWords(0);
      setWords(response.words);
      setHasMore(response.hasMore);
      setPage(0);
    } catch (err) {
      setError('Erro ao carregar palavras. Verifique sua conexão.');
      console.error('Error loading words:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreWords = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await wordsService.getWords(nextPage);
      setWords(prev => [...prev, ...response.words]);
      setHasMore(response.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error('Error loading more words:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleWordPress = async (word: string) => {
    await addToHistory(word);
    console.log('Navigate to word details:', word);
  };

  const handleFavoritePress = async (word: string) => {
    if (isFavorite(word)) {
      await removeFavorite(word);
    } else {
      await addFavorite(word);
    }
  };

  const renderItem: ListRenderItem<WordItem> = ({ item }) => (
    <WordCard
      word={item.word}
      isFavorite={isFavorite(item.word)}
      onPress={() => handleWordPress(item.word)}
      onFavoritePress={() => handleFavoritePress(item.word)}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#5956E9" />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5956E9" />
        <Text style={styles.loadingText}>Carregando palavras...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList<WordItem>
        data={words}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContainer}
        onEndReached={loadMoreWords}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}
