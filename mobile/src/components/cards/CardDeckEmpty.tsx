import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { teal } from '../../lib/theme/tokens';

type Props = {
  /** Tapping the silhouette + headline calls this. Wires to /onboarding. */
  onPress: () => void;
  headline: string;
  subline: string;
};

/**
 * Zero-card hero. A 180×108 rounded card silhouette with a turquoise "+"
 * floats centred on the screen above a "Create your first card" headline +
 * "It takes 30 seconds" subline. Tap routes the user into the onboarding
 * wizard (rather than the bare /cards/create form) — this is the wizard's
 * first-class entry point.
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
        <View
          style={[
            styles.silhouette,
            {
              backgroundColor: theme.bg[2],
              borderColor: theme.line.DEFAULT,
            },
          ]}
        >
          <Plus size={40} color={teal[500]} strokeWidth={2.4} />
        </View>
        <Text style={[styles.headline, { color: theme.ink[100] }]}>
          {headline}
        </Text>
        <Text style={[styles.subline, { color: theme.ink[400] }]}>
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
    padding: 24,
  },
  touchTarget: {
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  silhouette: {
    width: 180,
    height: 108,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  subline: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});
