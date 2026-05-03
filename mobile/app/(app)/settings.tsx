import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet, Alert } from 'react-native';
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
import { copper } from '../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../src/lib/i18n/locale';

export default function SettingsScreen() {
  const theme = useTheme();
  const t = useTranslations(detectLocale()).settings;
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const [bioEnabled, setBioEnabled] = useState(false);
  const [bioAvailable, setBioAvailable] = useState(false);

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

  const appVersion =
    (Constants.expoConfig?.version as string | undefined) ?? '0.1.0';

  return (
    <>
      <Stack.Screen options={{ title: t.title }} />
      <ScreenContainer scrollable>
        {/* Account section */}
        <Text style={[styles.section, { color: theme.ink[400] }]}>
          {t.account}
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
          ]}
        >
          <Text style={[styles.label, { color: theme.ink[400] }]}>
            {t.signedInAs}
          </Text>
          <Text style={[styles.value, { color: theme.ink[100] }]}>
            {user?.email ?? '—'}
          </Text>
        </View>

        {/* Biometric section — only if hardware available */}
        {bioAvailable ? (
          <>
            <Text
              style={[styles.section, { color: theme.ink[400], marginTop: 24 }]}
            >
              Security
            </Text>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.bg[1],
                  borderColor: theme.line.DEFAULT,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={[styles.value, { color: theme.ink[100] }]}>
                  {t.biometricUnlock}
                </Text>
                <Text
                  style={[styles.label, { color: theme.ink[400], marginTop: 2 }]}
                >
                  {t.biometricBody}
                </Text>
              </View>
              <Switch
                value={bioEnabled}
                onValueChange={(v) => void toggleBio(v)}
                trackColor={{ true: copper[500] }}
              />
            </View>
          </>
        ) : null}

        {/* About section */}
        <Text
          style={[styles.section, { color: theme.ink[400], marginTop: 24 }]}
        >
          {t.about}
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
          ]}
        >
          <Text style={[styles.label, { color: theme.ink[400] }]}>
            {t.version}
          </Text>
          <Text style={[styles.value, { color: theme.ink[100] }]}>
            {appVersion}
          </Text>
        </View>

        <Button
          label={t.signOut}
          onPress={() => void handleSignOut()}
          variant="ghost"
          style={{ marginTop: 32 }}
        />
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 8,
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
});
