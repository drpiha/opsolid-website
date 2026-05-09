import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Switch,
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
import { Stack, useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Button } from '../../src/components/ui/Button';
import { BrandHeader } from '../../src/components/ui/BrandHeader';
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
import { TextInput } from 'react-native';
import type { NotificationPrefs } from '../../src/lib/api/types';
import {
  isBiometricEnabled,
  isBiometricAvailable,
  enableBiometric,
  disableBiometric,
} from '../../src/lib/auth/biometric';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { teal, copper } from '../../src/lib/theme/tokens';

const copperHex = copper[500];
import {
  useTranslations,
  detectLocale,
  detectOsLocale,
  type Locale,
} from '../../src/lib/i18n/locale';
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

export default function SettingsScreen() {
  const theme = useTheme();
  // Subscribe to the locale store so the segment control re-renders
  // immediately on selection. detectLocale() reads from the same store.
  const localeOverride = useLocaleStore((s) => s.override);
  const setLocaleOverride = useLocaleStore((s) => s.setOverride);
  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);

  const activeLocale = detectLocale();
  const tAll = useTranslations(activeLocale);
  const t = tAll.settings;
  const tReferral = tAll.referral;
  const tSharing = tAll.sharing;
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const [bioEnabled, setBioEnabled] = useState(false);
  const [bioAvailable, setBioAvailable] = useState(false);
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);
  // M3 — referral + sharing analytics. Both are best-effort fetches that
  // self-hide on error (the user just doesn't see the panel until next mount).
  const [referral, setReferral] = useState<ReferralMeResponse | null>(null);
  const [shareSummary, setShareSummary] = useState<ShareSummary | null>(null);
  // M4 — notification preference toggles. Seeded from the auth-store user
  // (the server-side default of "all on" is mirrored here as the fallback so
  // the toggles render correctly even before /api/v1/auth/me has hydrated
  // the prefs field).
  const [prefs, setPrefs] = useState<NotificationPrefs>(() =>
    user?.notificationPrefs ?? {
      messages: true,
      inboxRequests: true,
      mutualSaves: true,
      eventReminders: true,
    },
  );
  // Track whether a PATCH is in-flight per category — prevents the toggle
  // from optimistic-flipping twice while the network round-trip resolves.
  const [savingPref, setSavingPref] = useState<keyof NotificationPrefs | null>(
    null,
  );

  // If the auth store updates (e.g. user re-hydrates with a fresh server
  // response), pull the prefs in. Done once-on-change — local optimistic
  // changes are not stomped because the auth store only updates on login /
  // hydrate / explicit setUser, not on every PATCH.
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
      // Trust the server response (handles concurrent toggles cleanly).
      if (updated.notificationPrefs) {
        setPrefs(updated.notificationPrefs);
      }
      // Mirror into auth store so other screens see the fresh prefs.
      const setUser = useAuthStore.getState().setUser;
      setUser({ ...(useAuthStore.getState().user ?? updated), ...updated });
    } catch {
      // Roll back on failure.
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
    // Fire both in parallel; failures suppressed (panels just don't render).
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

  const langOptions: LangOption[] = [
    { key: 'en', label: t.languageEn },
    { key: 'de', label: t.languageDe },
    { key: 'tr', label: t.languageTr },
  ];

  const osLocale = detectOsLocale();
  const localeHint = t.languageOsHint.replace(
    '{locale}',
    osLocale.toUpperCase(),
  );

  const copyLine = async (label: string, value: string) => {
    // No native clipboard module in the deps — fall back to Share so the user
    // can paste into Messages / Notes manually. Keeps the brief's
    // "copyable on long-press" intent without a new dependency.
    try {
      await Share.share({ message: `${label}: ${value}` });
    } catch {
      // user cancelled — silent
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: t.title }} />
      <ScreenContainer scrollable>
        <BrandHeader />
        {/* ---------- ACCOUNT ---------- */}
        <SectionHeader theme={theme}>{t.account}</SectionHeader>
        <Card theme={theme}>
          <Text style={[styles.label, { color: theme.ink[400] }]}>
            {t.signedInAs}
          </Text>
          <Text style={[styles.value, { color: theme.ink[100] }]}>
            {user?.email ?? '—'}
          </Text>
        </Card>

        {/* Biometric — only if hardware available */}
        {bioAvailable ? (
          <>
            <SectionHeader theme={theme}>{t.security}</SectionHeader>
            <Card
              theme={theme}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={[styles.value, { color: theme.ink[100] }]}>
                  {t.biometricUnlock}
                </Text>
                <Text
                  style={[
                    styles.label,
                    { color: theme.ink[400], marginTop: 2 },
                  ]}
                >
                  {t.biometricBody}
                </Text>
              </View>
              <Switch
                value={bioEnabled}
                onValueChange={(v) => void toggleBio(v)}
                trackColor={{ true: teal[500], false: theme.line.firm }}
              />
            </Card>
          </>
        ) : null}

        {/* ---------- M3 — REFER A FRIEND ---------- */}
        {referral ? (
          <>
            <SectionHeader theme={theme}>{tReferral.title}</SectionHeader>
            <Card theme={theme}>
              <Text style={[styles.label, { color: theme.ink[400] }]}>
                {tReferral.yourCode}
              </Text>
              <Text
                style={[
                  styles.value,
                  { color: theme.ink[100], fontSize: 22, letterSpacing: 2, marginTop: 4 },
                ]}
              >
                {referral.code}
              </Text>
              <Text
                style={[styles.hint, { color: theme.ink[400], marginTop: 8 }]}
              >
                {tReferral.hint}
              </Text>
              <View style={[styles.rowBetween, { marginTop: 12 }]}>
                <Text style={[styles.label, { color: theme.ink[400] }]}>
                  {tReferral.redemptions}
                </Text>
                <Text style={[styles.value, { color: copperHex }]}>
                  {referral.redemptions}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  void Share.share({
                    message: referral.deepLink,
                    url: referral.deepLink,
                  }).catch(() => {})
                }
                activeOpacity={0.85}
                style={{
                  marginTop: 14,
                  borderRadius: 999,
                  paddingVertical: 12,
                  alignItems: 'center',
                  backgroundColor: copperHex,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
                  {tReferral.shareLink}
                </Text>
              </TouchableOpacity>
            </Card>
          </>
        ) : null}

        {/* ---------- M3 — SHARING ANALYTICS ---------- */}
        {shareSummary ? (
          <>
            <SectionHeader theme={theme}>{tSharing.title}</SectionHeader>
            <Card theme={theme}>
              <Text style={[styles.hint, { color: theme.ink[400] }]}>
                {tSharing.hint}
              </Text>
              {shareSummary.total === 0 ? (
                <Text
                  style={[
                    styles.value,
                    { color: theme.ink[300], marginTop: 12 },
                  ]}
                >
                  {tSharing.empty}
                </Text>
              ) : (
                <>
                  <View style={[styles.rowBetween, { marginTop: 10, marginBottom: 8 }]}>
                    <Text style={[styles.label, { color: theme.ink[400] }]}>
                      {tSharing.total}
                    </Text>
                    <Text style={[styles.value, { color: theme.ink[100] }]}>
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
                        <View
                          style={[
                            styles.rowBetween,
                            { marginBottom: 4 },
                          ]}
                        >
                          <Text style={[styles.label, { color: theme.ink[300] }]}>
                            {tSharing.channels[ch]}
                          </Text>
                          <Text
                            style={[styles.label, { color: theme.ink[200] }]}
                          >
                            {count}
                          </Text>
                        </View>
                        <View
                          style={{
                            height: 6,
                            borderRadius: 999,
                            backgroundColor: theme.bg[2],
                            overflow: 'hidden',
                          }}
                        >
                          <View
                            style={{
                              height: 6,
                              width: `${pct}%`,
                              backgroundColor: copperHex,
                            }}
                          />
                        </View>
                      </View>
                    );
                  })}
                </>
              )}
            </Card>
          </>
        ) : null}

        {/* ---------- APPEARANCE ---------- */}
        <SectionHeader theme={theme}>{t.appearance}</SectionHeader>
        <Card theme={theme}>
          <SegmentedControl
            value={themeMode}
            options={themeOptions}
            onChange={(k) => setThemeMode(k)}
            inkColor={theme.ink[200]}
            bgColor={theme.bg[1]}
            borderColor={theme.line.DEFAULT}
          />
        </Card>

        {/* ---------- LANGUAGE ---------- */}
        <SectionHeader theme={theme}>{t.language}</SectionHeader>
        <Card theme={theme}>
          <SegmentedControl<Locale>
            value={localeOverride ?? activeLocale}
            options={langOptions}
            onChange={(k) => setLocaleOverride(k)}
            inkColor={theme.ink[200]}
            bgColor={theme.bg[1]}
            borderColor={theme.line.DEFAULT}
          />
          <TouchableOpacity
            onPress={() => setLocaleOverride(null as LocaleOverride)}
            activeOpacity={0.7}
            style={{ marginTop: 12 }}
          >
            <Text
              style={{
                color: localeOverride === null ? teal[500] : theme.ink[300],
                fontSize: 13,
                fontWeight: '500',
              }}
            >
              {t.languageSystemDefault}
              {localeOverride === null ? '  •' : ''}
            </Text>
          </TouchableOpacity>
          <Text
            style={[styles.hint, { color: theme.ink[400], marginTop: 6 }]}
          >
            {localeHint}
          </Text>
        </Card>

        {/* ---------- NOTIFICATIONS ---------- */}
        <SectionHeader theme={theme}>{t.notifications}</SectionHeader>
        <Card theme={theme}>
          <NotifToggleRow
            theme={theme}
            label={t.notifMessages}
            body={t.notifMessagesBody}
            value={prefs.messages}
            saving={savingPref === 'messages'}
            onChange={(v) => void togglePref('messages', v)}
          />
          <Divider theme={theme} />
          <NotifToggleRow
            theme={theme}
            label={t.notifInboxRequests}
            body={t.notifInboxRequestsBody}
            value={prefs.inboxRequests}
            saving={savingPref === 'inboxRequests'}
            onChange={(v) => void togglePref('inboxRequests', v)}
          />
          <Divider theme={theme} />
          <NotifToggleRow
            theme={theme}
            label={t.notifMutualSaves}
            body={t.notifMutualSavesBody}
            value={prefs.mutualSaves}
            saving={savingPref === 'mutualSaves'}
            onChange={(v) => void togglePref('mutualSaves', v)}
          />
          <Divider theme={theme} />
          <NotifToggleRow
            theme={theme}
            label={t.notifEventReminders}
            body={t.notifEventRemindersBody}
            value={prefs.eventReminders}
            saving={savingPref === 'eventReminders'}
            onChange={(v) => void togglePref('eventReminders', v)}
          />
        </Card>

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

        {/* ---------- PRIVACY & DATA ---------- */}
        <SectionHeader theme={theme}>{t.privacyData}</SectionHeader>
        <Card theme={theme} disabled>
          <View style={styles.rowBetween}>
            <Text style={[styles.value, { color: theme.ink[300] }]}>
              {t.exportData}
            </Text>
            <Text style={[styles.label, { color: theme.ink[400] }]}>
              {t.comingSoon}
            </Text>
          </View>
        </Card>
        <Card theme={theme} disabled>
          <View style={styles.rowBetween}>
            <Text style={[styles.value, { color: theme.ink[300] }]}>
              {t.deleteAccount}
            </Text>
            <Text style={[styles.label, { color: theme.ink[400] }]}>
              {t.comingSoon}
            </Text>
          </View>
        </Card>

        {/* ---------- ABOUT ---------- */}
        <SectionHeader theme={theme}>{t.about}</SectionHeader>
        <Card theme={theme}>
          <InfoRow
            theme={theme}
            label={t.version}
            value={appVersion}
            onLongPress={() => void copyLine(t.version, appVersion)}
          />
          <Divider theme={theme} />
          <InfoRow
            theme={theme}
            label={t.buildNumber}
            value={buildNumber}
            onLongPress={() => void copyLine(t.buildNumber, buildNumber)}
          />
          <Divider theme={theme} />
          <InfoRow
            theme={theme}
            label={t.platform}
            value={platformString}
            onLongPress={() => void copyLine(t.platform, platformString)}
          />
        </Card>
        <TouchableOpacity
          onPress={() => setWhatsNewOpen(true)}
          activeOpacity={0.7}
          style={{ marginTop: 4, paddingVertical: 10 }}
        >
          <Text
            style={{ color: teal[500], fontSize: 14, fontWeight: '600' }}
          >
            {t.whatsNew}  →
          </Text>
        </TouchableOpacity>

        <Button
          label={t.signOut}
          onPress={() => void handleSignOut()}
          variant="ghost"
          style={{ marginTop: 24 }}
        />
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

