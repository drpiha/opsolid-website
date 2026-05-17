import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { accent, accentSoft } from '../../lib/theme/tokens';

type Props = {
  /** Tapping the hero calls this. Wires to /onboarding. */
  onPress: () => void;
  headline: string;
  subline: string;
};

/**
 * Zero-card hero.
 *
 * Visual spec (Fix 1.6):
 * - 88pt circular icon container on teal[50] bg with a 2px dashed teal[300] border.
 * - Plus icon 64pt in teal[500].
 * - Headline: 20pt semibold, ink[100].
 * - Subline: 14pt regular, ink[300], max 2 lines.
 * - All text centered; tapping anywhere on the hero routes into onboarding.
 *
 * The 1px solid near-white-on-near-white border from the previous card silhouette
 * shape (contrast ~1.3:1) is replaced by the high-visibility teal dashed ring.
 */
export function CardDeckEmpty({ onPress, headline, subline }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={headline}
        style={({ pressed }) => [styles.touchTarget, pressed && styles.pressed]}
      >
        {/* Icon ring */}
        <View
          style={[
            styles.iconRing,
            {
              backgroundColor: accentSoft,
              borderColor: accent,
            },
          ]}
        >
          <Plus size={64} color={accent} strokeWidth={1.8} />
        </View>

        <Text style={[styles.headline, { color: theme.text }]}>
          {headline}
        </Text>
        <Text style={[styles.subline, { color: theme.textMuted }]}>
          {subline}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  touchTarget: {
    alignItems: 'center',
    maxWidth: 280,
  },
  pressed: {
    opacity: 0.80,
  },
  iconRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    marginTop: 28,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subline: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
