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
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/lib/auth/store';
import {
  isBiometricEnabled,
  isBiometricAvailable,
  enableBiometric,
  disableBiometric,
} from '../../src/lib/auth/biometric';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { teal } from '../../src/lib/theme/tokens';
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
  const t = useTranslations(activeLocale).settings;
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const [bioEnabled, setBioEnabled] = useState(false);
  const [bioAvailable, setBioAvailable] = useState(false);
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);

  useEffect(() => {
    void Promise.all([isBiometricEnabled(), isBiometricAvailable()]).then(
      ([e, a]) => {
        setBioEnabled(e);
        setBioAvailable(a);
      },
    );
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
        <Card theme={theme} disabled>
          <Text style={[styles.value, { color: theme.ink[300] }]}>
            {t.notificationsComingSoon}
          </Text>
        </Card>

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
