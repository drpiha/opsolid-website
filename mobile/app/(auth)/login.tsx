import { View, Text, StyleSheet } from 'react-native';
import { copper } from '@/lib/theme/tokens';

// Placeholder login screen — full auth UI (magic-link + password) in C7.3
export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>OpSolid</Text>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Login screen — TODO C7.3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0B0E13',
  },
  logo: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: copper[500],
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
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
