import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { Button } from '../../../src/components/ui/Button';
import { useAuthStore } from '../../../src/lib/auth/store';
import { verifyMagicLink } from '../../../src/lib/auth/api';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { accent } from '../../../src/lib/theme/tokens';
import { typography } from '../../../src/lib/theme/typography';

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
            <Text style={[typography.body, styles.textAlign, { color: theme.text }]}>
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
            <ActivityIndicator size="large" color={accent} />
            <Text style={[typography.lead, { color: theme.textMuted }]}>
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
  textAlign: {
    textAlign: 'center',
  },
  backButton: {
    minWidth: 200,
  },
});
