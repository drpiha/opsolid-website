import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Pressable,
  Share,
  ActivityIndicator,
} from 'react-native';
import { TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Button } from '../../src/components/ui/Button';
import { AppBar } from '../../src/components/ui/AppBar';
import { SectionLabel } from '../../src/components/ui/SectionLabel';
import { Row, RowGroup } from '../../src/components/ui/Row';
import { Toggle } from '../../src/components/ui/Toggle';
import { Avatar } from '../../src/components/ui/Avatar';
import { Chip } from '../../src/components/ui/Chip';
import { useToast } from '../../src/components/ui/Toast';
import { useAuthStore } from '../../src/lib/auth/store';
import { getMyReferral, type ReferralMeResponse } from '../../src/lib/api/referrals';
import { getShareSummary, type ShareSummary } from '../../src/lib/api/share-events';
import { patchMe, fetchMe } from '../../src/lib/auth/api';
import {
  openProPortal,
  submitDomainRequest,
  cardExportPath,
} from '../../src/lib/api/billing';
import { listCards } from '../../src/lib/api/cards';
import { getAccessToken, API_BASE } from '../../src/lib/api/client';
import { PaywallModal } from '../../src/components/billing/PaywallModal';
import * as WebBrowser from 'expo-web-browser';
import type { NotificationPrefs } from '../../src/lib/api/types';
import {
  isBiometricEnabled,
  isBiometricAvailable,
  enableBiometric,
  disableBiometric,
} from '../../src/lib/auth/biometric';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { accent, accentScale } from '../../src/lib/theme/tokens';
import { typography } from '../../src/lib/theme/typography';
import {
  useTranslations,
  detectLocale,
  detectOsLocale,
  type Locale,
} from '../../src/lib/i18n/locale';
import { applyRTLForLocale } from '../../src/lib/i18n/direction';
import {
  Check,
  KeyRound,
  ChevronRight,
  Bell,
  Workflow,
  Smartphone,
  Shield,
  Globe,
} from 'lucide-react-native';
import {
  useThemeStore,
  type AppThemeMode,
} from '../../src/lib/theme/themeStore';
import {
  useLocaleStore,
  type LocaleOverride,
} from '../../src/lib/i18n/localeStore';

// Hard-coded last 5 releases — see brief: no server call. Update on each ship.
const RELEASES: { version: string; date: string; notes: string[] }[] = [
  {
    version: '0.1.0 — Sprint F5',
    date: '2026-05',
    notes: [
      'Light / System / Dark theme picker (default Light)',
      'Language picker (EN / DE / TR) with system fallback',
      'About panel with build info',
      'Settings layout reordered, warmer ivory background',
    ],
  },
  {
    version: 'Sprint 5 — CRM',
    date: '2026-04',
    notes: [
      'Lead form modal on public cards',
      'Smart Exchange — send my card flow',
      'Visitor feedback (7-category 1–5 ratings)',
      'Status banner editor',
    ],
  },
  {
    version: 'Sprint 4',
    date: '2026-03',
    notes: [
      'Services / custom buttons / FAQs editor',
      'Inbox UX with Pending / Accepted / All filters',
      'Public-card seed data for Discover',
    ],
  },
  {
    version: 'Sprint 3',
    date: '2026-02',
    notes: [
      '96 templates with previews',
      'Layout / theme / QR-style picker',
    ],
  },
  {
    version: 'Sprint 1+2',
    date: '2026-01',
    notes: [
      'Public viewer richness',
      'QR / share modal',
      'Full edit form for cards',
    ],
  },
];

type ThemeOption = { key: AppThemeMode; label: string };
type LangOption = { key: Locale; label: string };

/**
 * Native-name labels for the locale picker. Each row shows the language as
 * the speakers themselves write it — this is the universal pattern used by
 * Telegram / Signal / iOS Settings, and side-steps any need to translate
 * "Spanish" / "Italian" / etc into all 7 locales.
 */
const LOCALE_NATIVE_LABELS: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  tr: 'Türkçe',
  es: 'Español',
  it: 'Italiano',
  fr: 'Français',
  ar: 'العربية',
};

const LOCALE_PICKER_ORDER: Locale[] = ['en', 'de', 'tr', 'es', 'it', 'fr', 'ar'];

