// Verso v2 — Push notification preferences subpage.
// Route: /(app)/settings/notifications (expo-router file routing).
// State persisted locally via expo-secure-store.
// M6: wire each toggle to backend when /api/v1/push/prefs endpoint is ready.

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { AppBar, AppBarIconButton } from '../../../src/components/ui/AppBar';
import { SectionLabel } from '../../../src/components/ui/SectionLabel';
import { Row, RowGroup } from '../../../src/components/ui/Row';
import { Toggle } from '../../../src/components/ui/Toggle';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { typography } from '../../../src/lib/theme/typography';
import {
  useTranslations,
  detectLocale,
} from '../../../src/lib/i18n/locale';
import { ChevronLeft } from 'lucide-react-native';

// SecureStore key for persisting notification preferences.
const PREFS_KEY = 'notif_prefs_v1';

type NotifPrefs = {
  connections: boolean;
  mutualSaves: boolean;
  events: boolean;
  features: boolean;
};

const DEFAULT_PREFS: NotifPrefs = {
  connections: true,
  mutualSaves: true,
  events: true,
  features: true,
};

async function loadPrefs(): Promise<NotifPrefs> {
  try {
    const raw = await SecureStore.getItemAsync(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<NotifPrefs>;
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

async function savePrefs(prefs: NotifPrefs): Promise<void> {
  try {
    await SecureStore.setItemAsync(PREFS_KEY, JSON.stringify(prefs));
    // M6: wire to backend — call updateNotificationPrefs(prefs) here
    // when the /api/v1/push/prefs PATCH endpoint is available.
  } catch {
    // SecureStore write failures are silently swallowed — the in-memory
    // state remains correct for the current session.
  }
}

export default function NotificationsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const activeLocale = detectLocale();
  const t = useTranslations(activeLocale).settings;

  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void loadPrefs().then((p) => {
      setPrefs(p);
      setLoaded(true);
    });
  }, []);

  const toggle = (key: keyof NotifPrefs) => (next: boolean) => {
    const updated = { ...prefs, [key]: next };
    setPrefs(updated);
    void savePrefs(updated);
  };

  return (
    <ScreenContainer padded={false}>
      <AppBar
        variant="default"
        title={t.notificationsTitle}
        leading={
          <AppBarIconButton
            ghost
            onPress={() => router.back()}
            accessibilityLabel="Back"
          >
            <ChevronLeft size={22} color={theme.text} />
          </AppBarIconButton>
        }
        elevated
      />

      <View style={styles.content}>
        <SectionLabel style={styles.sectionLabel}>
          {t.notifications.toUpperCase()}
        </SectionLabel>

        <RowGroup>
          <Row
            title={t.notifyConnections}
            subtitle={t.notifInboxRequestsBody}
            trailing={
              <Toggle
                value={loaded ? prefs.connections : true}
                onChange={toggle('connections')}
                disabled={!loaded}
              />
            }
            divider={false}
          />
          <Row
            title={t.notifyMutualSaves}
            subtitle={t.notifMutualSavesBody}
            trailing={
              <Toggle
                value={loaded ? prefs.mutualSaves : true}
                onChange={toggle('mutualSaves')}
                disabled={!loaded}
              />
            }
          />
          <Row
            title={t.notifyEvents}
            subtitle={t.notifEventRemindersBody}
            trailing={
              <Toggle
                value={loaded ? prefs.events : true}
                onChange={toggle('events')}
                disabled={!loaded}
              />
            }
          />
          <Row
            title={t.notifyFeatures}
            trailing={
              <Toggle
                value={loaded ? prefs.features : true}
                onChange={toggle('features')}
                disabled={!loaded}
              />
            }
          />
        </RowGroup>

        <Text style={[typography.bodySmall, styles.hint, { color: theme.textFaint }]}>
          {t.notifyHint}
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 48,
  },
  sectionLabel: {
    marginBottom: 8,
    marginTop: 16,
  },
  hint: {
    marginTop: 16,
    textAlign: 'center',
  },
});
