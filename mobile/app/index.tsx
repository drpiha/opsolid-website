import { Redirect } from 'expo-router';

// Root entry: always redirect to login screen.
// C7.3 will add auth-state check here: if token is valid → /(app)/cards
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
