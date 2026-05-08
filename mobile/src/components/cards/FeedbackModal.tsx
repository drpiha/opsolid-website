// -----------------------------------------------------------------------
// FeedbackModal — public-card 7-category rating widget (Sprint 5).
//
// POST /api/cards/[slug]/feedback. Server requires Bearer + accepts
// integer ratings 1-5 for each of the 7 categories: design, readability,
// photo, cta, mobile, trust, content. Optional comment up to 500 chars.
// Returns 201 { created } first time, 200 { updated } on resubmit.
// 400 cannot_review_own_card / 403 feedback_disabled — the public viewer
// gates the entry button so the user shouldn't be able to reach those
// states under normal use; we still surface a generic error if they do.
//
// FeedbackBreakdownModal — small companion sheet shown when the visitor
// taps the aggregate row. One bar per category against the 5-star ceiling.
// Receives `averages` from the GET /feedback aggregate so no extra fetch
// is needed.
// -----------------------------------------------------------------------

import { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Star, X, Check } from 'lucide-react-native';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { copper } from '../../lib/theme/tokens';
import { useTranslations, detectLocale } from '../../lib/i18n/locale';
import {
  submitFeedback,
  type FeedbackCategory,
  type FeedbackRatings,
} from '../../lib/api/crm';

const CATEGORIES: FeedbackCategory[] = [
  'design',
  'readability',
  'photo',
  'cta',
  'mobile',
  'trust',
  'content',
];

const COMMENT_MAX = 500;

type Props = {
  visible: boolean;
  slug: string;
  onClose: () => void;
};

