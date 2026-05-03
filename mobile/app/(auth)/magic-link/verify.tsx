// TODO C7.3-followup — BACKEND: /api/v1/auth/magic-link/verify endpoint is missing.
// The web path /api/auth/magic-link/verify uses a cookie-only session exchange and
// cannot be reused by mobile. A new JWT-returning endpoint is needed at:
//   POST /api/v1/auth/magic-link/verify  { token: string }
//   → { accessToken, refreshToken, user }
// Until this endpoint exists, deep-link verification will return a 404 and this
// screen will show an error state. Users can still authenticate via the password
// fallback on the login screen.
// Track in: C7.3-followup / Hat B backend sprint.

import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { Button } from '../../../src/components/ui/Button';
import { useAuthStore } from '../../../src/lib/auth/store';
import { verifyMagicLink } from '../../../src/lib/auth/api';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';

export default function VerifyScreen() {
  const theme = useTheme();
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const locale = detectLocale();
  const strings = useTranslations(locale).auth;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError(strings.errorGeneric);
      return;
    }
    verifyMagicLink(token)
      .then((user) => {
        setUser(user);
        router.replace('/(app)/cards');
      })
      .catch(() => setError(strings.errorGeneric));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <ScreenContainer>
      <View style={styles.center}>
        {error ? (
          <>
            <Text style={[styles.errorText, { color: theme.ink[100] }]}>
              {error}
            </Text>
            <Button
              label="Back to sign in"
              onPress={() => router.replace('/(auth)/login')}
              variant="secondary"
              style={styles.backButton}
            />
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color={theme.ink[300]} />
            <Text style={[styles.verifyingText, { color: theme.ink[300] }]}>
              {strings.verifying}
            </Text>
          </>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  verifyingText: {
    fontSize: 14,
  },
  backButton: {
    minWidth: 200,
  },
});
