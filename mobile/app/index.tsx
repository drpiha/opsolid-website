import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/lib/auth/store';

export default function Index() {
  const status = useAuthStore((s) => s.status);
  if (status === 'authenticated') return <Redirect href="/(app)/cards" />;
  return <Redirect href="/(auth)/login" />;
}
