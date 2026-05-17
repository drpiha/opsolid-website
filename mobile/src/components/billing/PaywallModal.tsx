// =============================================================================
// M5 — PaywallModal
//
// Single shared modal shown on every Pro-gated tap (5-card limit, custom
// domain, advanced analytics, HTML export, tip jar, password protection).
// Two CTAs: "Aylık €7" and "Yıllık €60 (-28%)". Each opens Stripe Checkout
// in expo-web-browser.
// =============================================================================

import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { accent } from '../../lib/theme/tokens';
import { useTranslations, detectLocale } from '../../lib/i18n/locale';
import { startProCheckout } from '../../lib/api/billing';

export type PaywallReason =
  | 'card_limit'
  | 'custom_domain'
  | 'analytics'
  | 'html_export'
  | 'tip_jar'
  | 'password_protection';

type Props = {
  visible: boolean;
  onClose: () => void;
  reason: PaywallReason;
  /** Optional callback fired after successful checkout return — caller can
   *  refresh `auth/me` to pick up the new isPro state. */
  onReturned?: () => void;
};

export function PaywallModal({ visible, onClose, reason, onReturned }: Props) {
  const theme = useTheme();
  const t = useTranslations(detectLocale()).billing;
  const [busy, setBusy] = useState<'monthly' | 'yearly' | null>(null);

  const reasonText: Record<PaywallReason, string> = {
    card_limit: t.reasonCardLimit,
    custom_domain: t.reasonCustomDomain,
    analytics: t.reasonAnalytics,
    html_export: t.reasonHtmlExport,
    tip_jar: t.reasonTipJar,
    password_protection: t.reasonPasswordProtection,
  };

  async function handleCheckout(interval: 'monthly' | 'yearly') {
    if (busy) return;
    setBusy(interval);
    try {
      const { url } = await startProCheckout(interval);
      // expo-web-browser.openAuthSessionAsync would close on a deep-link
      // intercept — we use the simpler `openBrowserAsync` since success/
      // cancel happen inside Stripe and the app just needs the user to
      // come back. Subsequent /auth/me will reflect the new isPro state.
      const result = await WebBrowser.openBrowserAsync(url, {
        presentationStyle:
          // iOS modal sheet; Android falls back to system default.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (WebBrowser as any).WebBrowserPresentationStyle?.PAGE_SHEET,
      });
      // result.type is 'cancel' | 'dismiss'. Fire onReturned regardless so
      // the caller can refresh state — the webhook will have fired by then
      // for any successful checkout.
      onReturned?.();
      // Close the modal so the user lands back on the gated surface; the
      // gate will re-evaluate against the fresh `isPro` flag.
      onClose();
      void result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not open checkout.';
      if (msg.includes('pro_not_configured')) {
        Alert.alert(t.errorTitle, t.errorNotConfigured);
      } else {
        Alert.alert(t.errorTitle, t.errorGeneric);
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.pageBg,
              borderColor: theme.line.DEFAULT,
            },
          ]}
        >
          <ScrollView contentContainerStyle={styles.body} bounces={false}>
            <View style={styles.headerBlock}>
              <View style={[styles.badge, { backgroundColor: accent }]}>
                <Text style={styles.badgeText}>{t.proBadge}</Text>
              </View>
              <Text style={[styles.title, { color: theme.text }]}>
                {t.title}
              </Text>
              <Text style={[styles.reason, { color: theme.textMuted }]}>
                {reasonText[reason]}
              </Text>
            </View>

            <View style={styles.featureList}>
              <FeatureRow theme={theme} text={t.feat5Cards} />
              <FeatureRow theme={theme} text={t.featCustomDomain} />
              <FeatureRow theme={theme} text={t.featAnalytics} />
              <FeatureRow theme={theme} text={t.featHtmlExport} />
              <FeatureRow theme={theme} text={t.featPassword} />
              <FeatureRow theme={theme} text={t.featTipJar} />
            </View>

            <View style={styles.priceRow}>
              <PriceCard
                theme={theme}
                title={t.monthly}
                price={t.priceMonthly}
                meta={t.priceMonthlyMeta}
                onPress={() => void handleCheckout('monthly')}
                busy={busy === 'monthly'}
                disabled={busy !== null && busy !== 'monthly'}
                accent={accent}
              />
              <PriceCard
                theme={theme}
                title={t.yearly}
                price={t.priceYearly}
                meta={t.priceYearlyMeta}
                onPress={() => void handleCheckout('yearly')}
                busy={busy === 'yearly'}
                disabled={busy !== null && busy !== 'yearly'}
                accent={accent}
                highlight
              />
            </View>

            <Text style={[styles.legal, { color: theme.textFaint }]}>
              {t.legal}
            </Text>

            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={styles.closeBtn}
              disabled={busy !== null}
            >
              <Text style={{ color: theme.textMuted, fontSize: 14 }}>
                {t.notNow}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function FeatureRow({
  theme,
  text,
}: {
  theme: ReturnType<typeof useTheme>;
  text: string;
}) {
  return (
    <View style={styles.featRow}>
      <Text style={[styles.featCheck, { color: accent }]}>✓</Text>
      <Text style={[styles.featText, { color: theme.textSecondary }]}>{text}</Text>
    </View>
  );
}

function PriceCard({
  theme,
  title,
  price,
  meta,
  onPress,
  busy,
  disabled,
  accent,
  highlight,
}: {
  theme: ReturnType<typeof useTheme>;
  title: string;
  price: string;
  meta: string;
  onPress: () => void;
  busy: boolean;
  disabled?: boolean;
  accent: string;
  highlight?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={busy || disabled}
      activeOpacity={0.85}
      style={[
        styles.priceCard,
        {
          backgroundColor: highlight ? accent : theme.surfaceMuted,
          borderColor: highlight ? accent : theme.line.DEFAULT,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.priceTitle,
          { color: highlight ? '#fff' : theme.textSecondary },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.priceAmount,
          { color: highlight ? '#fff' : theme.text },
        ]}
      >
        {price}
      </Text>
      <Text
        style={[
          styles.priceMeta,
          { color: highlight ? 'rgba(255,255,255,0.85)' : theme.textFaint },
        ]}
      >
        {meta}
      </Text>
      {busy ? (
        <ActivityIndicator
          size="small"
          color={highlight ? '#fff' : accent}
          style={{ marginTop: 8 }}
        />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    maxHeight: '90%',
  },
  body: {
    padding: 24,
    paddingBottom: 32,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  reason: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  featureList: {
    marginVertical: 16,
    gap: 8,
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featCheck: {
    width: 22,
    fontSize: 16,
    fontWeight: '700',
  },
  featText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  priceCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  priceTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  priceAmount: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  priceMeta: {
    fontSize: 11,
    textAlign: 'center',
  },
  legal: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
  closeBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
});
