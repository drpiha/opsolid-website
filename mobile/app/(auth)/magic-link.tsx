import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Button } from '../../src/components/ui/Button';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { teal, accentCredit } from '../../src/lib/theme/tokens';
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
        {/* Verso brand lockup */}
        <View style={styles.brandLockup}>
          <Text style={[styles.versoWordmark, { color: teal[500] }]}>Verso</Text>
          <Text style={[styles.byCredit, { color: accentCredit }]}>by OpSolid</Text>
        </View>

        {/* Check icon — lucide CheckCircle in teal */}
        <View style={[styles.iconCircle, { backgroundColor: theme.bg[2], borderColor: teal[500] }]}>
          <CheckCircle size={36} color={teal[500]} strokeWidth={1.5} />
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
                ? strings.resendIn.replace('{s}', String(cooldown))
                : strings.didntGetIt
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
              {strings.backToSignIn}
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
  brandLockup: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    marginBottom: 8,
  },
  versoWordmark: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  byCredit: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
    opacity: 0.6,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
