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
import { login, requestMagicLink, signInWithGoogle } from '../../src/lib/auth/api';
import { useAuthStore } from '../../src/lib/auth/store';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Mode = 'magic-link' | 'password';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const locale = detectLocale();
  const strings = useTranslations(locale).auth;

  const [mode, setMode] = useState<Mode>('magic-link');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateEmail(): boolean {
    if (!EMAIL_RE.test(email.trim())) {
      setError(strings.errorInvalidEmail);
      return false;
    }
    return true;
  }

  async function handleMagicLink() {
    setError(null);
    if (!validateEmail()) return;
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

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        setUser(user);
        router.replace('/(app)/cards');
      }
    } catch {
      setError(strings.googleError);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handlePasswordLogin() {
    setError(null);
    if (!validateEmail()) return;
    if (password.length < 8) {
      setError(strings.errorWeakPassword);
      return;
    }
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      setUser(user);
      router.replace('/(app)/cards');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('401') || msg.includes('invalid_credentials')) {
        setError(strings.errorBadCreds);
      } else {
        setError(strings.errorGeneric);
      }
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
              OpSo Smart
            </Text>
            <Text style={[typography.caption, styles.byCredit, { color: accentCredit }]}>
              by OpSolid
            </Text>
          </View>
          <Text style={[typography.display2, styles.welcomeSpacing, { color: theme.text }]}>
            {strings.welcome}
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
            returnKeyType={mode === 'magic-link' ? 'send' : 'next'}
            onSubmitEditing={mode === 'magic-link' ? handleMagicLink : undefined}
          />

          {mode === 'password' ? (
            <Input
              label={strings.passwordPlaceholder}
              placeholder={strings.passwordPlaceholder}
              value={password}
              onChangeText={(v) => { setPassword(v); setError(null); }}
              secureTextEntry
              textContentType="password"
              autoComplete="current-password"
              returnKeyType="done"
              onSubmitEditing={handlePasswordLogin}
            />
          ) : null}

          {mode === 'magic-link' ? (
            <Button
              label={strings.magicLinkCta}
              onPress={handleMagicLink}
              loading={loading}
              variant="accent"
              style={styles.ctaButton}
            />
          ) : (
            <Button
              label={strings.loginCta}
              onPress={handlePasswordLogin}
              loading={loading}
              variant="accent"
              style={styles.ctaButton}
            />
          )}

          {/* Mode toggle */}
          <TouchableOpacity
            onPress={() => {
              setMode(mode === 'magic-link' ? 'password' : 'magic-link');
              setError(null);
            }}
            style={styles.toggleRow}
            accessibilityRole="button"
          >
            <Text style={[typography.bodyMedium, { color: accent }]}>
              {mode === 'magic-link'
                ? strings.passwordToggle
                : strings.magicLinkBack}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.line.DEFAULT }]} />
            <Text style={[typography.sectionLabel, { color: theme.textFaint }]}>
              {strings.orDivider}
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.line.DEFAULT }]} />
          </View>

          {/* Google sign-in */}
          <Button
            label={strings.googleCta}
            onPress={handleGoogleSignIn}
            loading={googleLoading}
            variant="secondary"
          />
        </View>

        {/* Footer link */}
        <View style={styles.footer}>
          <Text style={[typography.lead, { color: theme.textMuted }]}>
            {strings.signupHint}{' '}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/signup')}
            accessibilityRole="link"
          >
            <Text style={[typography.bodyMedium, { color: accent }]}>
              {strings.signupCta}
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
  toggleRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
});
