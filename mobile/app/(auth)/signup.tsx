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
import { copper } from '../../src/lib/theme/tokens';
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
          <Text style={[styles.wordmark, { color: copper[500] }]}>
            OPSOLID
          </Text>
          <Text style={[styles.welcome, { color: theme.ink[100] }]}>
            Create your OpSolid account
          </Text>
          <Text style={[styles.tagline, { color: theme.ink[300] }]}>
            {strings.tagline}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {error ? (
            <View
              style={[
                styles.errorBanner,
                { backgroundColor: theme.bg[2], borderColor: '#B8514B' },
              ]}
            >
              <Text style={styles.errorText}>{error}</Text>
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
            style={styles.ctaButton}
          />

          <Text style={[styles.note, { color: theme.ink[400] }]}>
            We'll send a sign-in link to your email. No password needed.
          </Text>
        </View>

        {/* Footer link */}
        <View style={styles.footer}>
          <Text style={[styles.footerHint, { color: theme.ink[300] }]}>
            {strings.loginHint}{' '}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            accessibilityRole="link"
          >
            <Text style={[styles.footerLink, { color: copper[500] }]}>
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
  wordmark: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 4,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginTop: 8,
  },
  tagline: {
    fontSize: 14,
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  errorBanner: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#B8514B',
  },
  ctaButton: {
    marginTop: 4,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerHint: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
