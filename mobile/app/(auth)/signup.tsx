import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { accent, accentCredit } from '../../src/lib/theme/tokens';
import { typography } from '../../src/lib/theme/typography';
import { requestMagicLink } from '../../src/lib/auth/api';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupScreen() {
  const theme = useTheme();
  const router = useRouter();
  const locale = detectLocale();
  const strings = useTranslations(locale).auth;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleMagicLink() {
    setError(null);
    if (!EMAIL_RE.test(email.trim())) {
      setError(strings.errorInvalidEmail);
      return;
    }
    setLoading(true);
    try {
      await requestMagicLink(email.trim(), locale);
      router.push(`/(auth)/magic-link?email=${encodeURIComponent(email.trim())}`);
    } catch {
      setError(strings.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer scrollable>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Brand header */}
        <View style={styles.header}>
          <View style={styles.brandLockup}>
            <Text style={[typography.display2, { color: theme.text }]}>
              Verso
            </Text>
            <Text style={[typography.caption, styles.byCredit, { color: accentCredit }]}>
              by OpSolid
            </Text>
          </View>
          <Text style={[typography.display2, styles.welcomeSpacing, { color: theme.text }]}>
            {strings.signupHeadline}
          </Text>
          <Text style={[typography.lead, { color: theme.textMuted }]}>
            {strings.tagline}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {error ? (
            <View
              style={[
                styles.errorBanner,
                { backgroundColor: theme.surfaceMuted, borderColor: theme.signalErr },
              ]}
            >
              <Text style={[typography.bodySmall, { color: theme.signalErr }]}>{error}</Text>
            </View>
          ) : null}

          <Input
            label={strings.emailPlaceholder}
            placeholder={strings.emailPlaceholder}
            value={email}
            onChangeText={(v) => { setEmail(v); setError(null); }}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="send"
            onSubmitEditing={handleMagicLink}
          />

          <Button
            label={strings.signupCta}
            onPress={handleMagicLink}
            loading={loading}
            variant="accent"
            style={styles.ctaButton}
          />

          <Text style={[typography.caption, styles.noteAlign, { color: theme.textFaint }]}>
            {strings.signupNote}
          </Text>
        </View>

        {/* Footer link */}
        <View style={styles.footer}>
          <Text style={[typography.lead, { color: theme.textMuted }]}>
            {strings.loginHint}{' '}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            accessibilityRole="link"
          >
            <Text style={[typography.bodyMedium, { color: accent }]}>
              {strings.loginCta}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 40,
    gap: 10,
  },
  brandLockup: {
    flexDirection: 'column',
    gap: 2,
  },
  byCredit: {
    opacity: 0.6,
    fontStyle: 'italic',
  },
  welcomeSpacing: {
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  errorBanner: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  ctaButton: {
    marginTop: 4,
  },
  noteAlign: {
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
});
