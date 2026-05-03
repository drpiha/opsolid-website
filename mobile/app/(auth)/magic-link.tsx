import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Button } from '../../src/components/ui/Button';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { copper } from '../../src/lib/theme/tokens';
import { requestMagicLink } from '../../src/lib/auth/api';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';

const RESEND_COOLDOWN_S = 60;

export default function MagicLinkSentScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const locale = detectLocale();
  const strings = useTranslations(locale).auth;

  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN_S);
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  async function handleResend() {
    if (!email || cooldown > 0) return;
    setResending(true);
    try {
      await requestMagicLink(email, locale);
      startCooldown();
    } catch {
      // silent — user can try again
    } finally {
      setResending(false);
    }
  }

  const bodyText = strings.magicLinkSentBody.replace('{email}', email ?? '');

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Check icon placeholder — text-based to avoid asset dependency */}
        <View style={[styles.iconCircle, { backgroundColor: theme.bg[2], borderColor: theme.line.DEFAULT }]}>
          <Text style={[styles.iconChar, { color: copper[500] }]}>✓</Text>
        </View>

        <Text style={[styles.title, { color: theme.ink[100] }]}>
          {strings.magicLinkSent}
        </Text>

        <Text style={[styles.body, { color: theme.ink[300] }]}>
          {bodyText}
        </Text>

        <View style={styles.actions}>
          <Button
            label={
              cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Didn't get it? Resend"
            }
            onPress={handleResend}
            variant="secondary"
            disabled={cooldown > 0 || resending}
            loading={resending}
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={styles.backRow}
            accessibilityRole="button"
          >
            <Text style={[styles.backText, { color: theme.ink[300] }]}>
              Back to sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 8,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconChar: {
    fontSize: 32,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  backRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backText: {
    fontSize: 14,
  },
});
