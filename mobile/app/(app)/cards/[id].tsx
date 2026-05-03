import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
  StyleSheet,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { Button } from '../../../src/components/ui/Button';
import { getCard, deleteCard } from '../../../src/lib/api/cards';
import type { ApiCard } from '../../../src/lib/api/types';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { copper } from '../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations(detectLocale()).cards;

  const [card, setCard] = useState<ApiCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const c = await getCard(id);
      setCard(c);
    } catch {
      setError(t.errorLoad);
    } finally {
      setLoading(false);
    }
  }, [id, t.errorLoad]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleOpenWeb = () => {
    if (!card?.slug) return;
    void Linking.openURL(`https://opsolid.de/c/${card.slug}`);
  };

  const handleDelete = () => {
    if (!card) return;
    const body = t.deleteConfirmBody.replace('{slug}', card.slug ?? card.id);
    Alert.alert(t.deleteConfirm, body, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.delete,
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            await deleteCard(card.id);
            router.back();
          } catch {
            Alert.alert(t.errorLoad);
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={copper[500]} />
        </View>
      </ScreenContainer>
    );
  }

  if (error || !card) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={{ color: '#B8514B' }}>{error ?? t.errorLoad}</Text>
          <Button
            label={t.retry}
            onPress={() => void load()}
            variant="secondary"
            style={{ marginTop: 16 }}
          />
        </View>
      </ScreenContainer>
    );
  }

  const contactName =
    (card.cardData?.contactName as string | undefined) ??
    card.slug ??
    card.id.slice(0, 8);
  const title = (card.cardData?.title as string | undefined) ?? '';
  const company = (card.cardData?.company as string | undefined) ?? '';
  const email = (card.cardData?.email as string | undefined) ?? '';
  const phone = (card.cardData?.phone as string | undefined) ?? '';

  return (
    <>
      <Stack.Screen
        options={{ title: t.detailTitle, headerBackTitle: t.title }}
      />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { backgroundColor: theme.bg[0] },
        ]}
      >
        {/* Hero card */}
        <View
          style={[
            styles.hero,
            { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
          ]}
        >
          <Text style={[styles.heroName, { color: theme.ink[100] }]}>
            {contactName}
          </Text>
          {!!title && (
            <Text style={[styles.heroTitle, { color: theme.ink[300] }]}>
              {title}
            </Text>
          )}
          {!!company && (
            <Text style={[styles.heroCompany, { color: theme.ink[400] }]}>
              {company}
            </Text>
          )}
        </View>

        {/* Contact fields */}
        {!!email && (
          <View
            style={[
              styles.field,
              { borderColor: theme.line.DEFAULT },
            ]}
          >
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
              Email
            </Text>
            <Text style={[styles.fieldValue, { color: theme.ink[100] }]}>
              {email}
            </Text>
          </View>
        )}
        {!!phone && (
          <View
            style={[
              styles.field,
              { borderColor: theme.line.DEFAULT },
            ]}
          >
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
              Phone
            </Text>
            <Text style={[styles.fieldValue, { color: theme.ink[100] }]}>
              {phone}
            </Text>
          </View>
        )}
        {card.slug ? (
          <View
            style={[
              styles.field,
              { borderColor: theme.line.DEFAULT },
            ]}
          >
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
              URL
            </Text>
            <Text style={[styles.fieldValue, { color: theme.ink[100] }]}>
              opsolid.de/c/{card.slug}
            </Text>
          </View>
        ) : null}

        {/* Actions */}
        <View style={styles.actions}>
          {card.slug && card.status === 'PUBLISHED' ? (
            <Button
              label={t.openWeb}
              onPress={handleOpenWeb}
              variant="primary"
            />
          ) : null}
          <Button
            label={t.delete}
            onPress={handleDelete}
            variant="ghost"
            loading={deleting}
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    padding: 16,
    paddingBottom: 48,
    gap: 12,
  },
  hero: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
    marginBottom: 4,
  },
  heroName: {
    fontSize: 24,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 14,
  },
  heroCompany: {
    fontSize: 13,
  },
  field: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 15,
  },
  actions: {
    marginTop: 16,
    gap: 12,
  },
});