function SectionHeader({
  theme,
  children,
}: {
  theme: ReturnType<typeof useTheme>;
  children: string;
}) {
  return (
    <Text
      style={[
        styles.section,
        { color: theme.ink[100], opacity: 0.55 },
      ]}
    >
      {children}
    </Text>
  );
}

function Card({
  theme,
  children,
  style,
  disabled,
}: {
  theme: ReturnType<typeof useTheme>;
  children: React.ReactNode;
  style?: React.ComponentProps<typeof View>['style'];
  disabled?: boolean;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.bg[1],
          borderColor: theme.line.DEFAULT,
          opacity: disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function Divider({ theme }: { theme: ReturnType<typeof useTheme> }) {
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: theme.line.DEFAULT,
        marginVertical: 10,
      }}
    />
  );
}

function NotifToggleRow({
  theme,
  label,
  body,
  value,
  saving,
  onChange,
}: {
  theme: ReturnType<typeof useTheme>;
  label: string;
  body: string;
  value: boolean;
  saving: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <View style={styles.rowBetween}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={[styles.value, { color: theme.ink[100] }]}>{label}</Text>
        <Text
          style={[
            styles.label,
            { color: theme.ink[400], marginTop: 2, fontSize: 12 },
          ]}
        >
          {body}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={saving}
        trackColor={{ false: theme.bg[2], true: copperHex }}
        thumbColor={'#fff'}
      />
    </View>
  );
}

