// -----------------------------------------------------------------------
// SmartSuggestionsSection — bottom-of-Profile-tab nudges that surface
// "your card would do X% better if Y" hints.
//
// M7 Wave 2. The component owns dismissal state locally; dismissals are
// intentionally NOT persisted — closing and reopening the edit screen
// resets the panel. The card-quality heuristic re-evaluates on every
// keystroke, so a user who dismisses "Add bio" then types a bio in the
// Bio field stops seeing the row anyway.
//
// Suggestions render in the order defined in `buildSuggestions()`. The
// outer container hides itself entirely when no non-dismissed suggestion
// applies, so a "complete" card does not show this panel at all.
// -----------------------------------------------------------------------
import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Lightbulb, X as CloseIcon } from 'lucide-react-native';

import type { ApiCard } from '../../lib/api/types';
import type { ThemeTokens } from '../../lib/theme/tokens';
import { accent } from '../../lib/theme/tokens';
import { useTranslations, detectLocale } from '../../lib/i18n/locale';

type Suggestion = {
  id: string;
  text: string;
  ctaLabel: string;
  onPress: () => void;
};

type Props = {
  theme: ThemeTokens;
  card: ApiCard;
  /** Live state — fed from the edit screen so suggestions hide as the user types. */
  hasPhoto: boolean;
  bio: string;
  servicesCount: number;
  socialsFilledCount: number;
  tagsCount: number;
  onAddPhoto: () => void;
  onAddBio: () => void;
  onAddServices: () => void;
  onAddSocial: () => void;
  onSetSector: () => void;
};

export function SmartSuggestionsSection({
  theme,
  hasPhoto,
  bio,
  servicesCount,
  socialsFilledCount,
  tagsCount,
  onAddPhoto,
  onAddBio,
  onAddServices,
  onAddSocial,
  onSetSector,
}: Props) {
  const tAll = useTranslations(detectLocale());
  const t = tAll.cards.smartSuggestions;

  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const suggestions = useMemo<Suggestion[]>(() => {
    const list: Suggestion[] = [];
    if (!hasPhoto) {
      list.push({
        id: 'photo',
        text: t.photo,
        ctaLabel: t.ctaAddPhoto,
        onPress: onAddPhoto,
      });
    }
    if (!bio.trim()) {
      list.push({
        id: 'bio',
        text: t.bio,
        ctaLabel: t.ctaAddBio,
        onPress: onAddBio,
      });
    }
    if (servicesCount === 0) {
      list.push({
        id: 'services',
        text: t.services,
        ctaLabel: t.ctaAddServices,
        onPress: onAddServices,
      });
    }
    if (socialsFilledCount === 0) {
      list.push({
        id: 'social',
        text: t.social,
        ctaLabel: t.ctaAddSocial,
        onPress: onAddSocial,
      });
    }
    if (tagsCount === 0) {
      list.push({
        id: 'sector',
        text: t.sector,
        ctaLabel: t.ctaSetSector,
        onPress: onSetSector,
      });
    }
    return list;
  }, [
    hasPhoto,
    bio,
    servicesCount,
    socialsFilledCount,
    tagsCount,
    t,
    onAddPhoto,
    onAddBio,
    onAddServices,
    onAddSocial,
    onSetSector,
  ]);

  const visible = suggestions.filter((s) => !dismissed.has(s.id));
  if (visible.length === 0) return null;

  const dismiss = (id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: theme.textFaint }]}>
        {t.title}
      </Text>
      <View style={{ gap: 8 }}>
        {visible.map((s) => (
          <View
            key={s.id}
            style={[
              styles.row,
              {
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.line.DEFAULT,
              },
            ]}
          >
            <View style={styles.iconWrap}>
              <Lightbulb size={16} color={accent} strokeWidth={2.2} />
            </View>
            <Text
              style={[styles.text, { color: theme.textSecondary }]}
              numberOfLines={3}
            >
              {s.text}
            </Text>
            <TouchableOpacity
              onPress={s.onPress}
              activeOpacity={0.85}
              style={[styles.cta, { backgroundColor: accent }]}
              accessibilityLabel={s.ctaLabel}
            >
              <Text style={styles.ctaText}>{s.ctaLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => dismiss(s.id)}
              hitSlop={8}
              style={styles.dismiss}
              accessibilityLabel={t.dismiss}
            >
              <CloseIcon size={16} color={theme.textFaint} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12, marginTop: 24 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  cta: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  dismiss: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
