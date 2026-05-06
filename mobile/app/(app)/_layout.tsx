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
import {
  CreditCard,
  Compass,
  Users,
  Mail,
  Settings as SettingsIcon,
} from 'lucide-react-native';

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
          tabBarIcon: ({ color, size }) => <CreditCard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: t.discover.title,
          tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: t.contacts.title,
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: t.inbox.title,
          tabBarIcon: ({ color, size }) => <Mail size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.settings.title,
          tabBarIcon: ({ color, size }) => <SettingsIcon size={size} color={color} />,
        }}
      />

      {/* Hidden routes — reachable via router.push, not shown in tab bar */}
      <Tabs.Screen name="cards/[id]" options={{ href: null, title: t.cards.detailTitle }} />
      <Tabs.Screen name="cards/create" options={{ href: null, title: t.cards.createTitle }} />
      <Tabs.Screen name="cards/edit/[id]" options={{ href: null, title: t.cards.editTitle }} />
      <Tabs.Screen name="public/[slug]" options={{ href: null, title: '' }} />
    </Tabs>
  );
}