export default function SettingsScreen() {
  const theme = useTheme();
  const { showToast } = useToast();
  const localeOverride = useLocaleStore((s) => s.override);
  const setLocaleOverride = useLocaleStore((s) => s.setOverride);
  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);

  const activeLocale = detectLocale();
  const tAll = useTranslations(activeLocale);
  const t = tAll.settings;
  const tReferral = tAll.referral;
  const tComingSoon = tAll.comingSoon;
  const tSharing = tAll.sharing;
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const [bioEnabled, setBioEnabled] = useState(false);
  const [bioAvailable, setBioAvailable] = useState(false);
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);
  const [referral, setReferral] = useState<ReferralMeResponse | null>(null);
  const [shareSummary, setShareSummary] = useState<ShareSummary | null>(null);
  const [prefs, setPrefs] = useState<NotificationPrefs>(() =>
    user?.notificationPrefs ?? {
      messages: true,
      inboxRequests: true,
      mutualSaves: true,
      eventReminders: true,
    },
  );
  const [savingPref, setSavingPref] = useState<keyof NotificationPrefs | null>(
    null,
  );

  useEffect(() => {
    if (user?.notificationPrefs) {
      setPrefs(user.notificationPrefs);
    }
  }, [user?.notificationPrefs]);

  const togglePref = async (key: keyof NotificationPrefs, next: boolean) => {
    setSavingPref(key);
    const prev = prefs;
    setPrefs({ ...prev, [key]: next });
    try {
      const updated = await patchMe({ notificationPrefs: { [key]: next } });
      if (updated.notificationPrefs) {
        setPrefs(updated.notificationPrefs);
      }
      const setUser = useAuthStore.getState().setUser;
      setUser({ ...(useAuthStore.getState().user ?? updated), ...updated });
    } catch {
      setPrefs(prev);
    } finally {
      setSavingPref(null);
    }
  };

  useEffect(() => {
    void Promise.all([isBiometricEnabled(), isBiometricAvailable()]).then(
      ([e, a]) => {
        setBioEnabled(e);
        setBioAvailable(a);
      },
    );
    void getMyReferral()
      .then((r) => setReferral(r))
      .catch(() => setReferral(null));
    void getShareSummary()
      .then((s) => setShareSummary(s))
      .catch(() => setShareSummary(null));
  }, []);

  const toggleBio = async (next: boolean) => {
    if (next) {
      const ok = await enableBiometric();
      setBioEnabled(ok);
      if (!ok) Alert.alert('Biometric not available on this device.');
    } else {
      await disableBiometric();
      setBioEnabled(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  const appVersion = useMemo<string>(() => {
    const v = Constants.expoConfig?.version;
    return typeof v === 'string' ? v : '0.1.0';
  }, []);

  const buildNumber = useMemo<string>(() => {
    const cfg = Constants.expoConfig;
    const ios = cfg?.ios?.buildNumber;
    const android = cfg?.android?.versionCode;
    if (Platform.OS === 'ios' && typeof ios === 'string') return ios;
    if (Platform.OS === 'android' && typeof android === 'number') {
      return String(android);
    }
    return '—';
  }, []);

  const platformString = useMemo<string>(() => {
    const v =
      typeof Platform.Version === 'number' || typeof Platform.Version === 'string'
        ? String(Platform.Version)
        : '';
    return `${Platform.OS}${v ? ` ${v}` : ''}`;
  }, []);

  const themeOptions: ThemeOption[] = [
    { key: 'light', label: t.themeLight },
    { key: 'system', label: t.themeSystem },
    { key: 'dark', label: t.themeDark },
  ];

  const langOptions: LangOption[] = LOCALE_PICKER_ORDER.map((k) => ({
    key: k,
    label: LOCALE_NATIVE_LABELS[k],
  }));

  const osLocale = detectOsLocale();
  const localeHint = t.languageOsHint.replace(
    '{locale}',
    osLocale.toUpperCase(),
  );

  const handleLocaleChange = (next: Locale) => {
    setLocaleOverride(next);
    const { restartRequired } = applyRTLForLocale(next);
    if (restartRequired) {
      Alert.alert(
        next === 'ar' ? 'إعادة تشغيل مطلوبة' : 'Restart required',
        next === 'ar'
          ? 'يرجى إغلاق التطبيق وإعادة فتحه لتفعيل اتجاه الكتابة من اليمين إلى اليسار.'
          : 'Please close and reopen OpSo Smart to apply the new text direction.',
        [{ text: 'OK' }],
      );
    }
  };

  const copyLine = async (label: string, value: string) => {
    try {
      await Share.share({ message: `${label}: ${value}` });
    } catch {
      // user cancelled — silent
    }
  };

  const displayName = (user as { name?: string } | null)?.name ?? undefined;
  const avatarUri = (user as { avatarUrl?: string } | null)?.avatarUrl ?? undefined;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenContainer padded={false} scrollable>
        {/* AppBar large */}
        <AppBar variant="large" title={t.title} />

        <View style={styles.content}>
          {/* ---------- PROFILE CARD ---------- */}
          {(displayName || user?.email) ? (
            <>
              <SectionLabel style={styles.sectionLabel}>{t.account.toUpperCase()}</SectionLabel>
              <Pressable
                onPress={() => {
                  // M6: feature-flag — wire to /api/v1/me/profile PATCH when backend is ready
                  showToast({ message: t.editProfileSoon, variant: 'success' });
                }}
                style={({ pressed }) => [
                  styles.profileCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.line.DEFAULT,
                    opacity: pressed ? 0.92 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={t.editProfile}
              >
                <Avatar
                  name={displayName ?? user?.email}
                  imageUri={avatarUri}
                  size={52}
                />
                <View style={styles.profileInfo}>
                  {displayName ? (
                    <Text style={[typography.title2, { color: theme.text }]} numberOfLines={1}>
                      {displayName}
                    </Text>
                  ) : null}
                  <Text
                    style={[
                      typography.bodySmall,
                      { color: theme.textMuted, marginTop: displayName ? 2 : 0 },
                    ]}
                    numberOfLines={1}
                  >
                    {user?.email ?? '—'}
                  </Text>
                </View>
                <ChevronRight size={18} color={theme.textFaint} />
              </Pressable>
            </>
          ) : (
            <>
              <SectionLabel style={styles.sectionLabel}>{t.account.toUpperCase()}</SectionLabel>
              <RowGroup style={styles.rowGroup}>
                <Row
                  title={t.signedInAs}
                  subtitle={user?.email ?? '—'}
                  divider={false}
                />
              </RowGroup>
            </>
          )}

          {/* ---------- APPEARANCE ---------- */}
          <SectionLabel style={styles.sectionLabel}>{t.appearance.toUpperCase()}</SectionLabel>
          <View
            style={[
              styles.segmentCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.line.DEFAULT,
              },
            ]}
          >
            <SegmentedControl
              value={themeMode}
              options={themeOptions}
              onChange={(k) => setThemeMode(k)}
              theme={theme}
            />
          </View>

          {/* ---------- LANGUAGE ---------- */}
          <SectionLabel style={styles.sectionLabel}>{t.language.toUpperCase()}</SectionLabel>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.surface,
                borderColor: theme.line.DEFAULT,
              },
            ]}
          >
            <LocalePickerList
              theme={theme}
              options={langOptions}
              value={localeOverride ?? activeLocale}
              onChange={handleLocaleChange}
            />
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: theme.line.DEFAULT,
                marginVertical: 8,
              }}
            />
            <TouchableOpacity
              onPress={() => setLocaleOverride(null as LocaleOverride)}
              activeOpacity={0.7}
              style={{ paddingVertical: 8 }}
            >
              <Text
                style={[
                  typography.bodySmall,
                  {
                    color: localeOverride === null ? accent : theme.textMuted,
                    fontWeight: '500',
                  },
                ]}
              >
                {t.languageSystemDefault}
                {localeOverride === null ? '  •' : ''}
              </Text>
            </TouchableOpacity>
            <Text
              style={[typography.caption, { color: theme.textFaint, marginTop: 4 }]}
            >
              {localeHint}
            </Text>
          </View>

          {/* ---------- NOTIFICATIONS ---------- */}
          <SectionLabel style={styles.sectionLabel}>{t.notifications.toUpperCase()}</SectionLabel>
          <RowGroup style={styles.rowGroup}>
            <Row
              title={t.notifications}
              subtitle={t.notifMessages + ', ' + t.notifInboxRequests + '…'}
              leading={<Bell size={18} color={accent} />}
              trailing={<Chip label="Configure" variant="default" />}
              onPress={() => router.push('/(app)/settings/notifications' as never)}
              divider={false}
            />
          </RowGroup>

          {/* ---------- SECURITY / PRIVACY ---------- */}
          {bioAvailable ? (
            <>
              <SectionLabel style={styles.sectionLabel}>{t.security.toUpperCase()}</SectionLabel>
              <RowGroup style={styles.rowGroup}>
                <Row
                  title={t.biometricUnlock}
                  subtitle={t.biometricBody}
                  trailing={
                    <Toggle
                      value={bioEnabled}
                      onChange={(v) => void toggleBio(v)}
                    />
                  }
                  divider={false}
                />
              </RowGroup>
            </>
          ) : null}

          <SectionLabel style={styles.sectionLabel}>{t.privacyData.toUpperCase()}</SectionLabel>
          <RowGroup style={styles.rowGroup}>
            <Row
              title={t.exportData}
              trailing={
                <Text style={[typography.caption, { color: theme.textFaint }]}>
                  {t.comingSoon}
                </Text>
              }
              divider={false}
            />
            <Row
              title={t.deleteAccount}
              trailing={
                <Text style={[typography.caption, { color: theme.textFaint }]}>
                  {t.comingSoon}
                </Text>
              }
            />
          </RowGroup>

          {/* ---------- M8 — COMING SOON FEATURES (Phase 6+ / 7) ---------- */}
          <SectionLabel style={styles.sectionLabel}>
            {t.comingSoon.toUpperCase()}
          </SectionLabel>
          <RowGroup style={styles.rowGroup}>
            <Row
              title={tComingSoon.crm.title}
              subtitle={tComingSoon.crm.phaseLabel}
              leading={<Workflow size={18} color={accent} />}
              chevron
              divider={false}
              onPress={() =>
                router.push('/(app)/coming-soon/crm' as never)
              }
            />
            <Row
              title={tComingSoon.nfcWallet.title}
              subtitle={tComingSoon.nfcWallet.phaseLabel}
              leading={<Smartphone size={18} color={accent} />}
              chevron
              onPress={() =>
                router.push('/(app)/coming-soon/nfc-wallet' as never)
              }
            />
            <Row
              title={tComingSoon.workspaceAdmin.title}
              subtitle={tComingSoon.workspaceAdmin.phaseLabel}
              leading={<Shield size={18} color={accent} />}
              chevron
              onPress={() =>
                router.push('/(app)/coming-soon/workspace-admin' as never)
              }
            />
            <Row
              title={tComingSoon.domainManager.title}
              subtitle={tComingSoon.domainManager.phaseLabel}
              leading={<Globe size={18} color={accent} />}
              chevron
              onPress={() =>
                router.push('/(app)/coming-soon/domain-manager' as never)
              }
            />
          </RowGroup>

          {/* ---------- M3 — REFER A FRIEND ---------- */}
          {referral ? (
            <>
              <SectionLabel style={styles.sectionLabel}>{tReferral.title.toUpperCase()}</SectionLabel>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.line.DEFAULT,
                  },
                ]}
              >
                <Text style={[typography.caption, { color: theme.textFaint }]}>
                  {tReferral.yourCode}
                </Text>
                <Text
                  style={[
                    typography.display2,
                    { color: theme.text, marginTop: 4, letterSpacing: 3 },
                  ]}
                >
                  {referral.code}
                </Text>
                <Text
                  style={[typography.bodySmall, { color: theme.textFaint, marginTop: 8 }]}
                >
                  {tReferral.hint}
                </Text>
                <View style={[styles.rowBetween, { marginTop: 12 }]}>
                  <Text style={[typography.caption, { color: theme.textFaint }]}>
                    {tReferral.redemptions}
                  </Text>
                  <Text style={[typography.bodyMedium, { color: accent }]}>
                    {referral.redemptions}
                  </Text>
                </View>
                <Button
                  label={tReferral.shareLink}
                  variant="accent"
                  onPress={() =>
                    void Share.share({
                      message: referral.deepLink,
                      url: referral.deepLink,
                    }).catch(() => {})
                  }
                  style={{ marginTop: 14 }}
                />
              </View>
            </>
          ) : null}

          {/* ---------- M3 — SHARING ANALYTICS ---------- */}
          {shareSummary ? (
            <>
              <SectionLabel style={styles.sectionLabel}>{tSharing.title.toUpperCase()}</SectionLabel>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.line.DEFAULT,
                  },
                ]}
              >
                <Text style={[typography.bodySmall, { color: theme.textFaint }]}>
                  {tSharing.hint}
                </Text>
                {shareSummary.total === 0 ? (
                  <Text
                    style={[typography.title3, { color: theme.textMuted, marginTop: 12 }]}
                  >
                    {tSharing.empty}
                  </Text>
                ) : (
                  <>
                    <View style={[styles.rowBetween, { marginTop: 10, marginBottom: 8 }]}>
                      <Text style={[typography.caption, { color: theme.textFaint }]}>
                        {tSharing.total}
                      </Text>
                      <Text style={[typography.title3, { color: theme.text }]}>
                        {shareSummary.total}
                      </Text>
                    </View>
                    {(['qr', 'link', 'nfc', 'native_share'] as const).map((ch) => {
                      const count = shareSummary.totals[ch] ?? 0;
                      const pct =
                        shareSummary.total > 0
                          ? Math.round((count / shareSummary.total) * 100)
                          : 0;
                      return (
                        <View key={ch} style={{ marginTop: 8 }}>
                          <View style={[styles.rowBetween, { marginBottom: 4 }]}>
                            <Text style={[typography.caption, { color: theme.textMuted }]}>
                              {tSharing.channels[ch]}
                            </Text>
                            <Text style={[typography.caption, { color: theme.textSecondary }]}>
                              {count}
                            </Text>
                          </View>
                          <View
                            style={{
                              height: 6,
                              borderRadius: 999,
                              backgroundColor: theme.surfaceMuted,
                              overflow: 'hidden',
                            }}
                          >
                            <View
                              style={{
                                height: 6,
                                width: `${pct}%`,
                                backgroundColor: accent,
                              }}
                            />
                          </View>
                        </View>
                      );
                    })}
                  </>
                )}
              </View>
            </>
          ) : null}

          {/* ---------- M5 — PRO ---------- */}
          <ProSection
            theme={theme}
            isPro={Boolean(user?.isPro)}
            locale={activeLocale}
            tPro={tAll.pro}
            tBilling={tAll.billing}
            onUpgraded={async () => {
              try {
                const me = await fetchMe();
                const setUser = useAuthStore.getState().setUser;
                setUser(me);
              } catch {
                // ignore
              }
            }}
            router={router}
          />

          {/* ---------- CARDS ---------- */}
          <SectionLabel style={styles.sectionLabel}>{t.cardsSection.toUpperCase()}</SectionLabel>
          <RowGroup style={styles.rowGroup}>
            <Row
              title={t.claimCard}
              subtitle={t.claimCardBody}
              leading={
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: accentScale[50],
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <KeyRound size={16} color={accent} />
                </View>
              }
              chevron
              onPress={() => router.push('/(app)/cards/claim' as never)}
              divider={false}
            />
          </RowGroup>

          {/* ---------- ABOUT ---------- */}
          <SectionLabel style={styles.sectionLabel}>{t.about.toUpperCase()}</SectionLabel>
          <RowGroup style={styles.rowGroup}>
            <InfoRow
              theme={theme}
              label={t.version}
              value={appVersion}
              onLongPress={() => void copyLine(t.version, appVersion)}
              divider={false}
            />
            <InfoRow
              theme={theme}
              label={t.buildNumber}
              value={buildNumber}
              onLongPress={() => void copyLine(t.buildNumber, buildNumber)}
            />
            <InfoRow
              theme={theme}
              label={t.platform}
              value={platformString}
              onLongPress={() => void copyLine(t.platform, platformString)}
            />
          </RowGroup>
          <TouchableOpacity
            onPress={() => setWhatsNewOpen(true)}
            activeOpacity={0.7}
            style={{ marginTop: 8, paddingVertical: 10 }}
          >
            <Text style={[typography.button, { color: accent }]}>
              {t.whatsNew}  →
            </Text>
          </TouchableOpacity>

          {/* ---------- SIGN OUT ---------- */}
          <Button
            label={t.signOut}
            onPress={() => void handleSignOut()}
            variant="ghost"
            style={{ marginTop: 24, marginBottom: 16 }}
          />
        </View>
      </ScreenContainer>

      <WhatsNewModal
        visible={whatsNewOpen}
        onClose={() => setWhatsNewOpen(false)}
        title={t.whatsNewTitle}
        closeLabel={t.close}
      />
    </>
  );
}

