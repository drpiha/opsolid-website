import { useEffect, useState } from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../src/lib/auth/store';
import {
  authenticateBiometric,
  isBiometricEnabled,
} from '../../src/lib/auth/biometric';

export default function AppLayout() {
  const status = useAuthStore((s) => s.status);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    isBiometricEnabled().then(async (enabled) => {
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

  // Awaiting biometric — keep blank (root splash already hidden)
  if (!unlocked) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="cards" />
    </Stack>
  );
}
