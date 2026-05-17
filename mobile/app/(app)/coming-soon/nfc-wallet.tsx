// Verso v2 — Coming Soon: NFC & Wallet stub screen.
// Gated on Phase 6+ Wallet developer certs (Apple/Google).
// No real waitlist API yet. M7+: wire to real waitlist endpoint.

import { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Sparkles, Smartphone } from 'lucide-react-native';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { typography } from '../../../src/lib/theme/typography';
import { AppBar, AppBarIconButton } from '../../../src/components/ui/AppBar';
import { Card } from '../../../src/components/ui/Card';
import { Chip } from '../../../src/components/ui/Chip';
import { Button } from '../../../src/components/ui/Button';
import { Input } from '../../../src/components/ui/Input';
import { SectionLabel } from '../../../src/components/ui/SectionLabel';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { useToast } from '../../../src/components/ui/Toast';

const FEATURES = [
  'NFC tap to share',
  'Apple Wallet pass',
  'Google Wallet pass',
  'Pin to lock screen',
  'Live event integration',
];

export default function NfcWalletComingSoon() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations(detectLocale());
  const { showToast } = useToast();
  const cs = t.comingSoon;

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleJoin() {
    if (submitted || submitting) return;
    setSubmitting(true);
    // M7+: wire to real waitlist endpoint
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
    showToast({ message: cs.waitlistSubmitted, variant: 'success' });
  }

  return (
    <ScreenContainer scrollable padded={false}>
      <AppBar
        variant="default"
        title={cs.nfcWallet.title}
        leading={
          <AppBarIconButton ghost onPress={() => router.back()}>
            <ChevronLeft size={20} color={theme.text} />
          </AppBarIconButton>
        }
      />
      <View style={{ padding: 24, gap: 24 }}>
        <Card variant="glow" padded={24}>
          <Chip variant="accent" label={cs.badge} style={{ alignSelf: 'flex-start' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <Smartphone size={28} color={theme.text} />
            <Text style={[typography.display2, { color: theme.text, flexShrink: 1 }]}>
              {cs.nfcWallet.heading}
            </Text>
          </View>
          <Text style={[typography.lead, { color: theme.textSecondary, marginTop: 8 }]}>
            {cs.nfcWallet.description}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {FEATURES.map((f) => (
              <Chip
                key={f}
                label={f}
                variant="default"
                leadingIcon={<Sparkles size={12} color={theme.textMuted} />}
              />
            ))}
          </View>
        </Card>

        <Card variant="flat" padded={20}>
          <SectionLabel>{cs.waitlistLabel}</SectionLabel>
          <Text style={[typography.body, { color: theme.textMuted, marginTop: 8, marginBottom: 16 }]}>
            {cs.nfcWallet.waitlistHint}
          </Text>
          <Input
            placeholder={cs.emailPlaceholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
          />
          <Button
            label={submitted ? cs.waitlistSubmitted : cs.waitlistCta}
            variant="accent"
            onPress={handleJoin}
            loading={submitting}
            disabled={submitted}
            style={{ marginTop: 12 }}
          />
        </Card>

        <Text style={[typography.caption, { color: theme.textFaint, textAlign: 'center' }]}>
          {cs.nfcWallet.phaseLabel}
        </Text>
      </View>
    </ScreenContainer>
  );
}
