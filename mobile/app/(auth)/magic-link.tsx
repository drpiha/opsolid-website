import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Button } from '../../src/components/ui/Button';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { accent, accentCredit } from '../../src/lib/theme/tokens';
import { typography } from '../../src/lib/theme/typography';
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
          <Text style={[typography.display2, { color: theme.text }]}>OpSo Smart</Text>
          <Text style={[typography.caption, styles.byCredit, { color: accentCredit }]}>by OpSolid</Text>
        </View>

        {/* Check icon — lucide CheckCircle in accent */}
        <View style={[styles.iconCircle, { backgroundColor: theme.accentSoft, borderColor: accent }]}>
          <CheckCircle size={36} color={accent} strokeWidth={1.5} />
        </View>

        <Text style={[typography.display2, styles.titleAlign, { color: theme.text }]}>
          {strings.magicLinkSent}
        </Text>

        <Text style={[typography.body, styles.bodyAlign, { color: theme.textMuted }]}>
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
            <Text style={[typography.bodyMedium, { color: accent }]}>
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
  byCredit: {
    opacity: 0.6,
    fontStyle: 'italic',
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
  titleAlign: {
    textAlign: 'center',
  },
  bodyAlign: {
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
});