// -------------------------------------------------------------------------
// Subcomponents
// -------------------------------------------------------------------------

function InfoRow({
  theme,
  label,
  value,
  onLongPress,
  divider = true,
}: {
  theme: ReturnType<typeof useTheme>;
  label: string;
  value: string;
  onLongPress: () => void;
  divider?: boolean;
}) {
  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={400}
      style={({ pressed }) => [
        styles.infoRow,
        divider && {
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.line.DEFAULT,
        },
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <Text style={[typography.bodySmall, { color: theme.textFaint, flex: 1 }]}>
        {label}
      </Text>
      <Text style={[typography.bodySmall, { color: theme.text, fontWeight: '500' }]}>
        {value}
      </Text>
    </Pressable>
  );
}

function LocalePickerList({
  theme,
  options,
  value,
  onChange,
}: {
  theme: ReturnType<typeof useTheme>;
  options: { key: Locale; label: string }[];
  value: Locale;
  onChange: (k: Locale) => void;
}) {
  return (
    <View>
      {options.map((opt, idx) => {
        const selected = opt.key === value;
        const isLast = idx === options.length - 1;
        const isArabic = opt.key === 'ar';
        return (
          <TouchableOpacity
            key={opt.key}
            onPress={() => onChange(opt.key)}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 12,
              borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
              borderBottomColor: theme.line.DEFAULT,
            }}
          >
            <Text
              style={[
                typography.title3,
                {
                  color: selected ? accent : theme.text,
                  fontWeight: selected ? '600' : '500',
                  flex: 1,
                  writingDirection: isArabic ? 'rtl' : 'ltr',
                  textAlign: isArabic ? 'right' : 'left',
                },
              ]}
            >
              {opt.label}
            </Text>
            {selected ? <Check size={18} color={accent} strokeWidth={2.5} /> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  theme,
}: {
  value: T;
  options: { key: T; label: string }[];
  onChange: (k: T) => void;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={styles.segmentRow}>
      {options.map((opt) => {
        const selected = opt.key === value;
        return (
          <TouchableOpacity
            key={opt.key}
            onPress={() => onChange(opt.key)}
            activeOpacity={0.8}
            style={[
              styles.segmentPill,
              {
                backgroundColor: selected ? accent : theme.surfaceMuted,
                borderColor: selected ? accent : theme.line.firm,
              },
            ]}
          >
            <Text
              style={[
                typography.buttonSmall,
                { color: selected ? '#FFFFFF' : theme.textSecondary },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function WhatsNewModal({
  visible,
  onClose,
  title,
  closeLabel,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
}) {
  const theme = useTheme();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: theme.pageBg }}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 12,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: theme.line.DEFAULT,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={[typography.title2, { color: theme.text }]}>
            {title}
          </Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Text style={[typography.button, { color: accent }]}>
              {closeLabel}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          {RELEASES.map((rel) => (
            <View key={rel.version} style={{ marginBottom: 24 }}>
              <Text
                style={[
                  typography.sectionLabel,
                  { color: theme.textMuted, marginBottom: 4 },
                ]}
              >
                {rel.date}
              </Text>
              <Text
                style={[typography.title2, { color: theme.text, marginBottom: 8 }]}
              >
                {rel.version}
              </Text>
              {rel.notes.map((n, i) => (
                <View
                  key={i}
                  style={{ flexDirection: 'row', marginBottom: 4 }}
                >
                  <Text
                    style={[typography.body, { color: accent, width: 14, fontWeight: '700' }]}
                  >
                    •
                  </Text>
                  <Text
                    style={[typography.body, { color: theme.textSecondary, flex: 1 }]}
                  >
                    {n}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

// -------------------------------------------------------------------------
// M5 — Pro section
// -------------------------------------------------------------------------

function ProSection({
  theme,
  isPro,
  tPro,
  tBilling,
  onUpgraded,
  router,
}: {
  theme: ReturnType<typeof useTheme>;
  isPro: boolean;
  locale: Locale;
  tPro: ReturnType<typeof useTranslations>['pro'];
  tBilling: ReturnType<typeof useTranslations>['billing'];
  onUpgraded: () => Promise<void>;
  router: ReturnType<typeof useRouter>;
}) {
  const [paywallReason, setPaywallReason] = useState<
    'card_limit' | 'custom_domain' | 'analytics' | 'html_export' | 'tip_jar' | 'password_protection' | null
  >(null);
  const [domainOpen, setDomainOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [domainNotes, setDomainNotes] = useState('');
  const [domainBusy, setDomainBusy] = useState(false);
  const [domainErr, setDomainErr] = useState<string | null>(null);

  const [exportPickerOpen, setExportPickerOpen] = useState(false);
  const [exportCards, setExportCards] = useState<
    { id: string; slug: string | null; name: string }[] | null
  >(null);

  async function handleManagePortal() {
    try {
      const { url } = await openProPortal();
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('no_subscription')) {
        setPaywallReason('card_limit');
      } else {
        Alert.alert(tBilling.errorTitle, tBilling.errorGeneric);
      }
    }
  }

  async function handleSubmitDomain() {
    if (!domain.trim() || domainBusy) return;
    setDomainBusy(true);
    setDomainErr(null);
    try {
      await submitDomainRequest({
        domain: domain.trim(),
        notes: domainNotes.trim() || undefined,
      });
      setDomainOpen(false);
      setDomain('');
      setDomainNotes('');
      Alert.alert('', tPro.requestDomainSuccess);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('pro_required')) {
        setDomainOpen(false);
        setPaywallReason('custom_domain');
      } else {
        setDomainErr(tPro.requestDomainError);
      }
    } finally {
      setDomainBusy(false);
    }
  }

  async function openExportPicker() {
    if (!isPro) {
      setPaywallReason('html_export');
      return;
    }
    setExportPickerOpen(true);
    if (exportCards === null) {
      try {
        const res = await listCards({ limit: 50 });
        setExportCards(
          res.items.map((c) => ({
            id: c.id,
            slug: c.slug,
            name:
              ((c.cardData as { name?: string })?.name as string | undefined) ??
              c.slug ??
              c.id,
          })),
        );
      } catch {
        setExportCards([]);
      }
    }
  }

  async function handleExport(cardId: string) {
    setExportPickerOpen(false);
    try {
      const token = await getAccessToken();
      const res = await fetch(`${API_BASE}${cardExportPath(cardId)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        if (res.status === 402) {
          setPaywallReason('html_export');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const html = await res.text();
      const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
      await WebBrowser.openBrowserAsync(dataUrl);
    } catch {
      Alert.alert('', tPro.htmlExportError);
    }
  }

  return (
    <>
      <SectionLabel style={styles.sectionLabel}>{tPro.sectionTitle.toUpperCase()}</SectionLabel>
      <RowGroup style={styles.rowGroup}>
        {isPro ? (
          <ProRow
            label={tPro.manageSubscription}
            body={tPro.manageBody}
            onPress={() => void handleManagePortal()}
            divider={false}
          />
        ) : (
          <ProRow
            label={tBilling.title}
            body={tBilling.priceMonthly + ' / ' + tBilling.priceYearly}
            onPress={() => setPaywallReason('card_limit')}
            divider={false}
          />
        )}
        <ProRow
          label={tPro.cardAnalytics}
          body={tPro.cardAnalyticsBody}
          onPress={() =>
            isPro
              ? router.push('/(app)/analytics' as never)
              : setPaywallReason('analytics')
          }
        />
        <ProRow
          label={tPro.htmlExport}
          body={tPro.htmlExportBody}
          onPress={() => void openExportPicker()}
        />
        <ProRow
          label={tPro.requestDomain}
          body={tPro.requestDomainBody}
          onPress={() =>
            isPro ? setDomainOpen(true) : setPaywallReason('custom_domain')
          }
        />
      </RowGroup>

      {/* Domain request modal */}
      <Modal
        visible={domainOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setDomainOpen(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: theme.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 32,
            }}
          >
            <Text
              style={[typography.title1, { color: theme.text, marginBottom: 12 }]}
            >
              {tPro.requestDomainTitle}
            </Text>
            <TextInput
              value={domain}
              onChangeText={setDomain}
              placeholder={tPro.requestDomainPlaceholder}
              placeholderTextColor={theme.textFaint}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              style={{
                borderWidth: 1,
                borderColor: theme.line.DEFAULT,
                borderRadius: 8,
                padding: 12,
                color: theme.text,
                backgroundColor: theme.pageBg,
                marginBottom: 10,
                ...typography.body,
              }}
            />
            <TextInput
              value={domainNotes}
              onChangeText={setDomainNotes}
              placeholder={tPro.requestDomainNotes}
              placeholderTextColor={theme.textFaint}
              multiline
              numberOfLines={3}
              style={{
                borderWidth: 1,
                borderColor: theme.line.DEFAULT,
                borderRadius: 8,
                padding: 12,
                color: theme.text,
                backgroundColor: theme.pageBg,
                marginBottom: 12,
                minHeight: 70,
                textAlignVertical: 'top',
                ...typography.body,
              }}
            />
            {domainErr ? (
              <Text
                style={[typography.caption, { color: theme.signalErr, marginBottom: 8 }]}
              >
                {domainErr}
              </Text>
            ) : null}
            <Button
              label={domainBusy ? '…' : tPro.requestDomainSubmit}
              onPress={() => void handleSubmitDomain()}
              disabled={domainBusy || !domain.trim()}
            />
            <Button
              label={tPro.cancel}
              onPress={() => setDomainOpen(false)}
              variant="ghost"
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </Modal>

      {/* Export picker modal */}
      <Modal
        visible={exportPickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setExportPickerOpen(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: theme.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 32,
              maxHeight: '70%',
            }}
          >
            <Text
              style={[typography.title1, { color: theme.text, marginBottom: 12 }]}
            >
              {tPro.htmlExportPickCard}
            </Text>
            <ScrollView>
              {exportCards === null ? (
                <ActivityIndicator color={accent} style={{ padding: 20 }} />
              ) : exportCards.length === 0 ? (
                <Text
                  style={[
                    typography.body,
                    { color: theme.textFaint, padding: 16, textAlign: 'center' },
                  ]}
                >
                  —
                </Text>
              ) : (
                exportCards.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => void handleExport(c.id)}
                    activeOpacity={0.7}
                    style={{
                      paddingVertical: 14,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: theme.line.DEFAULT,
                    }}
                  >
                    <Text style={[typography.title3, { color: theme.text }]}>
                      {c.name}
                    </Text>
                    {c.slug ? (
                      <Text
                        style={[typography.caption, { color: theme.textFaint, marginTop: 2 }]}
                      >
                        /c/{c.slug}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
            <Button
              label={tPro.cancel}
              onPress={() => setExportPickerOpen(false)}
              variant="ghost"
              style={{ marginTop: 12 }}
            />
          </View>
        </View>
      </Modal>

      {paywallReason ? (
        <PaywallModal
          visible
          onClose={() => setPaywallReason(null)}
          reason={paywallReason}
          onReturned={() => void onUpgraded()}
        />
      ) : null}
    </>
  );
}

function ProRow({
  label,
  body,
  onPress,
  divider = true,
}: {
  label: string;
  body: string;
  onPress: () => void;
  divider?: boolean;
}) {
  return (
    <Row
      title={label}
      subtitle={body}
      chevron
      onPress={onPress}
      divider={divider}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  sectionLabel: {
    marginTop: 24,
    marginBottom: 8,
  },
  rowGroup: {
    marginBottom: 4,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 4,
  },
  segmentCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 4,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 4,
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  segmentRow: { flexDirection: 'row', gap: 8 },
  segmentPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
  },
});
