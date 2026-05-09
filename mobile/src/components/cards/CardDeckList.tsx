import { ScrollView, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ApiCard } from '../../lib/api/types';
import { CardDeckTile } from './CardDeckTile';

type Props = {
  cards: ApiCard[];
};

/**
 * Flat list view used when the deck would exceed 10 cards. Same `CardDeckTile`
 * renders each row, vertically stacked with 12pt gap. No fan/collapse
 * animation here — at this volume the deck metaphor stops being legible and
 * a simple scrollable list is the right product boundary.
 */
export function CardDeckList({ cards }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingBottom: 32 + 64 + insets.bottom + 32 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {cards.map((card) => (
        <View key={card.id} style={styles.row}>
          <CardDeckTile card={card} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 16,
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  row: {
    marginBottom: 12,
  },
});