export function FeedbackModal({ visible, slug, onClose }: Props) {
  const theme = useTheme();
  const t = useTranslations(detectLocale()).crm.feedback;

  // Default each category to 5 — the most common case is "I like it"; making
  // visitors tap 5×7=35 stars to reach a positive rating is needless friction.
  const defaultRatings = (): FeedbackRatings =>
    Object.fromEntries(CATEGORIES.map((c) => [c, 5])) as FeedbackRatings;

  const [ratings, setRatings] = useState<FeedbackRatings>(defaultRatings());
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (visible) {
      setRatings(defaultRatings());
      setComment('');
      setSubmitting(false);
      setErrorMsg(null);
      setSuccess(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!success) return;
    const id = setTimeout(onClose, 1500);
    return () => clearTimeout(id);
  }, [success, onClose]);

  function setRating(cat: FeedbackCategory, value: number) {
    setRatings((r) => ({ ...r, [cat]: value }));
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await submitFeedback(slug, {
        ratings,
        comment: comment.trim() ? comment.trim().slice(0, COMMENT_MAX) : undefined,
      });
      setSuccess(true);
    } catch {
      setErrorMsg(t.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          style={styles.kavRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.sheet, { backgroundColor: theme.bg[1] }]}>
            <View style={[styles.handleBar, { backgroundColor: theme.line.firm }]} />
            <View style={styles.headerRow}>
              <Text style={[styles.title, { color: theme.ink[100] }]}>
                {t.title}
              </Text>
              <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
                <X size={20} color={theme.ink[300]} />
              </Pressable>
            </View>

            {success ? (
              <View style={styles.successWrap}>
                <View style={[styles.successCheck, { backgroundColor: copper[500] }]}>
                  <Check size={28} color="#FFFFFF" />
                </View>
                <Text style={[styles.successText, { color: theme.ink[100] }]}>
                  {t.success}
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                automaticallyAdjustKeyboardInsets
              >
                {CATEGORIES.map((cat) => (
                  <View key={cat} style={styles.row}>
                    <Text style={[styles.rowLabel, { color: theme.ink[200] }]}>
                      {t.categories[cat]}
                    </Text>
                    <View style={styles.starRow}>
                      {[1, 2, 3, 4, 5].map((v) => {
                        const filled = v <= ratings[cat];
                        return (
                          <Pressable
                            key={v}
                            onPress={() => setRating(cat, v)}
                            hitSlop={6}
                            style={styles.starBtn}
                          >
                            <Star
                              size={26}
                              color={filled ? copper[500] : theme.ink[400]}
                              fill={filled ? copper[500] : 'none'}
                            />
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                ))}

                <View style={styles.fieldWrap}>
                  <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
                    {t.commentLabel}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      styles.multiline,
                      {
                        color: theme.ink[100],
                        borderColor: theme.line.DEFAULT,
                        backgroundColor: theme.bg[2],
                      },
                    ]}
                    value={comment}
                    onChangeText={(v) => setComment(v.slice(0, COMMENT_MAX))}
                    placeholder={t.commentPlaceholder}
                    placeholderTextColor={theme.ink[500]}
                    multiline
                    numberOfLines={3}
                    maxLength={COMMENT_MAX}
                    textAlignVertical="top"
                  />
                  <Text style={[styles.charCounter, { color: theme.ink[400] }]}>
                    {comment.length}/{COMMENT_MAX}
                  </Text>
                </View>

                {errorMsg ? (
                  <Text style={styles.errorText}>{errorMsg}</Text>
                ) : null}

                <Pressable
                  onPress={() => void handleSubmit()}
                  disabled={submitting}
                  style={[
                    styles.submitBtn,
                    {
                      backgroundColor: copper[500],
                      opacity: submitting ? 0.7 : 1,
                    },
                  ]}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitBtnText}>{t.submit}</Text>
                  )}
                </Pressable>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// Companion modal: tap the aggregate row → see per-category bar chart.
export function FeedbackBreakdownModal({
  visible,
  averages,
  count,
  onClose,
}: {
  visible: boolean;
  averages: Record<string, number>;
  count: number;
  onClose: () => void;
}) {
  const theme = useTheme();
  const t = useTranslations(detectLocale()).crm.feedback;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: theme.bg[1] }]}>
          <View style={[styles.handleBar, { backgroundColor: theme.line.firm }]} />
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.ink[100] }]}>
              {t.breakdownTitle}
            </Text>
            <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
              <X size={20} color={theme.ink[300]} />
            </Pressable>
          </View>

          <Text style={[styles.breakdownMeta, { color: theme.ink[300] }]}>
            {count === 1
              ? t.aggregateOne.replace('{rating}', String(avg(averages)))
              : t.aggregate
                  .replace('{rating}', String(avg(averages)))
                  .replace('{count}', String(count))}
          </Text>

          <View style={styles.breakdownList}>
            {CATEGORIES.map((cat) => {
              const v = averages[cat] ?? 0;
              const pct = Math.max(0, Math.min(1, v / 5));
              return (
                <View key={cat} style={styles.breakdownRow}>
                  <Text
                    style={[
                      styles.breakdownLabel,
                      { color: theme.ink[200] },
                    ]}
                  >
                    {t.categories[cat]}
                  </Text>
                  <View
                    style={[
                      styles.breakdownTrack,
                      { backgroundColor: theme.bg[2] },
                    ]}
                  >
                    <View
                      style={[
                        styles.breakdownFill,
                        {
                          width: `${pct * 100}%`,
                          backgroundColor: copper[500],
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.breakdownValue,
                      { color: theme.ink[100] },
                    ]}
                  >
                    {v.toFixed(1)}
                  </Text>
                </View>
              );
            })}
          </View>

          <Pressable
            onPress={onClose}
            style={[
              styles.submitBtn,
              { backgroundColor: copper[500], marginTop: 18 },
            ]}
          >
            <Text style={styles.submitBtnText}>{t.close}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function avg(averages: Record<string, number>): string {
  const vals = CATEGORIES.map((c) => averages[c] ?? 0).filter((v) => v > 0);
  if (vals.length === 0) return '0.0';
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  return (Math.round(mean * 10) / 10).toFixed(1);
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  kavRoot: { width: '100%' },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    maxHeight: '92%',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '700' },
  closeBtn: { padding: 4 },
  scroll: { flexGrow: 0 },
  scrollContent: { gap: 12, paddingBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    gap: 12,
  },
  rowLabel: { fontSize: 14, fontWeight: '500', flex: 1 },
  starRow: { flexDirection: 'row', gap: 4 },
  starBtn: { padding: 2 },
  fieldWrap: { gap: 6, marginTop: 4 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  multiline: { minHeight: 80 },
  charCounter: { fontSize: 11, textAlign: 'right' },
  errorText: {
    color: '#B8514B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: -4,
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  successWrap: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 16,
  },
  successCheck: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  breakdownMeta: {
    fontSize: 13,
    marginBottom: 12,
  },
  breakdownList: { gap: 12 },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  breakdownLabel: { fontSize: 13, width: 100 },
  breakdownTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownValue: { fontSize: 13, fontWeight: '600', width: 30, textAlign: 'right' },
});
