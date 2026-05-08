import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Linking,
  Alert,
  StyleSheet,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Bookmark, BookmarkCheck, Mail, Phone, Globe } from 'lucide-react-native';
import { getPublicCard } from '../../../src/lib/api/discover';
import { saveCard, unsaveCard, checkSaved } from '../../../src/lib/api/contacts';
import { saveCardToDeviceContacts } from '../../../src/lib/contacts/native';
import type { ApiCard } from '../../../src/lib/api/types';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { copper, signal } from '../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { API_BASE } from '../../../src/lib/api/client';
import { Button } from '../../../src/components/ui/Button';

export default function PublicCardScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const theme = useTheme();
  const t = useTranslations(detectLocale()).publicCard;

  const [card, setCard] = useState<ApiCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) return;
    void loadCard(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function loadCard(s: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicCard(s);
      setCard(res.card);
      // Check save status silently — may fail if own card
      try {
        const saveStatus = await checkSaved(s);
        setSaved(saveStatus.saved);
      } catch {
        // ignore — own card or unauthenticated
      }
    } catch {
      setError(t.errorLoad);
    } finally {
      setLoading(false);
    }
  }

  async function toggleSave() {
    if (!slug || !card) return;
    setSaving(true);
    try {
      if (saved) {
        await unsaveCard(slug);
        setSaved(false);
      } else {
        await saveCard(slug);
        setSaved(true);
        // Mirror to device Contacts so the user can find this person from
        // their phone's Contacts app — server save alone isn't enough for
        // people who reach out via the dialer or default messaging app.
        const result = await saveCardToDeviceContacts(card);
        if (result === 'saved') {
          Alert.alert('', t.contactsSaved);
        } else if (result === 'denied') {
          Alert.alert('', t.contactsDenied);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('cannot_save_own_card')) {
        // silently ignore
      } else {
        Alert.alert('', t.errorLoad);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
        <Stack.Screen options={{ title: '' }} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={copper[500]} />
        </View>
      </View>
    );
  }

  if (error || !card) {
    return (
      <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
        <Stack.Screen options={{ title: '' }} />
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: '#B8514B' }]}>{error ?? t.errorLoad}</Text>
          <Button
            label={t.retry}
            onPress={() => slug && void loadCard(slug)}
            variant="secondary"
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    );
  }

  const data = card.cardData as Record<string, unknown>;
  const name = (data.name as string) ?? slug ?? '';
  const title = data.title as string | undefined;
  const company = data.company as string | undefined;
  const email = data.email as string | undefined;
  const phone = data.phone as string | undefined;

  const photoUri = card.photoPath
    ? card.photoPath.startsWith('http')
      ? card.photoPath
      : `${API_BASE}${card.photoPath}`
    : null;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
      <Stack.Screen
        options={{
          title: name,
          headerRight: () => (
            <Pressable
              onPress={() => void toggleSave()}
              disabled={saving}
              style={styles.saveBtn}
              hitSlop={8}
            >
              {saving ? (
                <ActivityIndicator size="small" color={copper[500]} />
              ) : saved ? (
                <BookmarkCheck size={22} color={copper[500]} />
              ) : (
                <Bookmark size={22} color={copper[500]} />
              )}
            </Pressable>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.photoWrap, { backgroundColor: theme.bg[2] }]}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <Text style={[styles.photoInitial, { color: theme.ink[300] }]}>
                {name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          <Text style={[styles.name, { color: theme.ink[100] }]}>{name}</Text>

          {title ? (
            <Text style={[styles.jobTitle, { color: theme.ink[300] }]}>{title}</Text>
          ) : null}

          {company ? (
            <View style={[styles.companyBadge, { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT }]}>
              <Text style={[styles.companyText, { color: theme.ink[400] }]}>{company}</Text>
            </View>
          ) : null}
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.line.DEFAULT }]} />

        {/* Contact */}
        {(email || phone) && (
          <View style={[styles.section, { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT }]}>
            {email && (
              <Pressable
                onPress={() => void Linking.openURL(`mailto:${email}`)}
                style={[styles.contactRow, { borderBottomColor: phone ? theme.line.DEFAULT : 'transparent' }]}
              >
                <View style={[styles.contactIcon, { backgroundColor: theme.bg[2] }]}>
                  <Mail size={16} color={copper[500]} />
                </View>
                <Text style={[styles.contactLabel, { color: theme.ink[100] }]}>{email}</Text>
              </Pressable>
            )}
            {phone && (
              <Pressable
                onPress={() => void Linking.openURL(`tel:${phone}`)}
                style={styles.contactRow}
              >
                <View style={[styles.contactIcon, { backgroundColor: theme.bg[2] }]}>
                  <Phone size={16} color={copper[500]} />
                </View>
                <Text style={[styles.contactLabel, { color: theme.ink[100] }]}>{phone}</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Web link */}
        {card.slug && (
          <Pressable
            onPress={() => void Linking.openURL(`https://opsolid.de/c/${card.slug}`)}
            style={[styles.webRow, { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT }]}
          >
            <Globe size={16} color={theme.ink[400]} />
            <Text style={[styles.webLabel, { color: theme.ink[400] }]}>
              opsolid.de/c/{card.slug}
            </Text>
          </Pressable>
        )}

        {/* Save CTA */}
        <View style={styles.saveRow}>
          <Pressable
            onPress={() => void toggleSave()}
            disabled={saving}
            style={[
              styles.saveCta,
              saved
                ? { backgroundColor: theme.bg[1], borderWidth: 1, borderColor: copper[500] }
                : { backgroundColor: copper[500] },
            ]}
          >
            {saving ? (
              <ActivityIndicator size="small" color={saved ? copper[500] : '#fff'} />
            ) : (
              <Text style={[styles.saveCtaText, { color: saved ? copper[500] : '#fff' }]}>
                {saved ? t.saved : t.save}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { fontSize: 16, textAlign: 'center' },
  scroll: { paddingBottom: 40 },
  saveBtn: { paddingRight: 4 },
  hero: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    gap: 8,
  },
  photoWrap: {
    width: 100,
    height: 100,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  photo: { width: 100, height: 100 },
  photoInitial: { fontSize: 38, fontWeight: '600' },
  name: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  jobTitle: { fontSize: 15, textAlign: 'center' },
  companyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 4,
  },
  companyText: { fontSize: 13, fontWeight: '500' },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 24, marginBottom: 20 },
  section: {
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactLabel: { fontSize: 15, flex: 1 },
  webRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 28,
  },
  webLabel: { fontSize: 13 },
  saveRow: { paddingHorizontal: 16 },
  saveCta: {
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveCtaText: { fontSize: 15, fontWeight: '600' },
});
