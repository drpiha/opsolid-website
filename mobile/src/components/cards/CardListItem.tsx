import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { copper, signal } from '../../lib/theme/tokens';
import { useTranslations, detectLocale } from '../../lib/i18n/locale';
import type { ApiCard, CardStatus } from '../../lib/api/types';

function statusColor(status: CardStatus): string {
  if (status === 'PUBLISHED') return signal.ok;
  if (status === 'DRAFT') return copper[500];
  return '#6B717B'; // ink[400] dark approximation — always muted
}

export function CardListItem({ card }: { card: ApiCard }) {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations(detectLocale()).cards;

  const contactName =
    (card.cardData?.contactName as string | undefined) ??
    card.slug ??
    card.id.slice(0, 8);

  const photoUri = card.photoPath
    ? `https://opsolid.de${card.photoPath}`
    : null;

  return (
    <Pressable
      onPress={() => router.push(`/(app)/cards/${card.id}` as never)}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: theme.bg[1],
          borderColor: theme.line.DEFAULT,
        },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${contactName}, ${t.status[card.status]}`}
    >
      <View style={[styles.thumb, { backgroundColor: theme.bg[2] }]}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.thumbImage} />
        ) : (
          <Text style={[styles.thumbInitial, { color: theme.ink[300] }]}>
            {contactName.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>

      <View style={styles.body}>
        <Text
          style={[styles.name, { color: theme.ink[100] }]}
          numberOfLines={1}
        >
          {contactName}
        </Text>
        {card.slug ? (
          <Text
            style={[styles.slug, { color: theme.ink[400] }]}
            numberOfLines={1}
          >
            /c/{card.slug}
          </Text>
        ) : null}
      </View>

      <View style={styles.statusWrap}>
        <View
          style={[styles.statusDot, { backgroundColor: statusColor(card.status) }]}
        />
        <Text style={[styles.statusLabel, { color: theme.ink[400] }]}>
          {t.status[card.status]}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbInitial: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
  },
  slug: {
    fontSize: 12,
  },
  statusWrap: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
