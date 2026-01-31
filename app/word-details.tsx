import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAudioPlayer, AudioSource, setAudioModeAsync } from 'expo-audio';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useDictionary } from '@/src/contexts';
import { dictionaryApi } from '@/src/services/api';
import { cacheService } from '@/src/services/cache';
import { Word } from '@/src/types';
import { styles } from './_word-details-styles';

export default function WordDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const word = params.word as string;
  
  const { addFavorite, removeFavorite, isFavorite } = useDictionary();
  const [wordData, setWordData] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioSource, setAudioSource] = useState<AudioSource | null>(null);
  const player = useAudioPlayer(audioSource);

  useEffect(() => {
    configureAudio();
    if (word) {
      loadWordData();
    }
  }, [word]);

  const configureAudio = async () => {
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
      });
    } catch (err) {
      console.error('Error configuring audio:', err);
    }
  };

  const loadWordData = async () => {
    try {
      setLoading(true);
      setError(null);

      const cached = await cacheService.get(word);
      if (cached) {
        setWordData(cached);
        const audio = cached.phonetics?.find(p => p.audio)?.audio;
        if (audio) {
          setAudioSource({ uri: audio });
        }
        setLoading(false);
        return;
      }

      const data = await dictionaryApi.getWord(word);
      setWordData(data);
      const audio = data.phonetics?.find(p => p.audio)?.audio;
      if (audio) {
        setAudioSource({ uri: audio });
      }
      await cacheService.set(word, data);
    } catch (err) {
      console.error('Error loading word:', err);
      setLoading(false);
      Alert.alert(
        'Palavra não encontrada',
        'Os dados desta palavra não estão disponíveis no momento.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async () => {
    try {
      if (!audioSource) {
        Alert.alert('Áudio não disponível', 'Esta palavra não possui pronúncia em áudio.');
        return;
      }

      await player.seekTo(0);
      await player.play();
    } catch (err) {
      console.error('Error playing audio:', err);
      Alert.alert('Erro', 'Não foi possível reproduzir o áudio.');
    }
  };

  const handleFavorite = async () => {
    if (isFavorite(word)) {
      await removeFavorite(word);
    } else {
      await addFavorite(word);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5956E9" />
        <Text style={styles.loadingText}>Carregando definições...</Text>
      </View>
    );
  }

  if (error || !wordData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Palavra não encontrada'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadWordData}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasAudio = wordData.phonetics?.some(p => p.audio);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerCard}>
          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
            <Text style={{ fontSize: 28 }}>
              {isFavorite(word) ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.word}>{wordData.word}</Text>
          
          {wordData.phonetic && (
            <Text style={styles.phonetic}>{wordData.phonetic}</Text>
          )}
          
          {hasAudio && (
            <TouchableOpacity style={styles.audioButton} onPress={playAudio}>
              <IconSymbol name="speaker.wave.2.fill" size={20} color="#FFFFFF" />
              <Text style={styles.audioButtonText}>Ouvir Pronúncia</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.navButton} onPress={handleBack}>
            <IconSymbol name="chevron.left" size={20} color="#5956E9" />
            <Text style={styles.navButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>

        {wordData.meanings?.map((meaning, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {meaning.partOfSpeech}
            </Text>
            
            {meaning.definitions?.slice(0, 3).map((def, defIndex) => (
              <View key={defIndex} style={styles.meaningCard}>
                <Text style={styles.definition}>
                  {defIndex + 1}. {def.definition}
                </Text>
                
                {def.example && (
                  <Text style={styles.example}>
                    Exemplo: "{def.example}"
                  </Text>
                )}
                
                {def.synonyms && def.synonyms.length > 0 && (
                  <View style={styles.synonymsContainer}>
                    <Text style={styles.synonymsLabel}>Sinônimos:</Text>
                    <View style={styles.synonymsList}>
                      {def.synonyms.slice(0, 5).map((synonym, synIndex) => (
                        <View key={synIndex} style={styles.synonymChip}>
                          <Text style={styles.synonymText}>{synonym}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
