// -----------------------------------------------------------------------
// CardRepeaterSections — repeater-style sections (Services / CustomButtons /
// FAQs). Extracted from CardFormSections.tsx to keep that file under 1200
// lines. Re-exported from CardFormSections.tsx so imports like
// `../../src/components/cards/CardFormSections` keep resolving these names.
// Match inline TextInput styling: borderRadius 10, paddingHorizontal 14,
// paddingVertical 12, fontSize 15. Wrap each row in theme.bg[1] card with
// theme.line.DEFAULT border so they group visually.
// -----------------------------------------------------------------------

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import type { ThemeTokens } from '../../lib/theme/tokens';
import { copper } from '../../lib/theme/tokens';
import { useTranslations, detectLocale } from '../../lib/i18n/locale';

// ---------- ServicesSection ----------
export type ServiceItem = {
  title: string;
  description?: string;
  price?: string;
};

const SERVICES_MAX = 12;

export function ServicesSection({
  theme,
  items,
  onChange,
}: {
  theme: ThemeTokens;
  items: ServiceItem[];
  onChange: (next: ServiceItem[]) => void;
}) {
  const t = useTranslations(detectLocale()).cards;

  function update(idx: number, patch: Partial<ServiceItem>) {
    const next = items.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }
  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }
  function add() {
    if (items.length >= SERVICES_MAX) return;
    onChange([...items, { title: '' }]);
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>{t.sectionServices}</Text>
        <Text style={[styles.sectionHint, { color: theme.ink[400] }]}>{t.servicesHint}</Text>
      </View>

      {items.map((it, idx) => (
        <View
          key={idx}
          style={[
            styles.repeaterCard,
            { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
          ]}
        >
          <TouchableOpacity
            onPress={() => remove(idx)}
            style={styles.repeaterDelete}
            hitSlop={8}
            accessibilityLabel="Delete"
          >
            <Trash2 size={16} color={theme.ink[400]} />
          </TouchableOpacity>

          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
              {t.fieldName}
            </Text>
            <TextInput
              style={[styles.input, { color: theme.ink[100], borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[2] }]}
              value={it.title}
              onChangeText={(v) => update(idx, { title: v })}
              placeholder={t.serviceTitlePlaceholder}
              placeholderTextColor={theme.ink[500]}
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
              {t.fieldBio}
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.repeaterMultiline,
                { color: theme.ink[100], borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[2] },
              ]}
              value={it.description ?? ''}
              onChangeText={(v) => update(idx, { description: v })}
              placeholder={t.serviceDescPlaceholder}
              placeholderTextColor={theme.ink[500]}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>Price</Text>
            <TextInput
              style={[styles.input, { color: theme.ink[100], borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[2] }]}
              value={it.price ?? ''}
              onChangeText={(v) => update(idx, { price: v })}
              placeholder={t.servicePricePlaceholder}
              placeholderTextColor={theme.ink[500]}
            />
          </View>
        </View>
      ))}

      {items.length < SERVICES_MAX && (
        <TouchableOpacity
          onPress={add}
          style={[styles.addBtn, { borderColor: copper[500] }]}
          activeOpacity={0.8}
        >
          <Plus size={16} color={copper[500]} />
          <Text style={[styles.addBtnText, { color: copper[500] }]}>{t.addService}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ---------- CustomButtonsSection ----------
export type CustomButton = { label: string; url: string };

const BUTTONS_MAX = 4;

export function CustomButtonsSection({
  theme,
  items,
  onChange,
}: {
  theme: ThemeTokens;
  items: CustomButton[];
  onChange: (next: CustomButton[]) => void;
}) {
  const t = useTranslations(detectLocale()).cards;

  function update(idx: number, patch: Partial<CustomButton>) {
    const next = items.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }
  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }
  function add() {
    if (items.length >= BUTTONS_MAX) return;
    onChange([...items, { label: '', url: '' }]);
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>{t.sectionCustomButtons}</Text>
        <Text style={[styles.sectionHint, { color: theme.ink[400] }]}>{t.customButtonsHint}</Text>
      </View>

      {items.map((it, idx) => (
        <View
          key={idx}
          style={[
            styles.repeaterCard,
            { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
          ]}
        >
          <TouchableOpacity
            onPress={() => remove(idx)}
            style={styles.repeaterDelete}
            hitSlop={8}
            accessibilityLabel="Delete"
          >
            <Trash2 size={16} color={theme.ink[400]} />
          </TouchableOpacity>

          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>Label</Text>
            <TextInput
              style={[styles.input, { color: theme.ink[100], borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[2] }]}
              value={it.label}
              onChangeText={(v) => update(idx, { label: v })}
              placeholder={t.buttonLabelPlaceholder}
              placeholderTextColor={theme.ink[500]}
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>URL</Text>
            <TextInput
              style={[styles.input, { color: theme.ink[100], borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[2] }]}
              value={it.url}
              onChangeText={(v) => update(idx, { url: v })}
              placeholder={t.buttonUrlPlaceholder}
              placeholderTextColor={theme.ink[500]}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>
      ))}

      {items.length < BUTTONS_MAX && (
        <TouchableOpacity
          onPress={add}
          style={[styles.addBtn, { borderColor: copper[500] }]}
          activeOpacity={0.8}
        >
          <Plus size={16} color={copper[500]} />
          <Text style={[styles.addBtnText, { color: copper[500] }]}>{t.addButton}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ---------- FaqsSection ----------
export type FaqItem = { question: string; answer: string };

const FAQS_MAX = 12;

export function FaqsSection({
  theme,
  items,
  onChange,
}: {
  theme: ThemeTokens;
  items: FaqItem[];
  onChange: (next: FaqItem[]) => void;
}) {
  const t = useTranslations(detectLocale()).cards;

  function update(idx: number, patch: Partial<FaqItem>) {
    const next = items.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }
  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }
  function add() {
    if (items.length >= FAQS_MAX) return;
    onChange([...items, { question: '', answer: '' }]);
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>{t.sectionFaqs}</Text>
        <Text style={[styles.sectionHint, { color: theme.ink[400] }]}>{t.faqsHint}</Text>
      </View>

      {items.map((it, idx) => (
        <View
          key={idx}
          style={[
            styles.repeaterCard,
            { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
          ]}
        >
          <TouchableOpacity
            onPress={() => remove(idx)}
            style={styles.repeaterDelete}
            hitSlop={8}
            accessibilityLabel="Delete"
          >
            <Trash2 size={16} color={theme.ink[400]} />
          </TouchableOpacity>

          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>Q</Text>
            <TextInput
              style={[styles.input, { color: theme.ink[100], borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[2] }]}
              value={it.question}
              onChangeText={(v) => update(idx, { question: v })}
              placeholder={t.faqQuestionPlaceholder}
              placeholderTextColor={theme.ink[500]}
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>A</Text>
            <TextInput
              style={[
                styles.input,
                styles.repeaterMultiline,
                { color: theme.ink[100], borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[2] },
              ]}
              value={it.answer}
              onChangeText={(v) => update(idx, { answer: v })}
              placeholder={t.faqAnswerPlaceholder}
              placeholderTextColor={theme.ink[500]}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>
      ))}

      {items.length < FAQS_MAX && (
        <TouchableOpacity
          onPress={add}
          style={[styles.addBtn, { borderColor: copper[500] }]}
          activeOpacity={0.8}
        >
          <Plus size={16} color={copper[500]} />
          <Text style={[styles.addBtnText, { color: copper[500] }]}>{t.addFaq}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ---------- normalizers ----------
// Note: these emit the SERVER-side shape, not the local UI shape. The form
// state holds friendly mobile keys (price/url/question/answer); the server's
// CardDataSchema (src/lib/validation.ts) defines `.strict()` sub-schemas with
// `priceLabel`, `href`+`style`, `q`/`a`. We translate at the boundary so the
// PATCH/POST passes invalid_payload validation. Without this map the create
// endpoint returns 400 and the mobile alert shows "yüklenemedi". Keep the
// return type as `unknown[]` to make the boundary cast explicit.
export function cleanServices(items: ServiceItem[]): Array<{ title: string; description?: string; priceLabel?: string }> {
  const out: Array<{ title: string; description?: string; priceLabel?: string }> = [];
  for (const it of items) {
    const title = (it.title ?? '').trim();
    if (!title) continue;
    const row: { title: string; description?: string; priceLabel?: string } = { title };
    const desc = (it.description ?? '').trim();
    if (desc) row.description = desc;
    const price = (it.price ?? '').trim();
    if (price) row.priceLabel = price;
    out.push(row);
  }
  return out;
}

export function cleanCustomButtons(items: CustomButton[]): Array<{ label: string; href: string; style: 'secondary' }> {
  const out: Array<{ label: string; href: string; style: 'secondary' }> = [];
  for (const it of items) {
    const label = (it.label ?? '').trim();
    const url = (it.url ?? '').trim();
    if (!label || !url) continue;
    // Server CustomButtonSchema requires `href` (not `url`) and `style`
    // defaults to 'secondary'. We always send 'secondary' since the mobile
    // editor doesn't expose a style picker yet.
    out.push({ label, href: url, style: 'secondary' });
  }
  return out;
}

export function cleanFaqs(items: FaqItem[]): Array<{ q: string; a: string }> {
  const out: Array<{ q: string; a: string }> = [];
  for (const it of items) {
    const question = (it.question ?? '').trim();
    const answer = (it.answer ?? '').trim();
    if (!question || !answer) continue;
    // Server FaqItemSchema uses short keys `q` / `a`.
    out.push({ q: question, a: answer });
  }
  return out;
}

const styles = StyleSheet.create({
  section: { gap: 16, marginTop: 24 },
  fieldWrap: { gap: 6 },
  fieldLabel: { fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.4 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHint: { fontSize: 11, fontWeight: '500' },
  repeaterCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    position: 'relative',
  },
  repeaterDelete: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 6,
    zIndex: 1,
  },
  repeaterMultiline: { minHeight: 60 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addBtnText: { fontSize: 14, fontWeight: '600' },
});
