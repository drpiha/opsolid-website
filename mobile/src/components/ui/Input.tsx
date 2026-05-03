import { TextInput, View, Text, StyleSheet } from 'react-native';
import type { TextInputProps } from 'react-native';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { signal } from '../../lib/theme/tokens';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, style, ...props }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={[styles.label, { color: theme.ink[300] }]}>{label}</Text>
      ) : null}
      <TextInput
        {...props}
        style={[
          styles.input,
          {
            borderColor: error ? signal.err : theme.line.DEFAULT,
            backgroundColor: theme.bg[1],
            color: theme.ink[100],
          },
          style,
        ]}
        placeholderTextColor={theme.ink[400]}
        autoCapitalize={props.autoCapitalize ?? 'none'}
      />
      {error ? (
        <Text style={[styles.error, { color: signal.err }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  input: {
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
  },
  error: {
    fontSize: 12,
  },
});
