import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const BIOMETRIC_ENABLED_KEY = 'opsolid.biometric.enabled';

export async function isBiometricAvailable(): Promise<boolean> {
  const compat = await LocalAuthentication.hasHardwareAsync();
  if (!compat) return false;
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
}

export async function enableBiometric(): Promise<boolean> {
  const ok = await isBiometricAvailable();
  if (!ok) return false;
  await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, '1');
  return true;
}

export async function disableBiometric(): Promise<void> {
  await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
}

export async function isBiometricEnabled(): Promise<boolean> {
  const v = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
  return v === '1';
}

export async function authenticateBiometric(reason: string): Promise<boolean> {
  const enabled = await isBiometricEnabled();
  if (!enabled) return true; // skip if user opted out
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: reason,
    cancelLabel: 'Cancel',
    fallbackLabel: 'Use passcode',
  });
  return result.success;
}
