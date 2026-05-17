// Verso v2 SectionLabel — matches `.v-section-label`. Mono 11px uppercase
// 0.06em tracking eyebrow used above grouped content.

import { Text } from 'react-native';
import type { TextProps } from 'react-native';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { typography } from '../../lib/theme/typography';

type Props = TextProps & {
  children: string;
};

export function SectionLabel({ children, style, ...rest }: Props) {
  const theme = useTheme();
  return (
    <Text
      {...rest}
      style={[typography.sectionLabel, { color: theme.textMuted }, style]}
    >
      {children}
    </Text>
  );
}
