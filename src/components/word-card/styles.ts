import { StyleSheet } from 'react-native';
import { colors } from '../../constants';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    margin: 4,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '31%',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  word: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: -30,
    right: -8,
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 22,
    color: '#FFC107',
  },
});
