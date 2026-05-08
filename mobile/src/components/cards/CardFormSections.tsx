// -----------------------------------------------------------------------
// CardFormSections — shared section components for cards/create + cards/edit.
// Match inline styles in create.tsx (line 148–156): borderRadius 10,
// paddingHorizontal 14, paddingVertical 12, fontSize 15.
// -----------------------------------------------------------------------

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import { Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import type { ThemeTokens } from '../../lib/theme/tokens';
import { copper } from '../../lib/theme/tokens';
import { useTranslations, detectLocale } from '../../lib/i18n/locale';
import { listTemplates, type Template } from '../../lib/api/templates';
import { API_BASE } from '../../lib/api/client';

// ---------- Field shape ----------
export type BasicFieldsState = {
  name: string;
  jobTitle: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  address: string;
  bio: string;
};

export type SocialsState = {
  linkedin: string;
  instagram: string;
  x: string;
  tiktok: string;
  youtube: string;
  github: string;
  facebook: string;
  xing: string;
};

export type Visibility = 'public' | 'unlisted' | 'private';

export type DiscoveryState = {
  openToNetworking: boolean;
  acceptingClients: boolean;
  industry: string;
  city: string;
  country: string;
};

const HEX_RE = /^#[0-9A-F]{6}$/i;
export const DEFAULT_PRIMARY_HEX = '#C27940';
export const DEFAULT_ACCENT_HEX = '#1F2937';

// ---------- BasicFieldsSection ----------
export function BasicFieldsSection({
  theme,
  values,
  onChange,
}: {
  theme: ThemeTokens;
  values: BasicFieldsState;
  onChange: <K extends keyof BasicFieldsState>(k: K, v: BasicFieldsState[K]) => void;
}) {
  const t = useTranslations(detectLocale()).cards;

  const fields = [
    { key: 'name' as const, label: t.fieldName, placeholder: t.namePlaceholder, required: true },
    { key: 'jobTitle' as const, label: t.fieldJobTitle, placeholder: t.titlePlaceholder },
    { key: 'position' as const, label: t.fieldPosition, placeholder: t.positionPlaceholder },
    { key: 'company' as const, label: t.fieldCompany, placeholder: t.companyPlaceholder },
    { key: 'email' as const, label: t.fieldEmail, placeholder: 'name@example.com', keyboard: 'email-address' as const },
    { key: 'phone' as const, label: t.fieldPhone, placeholder: '+49 …', keyboard: 'phone-pad' as const },
    { key: 'whatsapp' as const, label: t.fieldWhatsapp, placeholder: '+49 …', keyboard: 'phone-pad' as const },
    { key: 'website' as const, label: t.fieldWebsite, placeholder: t.websitePlaceholder, keyboard: 'url' as const },
    { key: 'address' as const, label: t.fieldAddress, placeholder: t.addressPlaceholder },
  ];

  return (
    <View style={styles.section}>
      {fields.map((f) => (
        <View key={f.key} style={styles.fieldWrap}>
          <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
            {f.label}{f.required ? ' *' : ''}
          </Text>
          <TextInput
            style={[styles.input, { color: theme.ink[100], borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[1] }]}
            value={values[f.key]}
            onChangeText={(v) => onChange(f.key, v)}
            placeholder={f.placeholder}
            placeholderTextColor={theme.ink[500]}
            keyboardType={f.keyboard ?? 'default'}
            autoCapitalize={f.keyboard ? 'none' : 'words'}
          />
        </View>
      ))}
      {/* Bio (multi-line) */}
      <View style={styles.fieldWrap}>
        <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>{t.fieldBio}</Text>
        <TextInput
          style={[
            styles.input,
            styles.multiline,
            { color: theme.ink[100], borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[1] },
          ]}
          value={values.bio}
          onChangeText={(v) => onChange('bio', v.slice(0, 500))}
          placeholder={t.bioPlaceholder}
          placeholderTextColor={theme.ink[500]}
          multiline
          numberOfLines={4}
          maxLength={500}
          textAlignVertical="top"
        />
        <Text style={[styles.charCounter, { color: theme.ink[400] }]}>
          {values.bio.length}/500
        </Text>
      </View>
    </View>
  );
}

// ---------- SocialsSection ----------
export function SocialsSection({
  theme,
  values,
  onChange,
}: {
  theme: ThemeTokens;
  values: SocialsState;
  onChange: <K extends keyof SocialsState>(k: K, v: SocialsState[K]) => void;
}) {
  const t = useTranslations(detectLocale()).cards;
  const [open, setOpen] = useState(false);

  const fields: { key: keyof SocialsState; label: string; placeholder: string }[] = [
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/yourname' },
    { key: 'instagram', label: 'Instagram', placeholder: 'instagram.com/yourname' },
    { key: 'x', label: 'X (Twitter)', placeholder: 'x.com/yourname' },
    { key: 'tiktok', label: 'TikTok', placeholder: 'tiktok.com/@yourname' },
    { key: 'youtube', label: 'YouTube', placeholder: 'youtube.com/@yourname' },
    { key: 'github', label: 'GitHub', placeholder: 'github.com/yourname' },
    { key: 'facebook', label: 'Facebook', placeholder: 'facebook.com/yourname' },
    { key: 'xing', label: 'Xing', placeholder: 'xing.com/profile/yourname' },
  ];

  return (
    <View style={styles.section}>
      <TouchableOpacity
        onPress={() => setOpen((o) => !o)}
        style={styles.collapseHeader}
        activeOpacity={0.7}
      >
        <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
          {t.sectionSocials}
        </Text>
        {open
          ? <ChevronUp size={18} color={theme.ink[400]} />
          : <ChevronDown size={18} color={theme.ink[400]} />}
      </TouchableOpacity>
      {open && (
        <View style={styles.section}>
          {fields.map((f) => (
            <View key={f.key} style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>{f.label}</Text>
              <TextInput
                style={[styles.input, { color: theme.ink[100], borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[1] }]}
                value={values[f.key]}
                onChangeText={(v) => onChange(f.key, v)}
                placeholder={f.placeholder}
                placeholderTextColor={theme.ink[500]}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ---------- BrandColorsSection ----------
// `pairedHex` is the *other* color in the brand pair (primary's pair is
// accent and vice-versa). Both rows show a 100×60 split mini-card so the
// user can see how the two read together — a single 36px swatch was too
// small to telegraph contrast.
function HexRow({
  theme,
  label,
  value,
  pairedHex,
  isPrimary,
  onValid,
}: {
  theme: ThemeTokens;
  label: string;
  value: string;
  pairedHex: string;
  /** When true, this row is the *primary* slot — its color fills the wider
   *  60% pane on the left of the mini-card, mimicking the rendered card. */
  isPrimary: boolean;
  onValid: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  function handleBlur() {
    if (HEX_RE.test(draft)) {
      const normalized = draft.toUpperCase();
      setDraft(normalized);
      onValid(normalized);
    } else {
      setDraft(value);
    }
  }

  // Show a valid color even while user is typing — only blurring with an
  // invalid string reverts the in-form value.
  const liveColor = HEX_RE.test(draft) ? draft : value;
  // The two panes always show (primary, accent) regardless of which row
  // owns the input. The owning row supplies its `liveColor`; the partner
  // row supplies the persisted `pairedHex`.
  const leftFill = isPrimary ? liveColor : pairedHex;
  const rightFill = isPrimary ? pairedHex : liveColor;

  return (
    <View style={styles.brandRow}>
      <View style={[styles.miniCard, { borderColor: theme.line.DEFAULT }]}>
        <View style={[styles.miniCardLeft, { backgroundColor: leftFill }]} />
        <View style={[styles.miniCardRight, { backgroundColor: rightFill }]} />
      </View>
      <View style={[styles.fieldWrap, { flex: 1 }]}>
        <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>{label}</Text>
        <TextInput
          style={[styles.input, { color: theme.ink[100], borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[1] }]}
          value={draft}
          onChangeText={setDraft}
          onBlur={handleBlur}
          placeholder="#XXXXXX"
          placeholderTextColor={theme.ink[500]}
          autoCapitalize="characters"
          maxLength={7}
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

export function BrandColorsSection({
  theme,
  primaryHex,
  accentHex,
  onPrimaryChange,
  onAccentChange,
}: {
  theme: ThemeTokens;
  primaryHex: string;
  accentHex: string;
  onPrimaryChange: (v: string) => void;
  onAccentChange: (v: string) => void;
}) {
  const t = useTranslations(detectLocale()).cards;

  return (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>{t.sectionBrand}</Text>
      <HexRow
        theme={theme}
        label={t.brandPrimary}
        value={primaryHex}
        pairedHex={accentHex}
        isPrimary={true}
        onValid={onPrimaryChange}
      />
      <HexRow
        theme={theme}
        label={t.brandAccent}
        value={accentHex}
        pairedHex={primaryHex}
        isPrimary={false}
        onValid={onAccentChange}
      />
    </View>
  );
}

// ---------- VisibilitySection ----------
export function VisibilitySection({
  theme,
  value,
  onChange,
}: {
  theme: ThemeTokens;
  value: Visibility;
  onChange: (v: Visibility) => void;
}) {
  const t = useTranslations(detectLocale()).cards;

  const pills: { key: Visibility; label: string }[] = [
    { key: 'public', label: t.visibilityPublic },
    { key: 'unlisted', label: t.visibilityUnlisted },
    { key: 'private', label: t.visibilityPrivate },
  ];

  return (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>{t.sectionVisibility}</Text>
      <View style={styles.segmentRow}>
        {pills.map((p) => {
          const selected = value === p.key;
          return (
            <TouchableOpacity
              key={p.key}
              onPress={() => onChange(p.key)}
              activeOpacity={0.8}
              style={[
                styles.segmentPill,
                {
                  backgroundColor: selected ? copper[500] : theme.bg[1],
                  borderColor: selected ? copper[500] : theme.line.DEFAULT,
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  { color: selected ? '#FFFFFF' : theme.ink[200] },
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={[styles.hint, { color: theme.ink[400] }]}>{t.visibilityHint}</Text>
    </View>
  );
}

// ---------- DiscoverySection ----------
export function DiscoverySection({
  theme,
  values,
  onChange,
}: {
  theme: ThemeTokens;
  values: DiscoveryState;
  onChange: <K extends keyof DiscoveryState>(k: K, v: DiscoveryState[K]) => void;
}) {
  const t = useTranslations(detectLocale()).cards;

  return (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>{t.sectionDiscovery}</Text>

      <View style={[styles.switchRow, { borderColor: theme.line.DEFAULT }]}>
        <Text style={[styles.switchLabel, { color: theme.ink[100] }]}>{t.openToNetworking}</Text>
        <Switch
          value={values.openToNetworking}
          onValueChange={(v) => onChange('openToNetworking', v)}
          trackColor={{ false: theme.bg[2], true: copper[500] }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={[styles.switchRow, { borderColor: theme.line.DEFAULT }]}>
        <Text style={[styles.switchLabel, { color: theme.ink[100] }]}>{t.acceptingClients}</Text>
        <Switch
          value={values.acceptingClients}
          onValueChange={(v) => onChange('acceptingClients', v)}
          trackColor={{ false: theme.bg[2], true: copper[500] }}
          thumbColor="#FFFFFF"
        />
      </View>

      {[
        { key: 'industry' as const, label: t.fieldIndustry, placeholder: t.industryPlaceholder },
        { key: 'city' as const, label: t.fieldCity, placeholder: '' },
        { key: 'country' as const, label: t.fieldCountry, placeholder: '' },
      ].map((f) => (
        <View key={f.key} style={styles.fieldWrap}>
          <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>{f.label}</Text>
          <TextInput
            style={[styles.input, { color: theme.ink[100], borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[1] }]}
            value={values[f.key]}
            onChangeText={(v) => onChange(f.key, v)}
            placeholder={f.placeholder}
            placeholderTextColor={theme.ink[500]}
            autoCapitalize="words"
          />
        </View>
      ))}
    </View>
  );
}

// ---------- TemplateSection ----------
// Sprint 6 — horizontal snap carousel replaces the 3-column nested grid.
// The previous grid fought the parent ScrollView for vertical gestures on
// Android (nested-scroll arbitration is unreliable). Going horizontal lets
// the parent ScrollView own vertical entirely; the carousel only handles
// the X axis, no gesture conflict.
//
// Each cell is 160x240 (3:5 portrait aspect, comfortable at thumb's reach).
// snapToInterval = cell + gap so each swipe lands a single template.
//
// Tap-to-select still fires onChange(item.id). Tap-to-preview opens the
// full-screen modal (template-preview.tsx) — same gesture, both handlers.
const TEMPLATE_CELL_WIDTH = 160;
const TEMPLATE_CELL_HEIGHT = 240;
const TEMPLATE_GAP = 12;

export function TemplateSection({
  theme,
  value,
  onChange,
  onPreviewRequest,
}: {
  theme: ThemeTokens;
  value: number;
  onChange: (templateId: number) => void;
  onPreviewRequest?: (templateId: number, sector: string) => void;
}) {
  const t = useTranslations(detectLocale()).cards;
  const [items, setItems] = useState<Template[] | null>(null);
  const [error, setError] = useState(false);
  const [sector, setSector] = useState<string>('all');

  useEffect(() => {
    let cancelled = false;
    void listTemplates()
      .then((res) => {
        if (!cancelled) setItems(res.items);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Derive unique sector list from loaded templates. Stable order = first
  // appearance in the catalog (which is already sortOrder ascending).
  const sectors = (() => {
    if (!items) return [] as string[];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const it of items) {
      const s = it.sectorHint ?? 'general';
      if (!seen.has(s)) {
        seen.add(s);
        out.push(s);
      }
    }
    return out;
  })();

  const filtered = items
    ? sector === 'all'
      ? items
      : items.filter((it) => (it.sectorHint ?? 'general') === sector)
    : [];

  const renderCell = ({ item }: { item: Template }) => {
    const selected = item.id === value;
    const previewUri = item.previewPath
      ? item.previewPath.startsWith('http')
        ? item.previewPath
        : `${API_BASE}${item.previewPath}`
      : null;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          onChange(item.id);
          onPreviewRequest?.(item.id, sector);
        }}
        style={[
          styles.templateCell,
          {
            width: TEMPLATE_CELL_WIDTH,
            height: TEMPLATE_CELL_HEIGHT,
            borderColor: selected ? copper[500] : theme.line.DEFAULT,
            borderWidth: selected ? 2 : 1,
            backgroundColor: theme.bg[1],
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: copper[50],
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {previewUri ? (
            <Image
              source={{ uri: previewUri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <Text
              numberOfLines={2}
              style={[styles.templatePlaceholder, { color: copper[700] }]}
            >
              {item.name}
            </Text>
          )}
          {selected && (
            <View style={[styles.templateCheck, { backgroundColor: copper[500] }]}>
              <Check size={12} color="#FFFFFF" />
            </View>
          )}
        </View>
        <Text
          numberOfLines={1}
          style={[styles.templateLabel, { color: theme.ink[200] }]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
        {t.sectionTemplate}
      </Text>

      {items && items.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {(['all', ...sectors] as string[]).map((s) => {
            const selected = s === sector;
            return (
              <TouchableOpacity
                key={s}
                onPress={() => setSector(s)}
                activeOpacity={0.8}
                style={[
                  styles.sectorChip,
                  {
                    backgroundColor: selected ? copper[500] : theme.bg[1],
                    borderColor: selected ? copper[500] : theme.line.DEFAULT,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.sectorChipText,
                    { color: selected ? '#FFFFFF' : theme.ink[200] },
                  ]}
                >
                  {s === 'all' ? t.sectorAll : s}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {items === null && !error ? (
        <View style={styles.templateCarouselFallback}>
          <ActivityIndicator size="small" color={copper[500]} />
        </View>
      ) : error ? (
        <View style={styles.templateCarouselFallback}>
          <Text style={{ color: theme.ink[400], fontSize: 13 }}>
            {t.templatesError}
          </Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.templateCarouselFallback}>
          <Text style={{ color: theme.ink[400], fontSize: 13 }}>
            {t.templatesEmpty}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(it) => String(it.id)}
          renderItem={renderCell}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.templateCarouselContent}
          ItemSeparatorComponent={() => <View style={{ width: TEMPLATE_GAP }} />}
          snapToInterval={TEMPLATE_CELL_WIDTH + TEMPLATE_GAP}
          decelerationRate="fast"
          initialNumToRender={6}
          windowSize={5}
        />
      )}
    </View>
  );
}

// ---------- LayoutSection ----------
const LAYOUT_KEYS = ['bento', 'accordion', 'cinema', 'editorial', 'split'] as const;
export type LayoutKey = (typeof LAYOUT_KEYS)[number];

export function LayoutSection({
  theme,
  value,
  onChange,
}: {
  theme: ThemeTokens;
  value: LayoutKey;
  onChange: (v: LayoutKey) => void;
}) {
  const t = useTranslations(detectLocale()).cards;
  return (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
        {t.sectionLayout}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {LAYOUT_KEYS.map((k) => {
          const selected = value === k;
          return (
            <TouchableOpacity
              key={k}
              onPress={() => onChange(k)}
              activeOpacity={0.8}
              style={[
                styles.sectorChip,
                {
                  backgroundColor: selected ? copper[500] : theme.bg[1],
                  borderColor: selected ? copper[500] : theme.line.DEFAULT,
                },
              ]}
            >
              <Text
                style={[
                  styles.sectorChipText,
                  { color: selected ? '#FFFFFF' : theme.ink[200] },
                ]}
              >
                {t.layouts[k]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ---------- ThemeSection ----------
const THEME_KEYS = ['aurora', 'editorial', 'cinema'] as const;
export type CardThemeKey = (typeof THEME_KEYS)[number];

export function ThemeSection({
  theme,
  value,
  onChange,
}: {
  theme: ThemeTokens;
  value: CardThemeKey;
  onChange: (v: CardThemeKey) => void;
}) {
  const t = useTranslations(detectLocale()).cards;
  return (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
        {t.sectionTheme}
      </Text>
      <View style={styles.segmentRow}>
        {THEME_KEYS.map((k) => {
          const selected = value === k;
          return (
            <TouchableOpacity
              key={k}
              onPress={() => onChange(k)}
              activeOpacity={0.8}
              style={[
                styles.segmentPill,
                {
                  backgroundColor: selected ? copper[500] : theme.bg[1],
                  borderColor: selected ? copper[500] : theme.line.DEFAULT,
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  { color: selected ? '#FFFFFF' : theme.ink[200] },
                ]}
              >
                {t.themes[k]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ---------- QrStyleSection ----------
const QR_STYLE_KEYS = [
  'classic',
  'rounded',
  'dots',
  'gradient',
  'monoNeon',
  'watercolor',
] as const;
export type QrStylePreset = (typeof QR_STYLE_KEYS)[number];

export function QrStyleSection({
  theme,
  value,
  onChange,
}: {
  theme: ThemeTokens;
  value: QrStylePreset;
  onChange: (v: QrStylePreset) => void;
}) {
  const t = useTranslations(detectLocale()).cards;
  return (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
        {t.sectionQrStyle}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {QR_STYLE_KEYS.map((k) => {
          const selected = value === k;
          return (
            <TouchableOpacity
              key={k}
              onPress={() => onChange(k)}
              activeOpacity={0.8}
              style={[
                styles.sectorChip,
                {
                  backgroundColor: selected ? copper[500] : theme.bg[1],
                  borderColor: selected ? copper[500] : theme.line.DEFAULT,
                },
              ]}
            >
              <Text
                style={[
                  styles.sectorChipText,
                  { color: selected ? '#FFFFFF' : theme.ink[200] },
                ]}
              >
                {k}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ---------- StatusBannerSection ----------
// Sprint 5 — owners can pin a single banner ("Out of office", "Now booking
// for Q3", etc) to the top of their public viewer. Three pieces of state:
// enabled toggle, free text (200 char ceiling), and tone (info/success/warn/
// announce). State lives under cardData.statusBanner so it round-trips
// through the existing PATCH cardData path with no schema work.
export const STATUS_BANNER_TONES = ['info', 'success', 'warn', 'announce'] as const;
export type StatusBannerTone = (typeof STATUS_BANNER_TONES)[number];

export type StatusBannerState = {
  enabled: boolean;
  text: string;
  tone: StatusBannerTone;
};

export const DEFAULT_STATUS_BANNER: StatusBannerState = {
  enabled: false,
  text: '',
  tone: 'info',
};

const STATUS_BANNER_TEXT_MAX = 200;

// Tone background tints for the live preview chip and (mirrored on the public
// viewer) the rendered banner. Alpha-blended so they read as faint surfaces
// regardless of the underlying theme bg.
function statusBannerToneBg(tone: StatusBannerTone, theme: ThemeTokens): string {
  switch (tone) {
    case 'info':
      return theme.bg[2];
    case 'success':
      return 'rgba(127, 178, 134, 0.15)'; // signal.ok @ 0.15
    case 'warn':
      return 'rgba(212, 162, 58, 0.15)'; // signal.warn @ 0.15
    case 'announce':
      return 'rgba(127, 221, 228, 0.20)'; // teal[200] @ 0.20
  }
}

export function StatusBannerSection({
  theme,
  value,
  onChange,
}: {
  theme: ThemeTokens;
  value: StatusBannerState;
  onChange: (next: StatusBannerState) => void;
}) {
  const t = useTranslations(detectLocale()).crm.statusBanner;
  const disabled = !value.enabled;

  return (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
        {t.section}
      </Text>

      <View style={[styles.switchRow, { borderColor: theme.line.DEFAULT }]}>
        <Text style={[styles.switchLabel, { color: theme.ink[100] }]}>
          {t.toggle}
        </Text>
        <Switch
          value={value.enabled}
          onValueChange={(v) => onChange({ ...value, enabled: v })}
          trackColor={{ false: theme.bg[2], true: copper[500] }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.fieldWrap}>
        <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
          {t.textLabel}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.ink[100],
              borderColor: theme.line.DEFAULT,
              backgroundColor: theme.bg[1],
              opacity: disabled ? 0.5 : 1,
            },
          ]}
          value={value.text}
          onChangeText={(v) =>
            onChange({ ...value, text: v.slice(0, STATUS_BANNER_TEXT_MAX) })
          }
          placeholder={t.textPlaceholder}
          placeholderTextColor={theme.ink[500]}
          editable={!disabled}
          maxLength={STATUS_BANNER_TEXT_MAX}
        />
        <Text style={[styles.charCounter, { color: theme.ink[400] }]}>
          {value.text.length}/{STATUS_BANNER_TEXT_MAX}
        </Text>
      </View>

      <View style={styles.fieldWrap}>
        <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
          {t.toneLabel}
        </Text>
        <View style={styles.segmentRow}>
          {STATUS_BANNER_TONES.map((tone) => {
            const selected = value.tone === tone;
            const tint = statusBannerToneBg(tone, theme);
            return (
              <TouchableOpacity
                key={tone}
                onPress={() => !disabled && onChange({ ...value, tone })}
                activeOpacity={0.8}
                disabled={disabled}
                style={[
                  styles.tonePill,
                  {
                    backgroundColor: tint,
                    borderColor: selected ? copper[500] : theme.line.DEFAULT,
                    borderWidth: selected ? 2 : 1,
                    opacity: disabled ? 0.5 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.toneText,
                    { color: theme.ink[100] },
                  ]}
                >
                  {t.tones[tone]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// ---------- FeedbackSection ----------
// Sprint 5 — single switch that maps to the top-level CardOrder.feedbackEnabled
// column (not cardData). The PATCH /api/v1/cards/[id] zod schema accepts it as
// of this sprint; the server's /feedback POST hard-checks the column to allow
// or refuse visitor submissions.
export function FeedbackSection({
  theme,
  value,
  onChange,
}: {
  theme: ThemeTokens;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const t = useTranslations(detectLocale()).crm.feedbackToggle;

  return (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
        {t.section}
      </Text>

      <View style={[styles.switchRow, { borderColor: theme.line.DEFAULT }]}>
        <Text style={[styles.switchLabel, { color: theme.ink[100] }]}>
          {t.toggle}
        </Text>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: theme.bg[2], true: copper[500] }}
          thumbColor="#FFFFFF"
        />
      </View>

      <Text style={[styles.hint, { color: theme.ink[400] }]}>{t.hint}</Text>
    </View>
  );
}

// ---------- Repeater sections (Services / CustomButtons / FAQs) ----------
// Extracted to CardRepeaterSections.tsx so this file stays under 1200 lines.
// Re-exported here so existing imports keep working.
export {
  ServicesSection,
  CustomButtonsSection,
  FaqsSection,
  cleanServices,
  cleanCustomButtons,
  cleanFaqs,
} from './CardRepeaterSections';
export type {
  ServiceItem,
  CustomButton,
  FaqItem,
} from './CardRepeaterSections';

// ---------- helpers exposed to screens ----------
/** Strip empty string keys from a record before saving. */
export function stripEmpty<T extends Record<string, string>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  (Object.keys(obj) as (keyof T)[]).forEach((k) => {
    const v = obj[k];
    if (typeof v === 'string' && v.trim() !== '') out[k] = v.trim() as T[keyof T];
  });
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
  multiline: { minHeight: 100 },
  charCounter: { fontSize: 11, textAlign: 'right' },
  collapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  brandRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  // Sprint 6 — split mini-card replaces the round 36×36 swatch. The new chip
  // is 100×60 and shows the *pair* (primary 60% / accent 40%) so the user
  // can read both at once while editing either hex code.
  miniCard: {
    width: 100,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: 6,
  },
  miniCardLeft: { flex: 3 }, // 60% — primaryHex
  miniCardRight: { flex: 2 }, // 40% — accentHex
  segmentRow: { flexDirection: 'row', gap: 8 },
  segmentPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
  },
  segmentText: { fontSize: 14, fontWeight: '600' },
  hint: { fontSize: 12, lineHeight: 16 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  switchLabel: { fontSize: 15, fontWeight: '500' },
  // Template/Layout/Theme/QR
  chipRow: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  sectorChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  sectorChipText: { fontSize: 13, fontWeight: '500', textTransform: 'capitalize' },
  templateCarouselContent: {
    paddingVertical: 6,
    paddingRight: 16,
  },
  templateCarouselFallback: {
    height: TEMPLATE_CELL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateCell: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  templatePlaceholder: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  templateCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateLabel: {
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  // StatusBanner tone preview chips — flex-equal so all four fit one row
  tonePill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toneText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
});
