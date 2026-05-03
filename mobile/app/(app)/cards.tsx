import { View, Text, StyleSheet } from 'react-native';
import { copper } from '@/lib/theme/tokens';

// Placeholder card list screen — full implementation in C7.4
// Will use apiFetch<CardListResponse>('/api/v1/cards') from src/lib/api/client.ts
export default function CardsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>My Cards</Text>
      <Text style={styles.title}>Digital Cards</Text>
      <Text style={styles.subtitle}>TODO C7.4 — card list + detail</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
    backgroundColor: '#0B0E13',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: copper[500],
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#F4F3F0',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B717B',
    marginTop: 8,
  },
});
