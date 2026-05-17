import { View, Text, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { accent, accentCredit } from '../../lib/theme/tokens';

/**
 * BrandHeader — small Verso wordmark + glyph chrome shown above each
 * authenticated tab screen (My Cards / Discover / Contacts / Inbox /
 * Settings). NOT shown on the onboarding wizard or auth screens.
 *
 * Composition decision: a 24×24 teal disc with a white `Plus` (lucide stroke
 * 3) is used instead of cropping the raster icon PNG. Reasons:
 *   1. The PNG is square with hard edges — at 24px it would alias badly.
 *   2. The Add Contact glyph's "+" is the loadbearing visual cue; rendering
 *      a vector `Plus` keeps the brand affordance ("tap to add") alive at
 *      header scale without shipping a custom SVG component.
 *   3. lucide is already a dep, so no new asset files.
 * The "by OpSolid" sub-line uses copper (`accentCredit`) per Hasan's spec —
 * this is the ONLY place in the app where copper is a brand colour now.
 */
export function BrandHeader() {
  const theme = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: theme.bg[0] }]}>
      <View style={[styles.disc, { backgroundColor: accent }]}>
        <Plus size={14} color="#FFFFFF" strokeWidth={3} />
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.wordmark, { color: theme.ink[100] }]}>Verso</Text>
        <Text style={[styles.credit, { color: accentCredit }]}>by OpSolid</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 8,
  },
  disc: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCol: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  wordmark: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  credit: {
    fontSize: 11,
    lineHeight: 13,
    opacity: 0.55,
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
});