function InfoRow({
  theme,
  label,
  value,
  onLongPress,
}: {
  theme: ReturnType<typeof useTheme>;
  label: string;
  value: string;
  onLongPress: () => void;
}) {
  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={400}
      style={({ pressed }) => [
        styles.rowBetween,
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <Text style={[styles.label, { color: theme.ink[400] }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.ink[100] }]}>{value}</Text>
    </Pressable>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  inkColor,
  bgColor,
  borderColor,
}: {
  value: T;
  options: { key: T; label: string }[];
  onChange: (k: T) => void;
  inkColor: string;
  bgColor: string;
  borderColor: string;
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
                backgroundColor: selected ? teal[500] : bgColor,
                borderColor: selected ? teal[500] : borderColor,
              },
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: selected ? '#FFFFFF' : inkColor },
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
          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              color: theme.ink[100],
            }}
          >
            {title}
          </Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Text style={{ color: teal[500], fontSize: 15, fontWeight: '600' }}>
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
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                  color: theme.ink[100],
                  opacity: 0.55,
                  marginBottom: 4,
                }}
              >
                {rel.date}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: theme.ink[100],
                  marginBottom: 8,
                }}
              >
                {rel.version}
              </Text>
              {rel.notes.map((n, i) => (
                <View
                  key={i}
                  style={{ flexDirection: 'row', marginBottom: 4 }}
                >
                  <Text
                    style={{ color: teal[500], width: 14, fontWeight: '700' }}
                  >
                    •
                  </Text>
                  <Text
                    style={{
                      color: theme.ink[200],
                      fontSize: 14,
                      lineHeight: 20,
                      flex: 1,
                    }}
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

  // HTML export — small inline picker that lists cards on demand.
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
        // Fall back to upgrade flow.
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
      // Dump to a data: URL — opens in the in-app browser, user can save
      // via the browser's share sheet. Avoids pulling in expo-file-system.
      const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
      await WebBrowser.openBrowserAsync(dataUrl);
    } catch {
      Alert.alert('', tPro.htmlExportError);
    }
  }

  return (
    <>
      <SectionHeader theme={theme}>{tPro.sectionTitle}</SectionHeader>
      <Card theme={theme}>
        {isPro ? (
          <ProRow
            theme={theme}
            label={tPro.manageSubscription}
            body={tPro.manageBody}
            onPress={() => void handleManagePortal()}
          />
        ) : (
          <ProRow
            theme={theme}
            label={tBilling.title}
            body={tBilling.priceMonthly + ' / ' + tBilling.priceYearly}
            onPress={() => setPaywallReason('card_limit')}
          />
        )}
        <Divider theme={theme} />
        <ProRow
          theme={theme}
          label={tPro.cardAnalytics}
          body={tPro.cardAnalyticsBody}
          onPress={() =>
            isPro
              ? router.push('/(app)/analytics' as never)
              : setPaywallReason('analytics')
          }
        />
        <Divider theme={theme} />
        <ProRow
          theme={theme}
          label={tPro.htmlExport}
          body={tPro.htmlExportBody}
          onPress={() => void openExportPicker()}
        />
        <Divider theme={theme} />
        <ProRow
          theme={theme}
          label={tPro.requestDomain}
          body={tPro.requestDomainBody}
          onPress={() =>
            isPro ? setDomainOpen(true) : setPaywallReason('custom_domain')
          }
        />
      </Card>

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
              backgroundColor: theme.bg[1],
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 32,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: theme.ink[100],
                marginBottom: 12,
              }}
            >
              {tPro.requestDomainTitle}
            </Text>
            <TextInput
              value={domain}
              onChangeText={setDomain}
              placeholder={tPro.requestDomainPlaceholder}
              placeholderTextColor={theme.ink[400]}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              style={{
                borderWidth: 1,
                borderColor: theme.line.DEFAULT,
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                color: theme.ink[100],
                backgroundColor: theme.bg[0],
                marginBottom: 10,
              }}
            />
            <TextInput
              value={domainNotes}
              onChangeText={setDomainNotes}
              placeholder={tPro.requestDomainNotes}
              placeholderTextColor={theme.ink[400]}
              multiline
              numberOfLines={3}
              style={{
                borderWidth: 1,
                borderColor: theme.line.DEFAULT,
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                color: theme.ink[100],
                backgroundColor: theme.bg[0],
                marginBottom: 12,
                minHeight: 70,
                textAlignVertical: 'top',
              }}
            />
            {domainErr ? (
              <Text style={{ color: '#B8514B', fontSize: 12, marginBottom: 8 }}>
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
              backgroundColor: theme.bg[1],
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 32,
              maxHeight: '70%',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: theme.ink[100],
                marginBottom: 12,
              }}
            >
              {tPro.htmlExportPickCard}
            </Text>
            <ScrollView>
              {exportCards === null ? (
                <ActivityIndicator color={teal[500]} style={{ padding: 20 }} />
              ) : exportCards.length === 0 ? (
                <Text
                  style={{
                    color: theme.ink[400],
                    padding: 16,
                    textAlign: 'center',
                  }}
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
                    <Text
                      style={{
                        color: theme.ink[100],
                        fontSize: 15,
                        fontWeight: '500',
                      }}
                    >
                      {c.name}
                    </Text>
                    {c.slug ? (
                      <Text
                        style={{
                          color: theme.ink[400],
                          fontSize: 12,
                          marginTop: 2,
                        }}
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
  theme,
  label,
  body,
  onPress,
}: {
  theme: ReturnType<typeof useTheme>;
  label: string;
  body: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 4,
      }}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={[styles.value, { color: theme.ink[100] }]}>{label}</Text>
        <Text
          style={[
            styles.label,
            { color: theme.ink[400], marginTop: 2, fontSize: 12 },
          ]}
        >
          {body}
        </Text>
      </View>
      <Text style={{ color: theme.ink[400], fontSize: 18 }}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  section: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 18,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    lineHeight: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segmentRow: { flexDirection: 'row', gap: 8 },
  segmentPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
  },
  segmentText: { fontSize: 14, fontWeight: '600' },
});
