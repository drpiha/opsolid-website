import { useEffect, useState } from 'react';
import { Tabs, Redirect } from 'expo-router';
import { useAuthStore } from '../../src/lib/auth/store';
import {
  authenticateBiometric,
  isBiometricEnabled,
} from '../../src/lib/auth/biometric';
import { useTheme } from '../../src/lib/theme/ThemeProvider';
import { copper } from '../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';
import { CreditCard, Settings as SettingsIcon } from 'lucide-react-native';

export default function AppLayout() {
  const status = useAuthStore((s) => s.status);
  const theme = useTheme();
  const t = useTranslations(detectLocale());

  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    void isBiometricEnabled().then(async (enabled) => {
      if (!enabled) {
        setUnlocked(true);
        return;
      }
      const ok = await authenticateBiometric('Unlock OpSolid');
      setUnlocked(ok);
    });
  }, []);

  if (status === 'unauthenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  // Awaiting biometric check — keep blank (splash already hidden)
  if (!unlocked) return null;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.bg[0] },
        headerTitleStyle: { color: theme.ink[100] },
        tabBarStyle: {
          backgroundColor: theme.bg[1],
          borderTopColor: theme.line.DEFAULT,
        },
        tabBarActiveTintColor: copper[500],
        tabBarInactiveTintColor: theme.ink[400],
      }}
    >
      <Tabs.Screen
        name="cards"
        options={{
          title: t.cards.title,
          tabBarIcon: ({ color, size }) => (
            <CreditCard size={size} color={color} />
          ),
        }}
      />
      {/* Detail screen — hidden from tab bar, still reachable via router.push */}
      <Tabs.Screen
        name="cards/[id]"
        options={{
          href: null,
          title: t.cards.detailTitle,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.settings.title,
          tabBarIcon: ({ color, size }) => (
            <SettingsIcon size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
