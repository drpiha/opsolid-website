import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../src/lib/auth/store';

export default function AuthLayout() {
  const status = useAuthStore((s) => s.status);
  if (status === 'authenticated') return <Redirect href="/(app)/cards" />;
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="magic-link" />
    </Stack>
  );
}
