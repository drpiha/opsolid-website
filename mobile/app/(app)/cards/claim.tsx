// -----------------------------------------------------------------------
// Fix 1.8 — Claim a card screen.
//
// Allows a user to link an order (created on the web without an account)
// onto their current account by providing the one-shot edit token from
// the order confirmation email.
//
// Entry points:
//   1. Settings → "Cards" → "Claim a card"  (router.push)
//   2. Deep-link  opsolid://claim?token=X&orderId=Y
//
// Deep-link wiring: the root _layout.tsx already listens to all incoming
// Linking events. We read the initial URL (and any runtime URL) via
// useLocalSearchParams — expo-router parses the deep-link query string
// and injects it as search params on the matching route.
// -----------------------------------------------------------------------

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyRound } from 'lucide-react-native';

import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { teal, signal } from '../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { useToast } from '../../../src/components/ui/Toast';
import { apiFetch } from '../../../src/lib/api/client';
import type { ApiCard } from '../../../src/lib/api/types';

// Regex to extract orderId + token from a full edit URL such as:
//   https://opsolid.de/card/edit/clxyz1234?t=abc123
const EDIT_URL_RE =
  /\/card\/edit\/([^/?#]+)[?&]t=([^&\s]+)/i;

export default function ClaimCardScreen() {
  const theme = useTheme();
  const locale = detectLocale();
  const t = useTranslations(locale).claimCard;
  const router = useRouter();
  const { showToast } = useToast();

  // Deep-link pre-fill: if the screen was opened via
  // opsolid://claim?token=X&orderId=Y expo-router injects those as
  // local search params — use them as default state so the user sees a
  // pre-filled form when tapping a link.
  const params = useLocalSearchParams<{ token?: string; orderId?: string }>();

  const [editLink, setEditLink] = useState('');
  const [orderId, setOrderId] = useState(params.orderId ?? '');
  const [token, setToken] = useState(params.token ?? '');
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse a pasted full URL into orderId + token. Runs on every change to the
  // editLink field; if the regex matches we hydrate the separate fields.
  function handleEditLinkChange(raw: string) {
    setEditLink(raw);
    const match = EDIT_URL_RE.exec(raw);
    if (match) {
      setOrderId(match[1]);
      setToken(match[2]);
    }
  }

  const canSubmit = orderId.trim().length > 0 && token.trim().length > 0;

  async function handleClaim() {
    if (!canSubmit || claiming) return;
    setClaiming(true);
    setError(null);
    try {
      const res = await apiFetch<{ card: ApiCard }>(
        `/api/account/cards/${encodeURIComponent(orderId.trim())}/claim`,
        {
          method: 'POST',
          body: JSON.stringify({ editToken: token.trim() }),
        },
      );
      showToast({ message: t.successToast, variant: 'success' });
      // Navigate to the newly claimed card's edit screen so the user can
      // immediately review and personalise it.
      router.replace(`/(app)/cards/${res.card.id}` as never);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('404')) {
        setError(t.errorNotFound);
      } else if (msg.includes('403')) {
        setError(t.errorForbidden);
      } else {
        setError(t.errorGeneric);
      }
    } finally {
      setClaiming(false);
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
      <Stack.Screen
        options={{
          title: t.title,
          headerStyle: { backgroundColor: theme.bg[0] },
          headerTitleStyle: { color: theme.ink[100] },
          headerTintColor: teal[500],
          headerShown: true,
        }}
      />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* Icon header */}
            <View style={[styles.iconWrap, { backgroundColor: teal[50] }]}>
              <KeyRound size={28} color={teal[600]} />
            </View>

            <Text style={[styles.hint, { color: theme.ink[300] }]}>
              {t.hint}
            </Text>

            {/* Full edit-link paste field */}
            <TextInput
              value={editLink}
              onChangeText={handleEditLinkChange}
              placeholder={t.editLinkPlaceholder}
              placeholderTextColor={theme.ink[400]}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              style={[
                styles.input,
                {
                  color: theme.ink[100],
                  borderColor: theme.line.DEFAULT,
                  backgroundColor: theme.bg[1],
                },
              ]}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View
                style={[styles.dividerLine, { backgroundColor: theme.line.DEFAULT }]}
              />
              <Text style={[styles.dividerText, { color: theme.ink[400] }]}>
                {t.orDivider}
              </Text>
              <View
                style={[styles.dividerLine, { backgroundColor: theme.line.DEFAULT }]}
              />
            </View>

            {/* Order ID field */}
            <Text style={[styles.label, { color: theme.ink[300] }]}>
              {t.orderIdLabel}
            </Text>
            <TextInput
              value={orderId}
              onChangeText={(v) => setOrderId(v)}
              placeholder={t.orderIdPlaceholder}
              placeholderTextColor={theme.ink[400]}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.input,
                {
                  color: theme.ink[100],
                  borderColor: theme.line.DEFAULT,
                  backgroundColor: theme.bg[1],
                },
              ]}
            />

            {/* Edit token field */}
            <Text
              style={[styles.label, { color: theme.ink[300], marginTop: 12 }]}
            >
              {t.tokenLabel}
            </Text>
            <TextInput
              value={token}
              onChangeText={(v) => setToken(v)}
              placeholder={t.tokenPlaceholder}
              placeholderTextColor={theme.ink[400]}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.input,
                {
                  color: theme.ink[100],
                  borderColor: theme.line.DEFAULT,
                  backgroundColor: theme.bg[1],
                },
              ]}
            />

            {error ? (
              <Text style={[styles.errorText, { color: signal.err }]}>
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={() => void handleClaim()}
              disabled={!canSubmit || claiming}
              activeOpacity={0.85}
              style={[
                styles.claimBtn,
                {
                  backgroundColor: teal[500],
                  opacity: !canSubmit || claiming ? 0.55 : 1,
                },
              ]}
            >
              {claiming ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.claimBtnText}>{t.claimButton}</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    padding: 24,
    paddingBottom: 48,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  hint: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 12,
    fontSize: 13,
    textAlign: 'center',
  },
  claimBtn: {
    marginTop: 28,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
