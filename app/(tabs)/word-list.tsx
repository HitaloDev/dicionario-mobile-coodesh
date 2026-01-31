import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, FlatList, ListRenderItem, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { WordCard, SearchBar } from '@/src/components';
import { useDictionary } from '@/src/contexts';
import { wordsService, WordItem } from '@/src/services/words-service';
import { styles } from './styles/_word-list';

export default function WordListScreen() {
  const router = useRouter();
  const { addToHistory, addFavorite, removeFavorite, isFavorite } = useDictionary();
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<WordItem[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadWords();
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length > 0) {
      setIsSearchLoading(true);
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchQuery);
      }, 1000);
    } else {
      setIsSearching(false);
      setSearchResults([]);
      setIsSearchLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

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
    if (loadingMore || !hasMore || isSearching) return;

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

  const handleSearch = useCallback(
    async (query: string) => {
      if (query.length === 0) {
        setIsSearching(false);
        setSearchResults([]);
        setIsSearchLoading(false);
        return;
      }

      try {
        setIsSearching(true);
        const results = await wordsService.searchWords(query, 30);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching words:', err);
      } finally {
        setIsSearchLoading(false);
      }
    },
    []
  );

  const handleWordPress = async (word: string) => {
    await addToHistory(word);
    router.push({
      pathname: '/(tabs)/../word-details' as any,
      params: { word },
    });
  };

  const handleFavoritePress = async (word: string) => {
    if (isFavorite(word)) {
      await removeFavorite(word);
    } else {
      await addFavorite(word);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
    setIsSearchLoading(false);
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
    if (!loadingMore || isSearching) return null;
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

  const displayWords = isSearching ? searchResults : words;

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={handleClearSearch}
        placeholder="Buscar palavra em inglês..."
        isLoading={isSearchLoading}
      />
      {isSearching && searchResults.length === 0 && searchQuery.length > 0 && !isSearchLoading && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>Nenhuma palavra encontrada</Text>
        </View>
      )}
      <FlatList<WordItem>
        data={displayWords}
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
