// Verso v2 Input — matches `.v-input` + `.v-field` semantics.
// 48h, 12r, 14p, accent focus halo (4px @ 10% accent).
// API kept compatible with existing callers (label + error optional).

import { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import type { TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { accent } from '../../lib/theme/tokens';
import { typography } from '../../lib/theme/typography';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  /** Optional prefix slot (e.g. for currency, country code). */
  prefix?: string;
  /** Optional suffix slot (e.g. unit, validation icon). */
  suffix?: string;
  containerStyle?: ViewStyle;
};

export function Input({
  label,
  error,
  prefix,
  suffix,
  style,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.signalErr
    : focused
    ? accent
    : theme.line.firm;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[typography.fieldLabel, { color: theme.textSecondary }]}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputWrap,
          {
            borderColor,
            backgroundColor: theme.surface,
          },
          focused && !error && styles.focusHalo,
          focused && !error && { shadowColor: accent },
        ]}
      >
        {prefix ? (
          <Text
            style={[
              typography.mono,
              styles.affix,
              { color: theme.textMuted, backgroundColor: theme.surfaceMuted, borderColor: theme.line.DEFAULT },
            ]}
          >
            {prefix}
          </Text>
        ) : null}
        <TextInput
          {...props}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            typography.body,
            { color: theme.text },
            style,
          ]}
          placeholderTextColor={theme.textFaint}
          autoCapitalize={props.autoCapitalize ?? 'none'}
        />
        {suffix ? (
          <Text
            style={[
              typography.mono,
              styles.affix,
              styles.affixRight,
              { color: theme.textMuted, backgroundColor: theme.surfaceMuted, borderColor: theme.line.DEFAULT },
            ]}
          >
            {suffix}
          </Text>
        ) : null}
      </View>
      {error ? (
        <Text style={[typography.caption, { color: theme.signalErr }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    height: '100%',
  },
  affix: {
    paddingHorizontal: 12,
    textAlignVertical: 'center',
    lineHeight: 46,
    borderRightWidth: 1,
  },
  affixRight: {
    borderRightWidth: 0,
    borderLeftWidth: 1,
  },
  focusHalo: {
    // RN doesn't render box-shadow on Android natively; on iOS the shadow
    // descriptor still produces a soft halo. For a parity look on Android,
    // a transparent overlay View could be added — deferred to polish.
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
});
