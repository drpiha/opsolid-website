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
import {
  listEvents as listEventsApi,
  type EventListItem as EventsListItem,
} from '../../lib/api/events';
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

// ---------- EventsAttendingSection (Sprint F2) ----------
// Multi-select chip list of upcoming events. Pre-checked = currently attending.
// Loads events lazily on mount. While loading, renders a small spinner row so
// the section's height doesn't jump when the response lands.
//
// Save path: caller persists selectedIds via POST /api/v1/cards/:id/events
// (see updateCardEvents() in src/lib/api/events.ts) AFTER the main PATCH so
// a partial save still leaves the card itself in a consistent shape.
export function EventsAttendingSection({
  theme,
  selectedIds,
  onChange,
}: {
  theme: ThemeTokens;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const tEvents = useTranslations(detectLocale()).events;
  const [events, setEvents] = useState<EventsListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void listEventsApi()
      .then((res) => {
        if (!cancelled) setEvents(res.items);
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggle(id: string) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    onChange(next);
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
        {tEvents.sectionAttending}
      </Text>
      <Text style={[styles.hint, { color: theme.ink[400] }]}>
        {tEvents.sectionAttendingHint}
      </Text>

      {loading ? (
        <View style={{ paddingVertical: 12, alignItems: 'flex-start' }}>
          <ActivityIndicator size="small" color={copper[500]} />
        </View>
      ) : events.length === 0 ? (
        <Text style={[styles.hint, { color: theme.ink[500], fontStyle: 'italic' }]}>
          {tEvents.empty}
        </Text>
      ) : (
        <View style={styles.eventChipWrap}>
          {events.map((ev) => {
            const selected = selectedIds.includes(ev.id);
            return (
              <TouchableOpacity
                key={ev.id}
                onPress={() => toggle(ev.id)}
                activeOpacity={0.85}
                style={[
                  styles.eventChip,
                  {
                    backgroundColor: selected ? copper[500] : theme.bg[1],
                    borderColor: selected ? copper[500] : theme.line.DEFAULT,
                  },
                ]}
              >
                {selected && (
                  <Check size={12} color="#FFFFFF" strokeWidth={2.5} />
                )}
                <Text
                  style={[
                    styles.eventChipText,
                    { color: selected ? '#FFFFFF' : theme.ink[200] },
                  ]}
                  numberOfLines={1}
                >
                  {ev.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
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

// ---------- ContactFormSection (M1 — Form-builder-lite, Carrd amendment) ----------
// Owner-defined override of the public-card "Bana Ulaş" form. Toggle on/off,
// 3-field default + "Add field" up to 5 fields total, per-ESP token field
// (password input, masked). When `enabled === true` the public viewer reads
// these field definitions instead of the hard-coded shape.
//
// Field key palette is intentionally tiny (name / email / message) — the v0
// spec says "no drag-drop logic, no conditional fields" (carrd-comparison-plan
// §4 row 2 — Adapt). The label per field is freely editable, the key is the
// stable identifier the public viewer + lead route use to map values.

import type { ContactFormConfig, ContactFormFieldKey } from '../../lib/api/types';
export type { ContactFormConfig, ContactFormField, ContactFormFieldKey } from '../../lib/api/types';

const CONTACT_FORM_FIELD_KEYS: readonly ContactFormFieldKey[] = [
  'name',
  'email',
  'message',
] as const;

const CONTACT_FORM_MAX_FIELDS = 5;

export const DEFAULT_CONTACT_FORM: ContactFormConfig = {
  enabled: false,
  fields: [
    { key: 'name', label: 'Name', required: true },
    { key: 'email', label: 'Email', required: true },
    { key: 'message', label: 'Message', required: false },
  ],
  submitLabel: 'Send',
  esps: undefined,
};

export function ContactFormSection({
  theme,
  value,
  onChange,
}: {
  theme: ThemeTokens;
  value: ContactFormConfig;
  onChange: (next: ContactFormConfig) => void;
}) {
  const t = useTranslations(detectLocale()).crm.contactForm;
  const disabled = !value.enabled;

  function updateField(idx: number, patch: Partial<ContactFormConfig['fields'][number]>) {
    const next = value.fields.map((f, i) => (i === idx ? { ...f, ...patch } : f));
    onChange({ ...value, fields: next });
  }

  function removeField(idx: number) {
    if (value.fields.length <= 1) return;
    const next = value.fields.filter((_, i) => i !== idx);
    onChange({ ...value, fields: next });
  }

  function addField() {
    if (value.fields.length >= CONTACT_FORM_MAX_FIELDS) return;
    // Pick the next key not already in the list; falls back to 'message'.
    const used = new Set(value.fields.map((f) => f.key));
    const free = CONTACT_FORM_FIELD_KEYS.find((k) => !used.has(k)) ?? 'message';
    const next: ContactFormConfig['fields'][number] = {
      key: free,
      label: free.charAt(0).toUpperCase() + free.slice(1),
      required: false,
    };
    onChange({ ...value, fields: [...value.fields, next] });
  }

  function patchEsp(provider: 'mailchimp' | 'mailerlite' | 'webhook', kv: Record<string, string>) {
    const esps = { ...(value.esps ?? {}) };
    if (provider === 'webhook') {
      const url = kv.url ?? '';
      esps.webhook = url ? { url } : undefined;
    } else if (provider === 'mailchimp') {
      const cur = esps.mailchimp ?? { listId: '', audienceId: '' };
      const merged = { ...cur, ...kv };
      // Drop the entire mailchimp config when both id fields are empty so we
      // don't persist an empty record on the server.
      if (!merged.listId && !merged.audienceId && !merged.apiKey) {
        esps.mailchimp = undefined;
      } else {
        esps.mailchimp = merged;
      }
    } else {
      const cur = esps.mailerlite ?? { groupId: '' };
      const merged = { ...cur, ...kv };
      if (!merged.groupId && !merged.apiKey) {
        esps.mailerlite = undefined;
      } else {
        esps.mailerlite = merged;
      }
    }
    onChange({ ...value, esps });
  }

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

      <Text style={[styles.hint, { color: theme.ink[400] }]}>{t.hint}</Text>

      {/* Submit label */}
      <View style={[styles.fieldWrap, { opacity: disabled ? 0.5 : 1 }]}>
        <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
          {t.submitLabel}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.ink[100],
              borderColor: theme.line.DEFAULT,
              backgroundColor: theme.bg[1],
            },
          ]}
          editable={!disabled}
          value={value.submitLabel}
          onChangeText={(v) => onChange({ ...value, submitLabel: v.slice(0, 40) })}
          placeholder={t.submitLabelPlaceholder}
          placeholderTextColor={theme.ink[500]}
        />
      </View>

      {/* Field rows */}
      <Text style={[styles.fieldLabel, { color: theme.ink[400], marginTop: 8 }]}>
        {t.fieldsLabel}
      </Text>
      {value.fields.map((f, idx) => (
        <View
          key={`${f.key}-${idx}`}
          style={[
            styles.contactFieldRow,
            { borderColor: theme.line.DEFAULT, opacity: disabled ? 0.5 : 1 },
          ]}
        >
          <View style={{ flex: 1, gap: 6 }}>
            <View style={styles.contactFieldKeyRow}>
              {CONTACT_FORM_FIELD_KEYS.map((k) => {
                const active = f.key === k;
                return (
                  <TouchableOpacity
                    key={k}
                    onPress={() => !disabled && updateField(idx, { key: k })}
                    disabled={disabled}
                    style={[
                      styles.contactFieldKeyChip,
                      {
                        backgroundColor: active ? copper[500] : theme.bg[1],
                        borderColor: active ? copper[500] : theme.line.DEFAULT,
                      },
                    ]}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.contactFieldKeyText,
                        { color: active ? '#FFFFFF' : theme.ink[200] },
                      ]}
                    >
                      {t.fieldKeys[k]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.ink[100],
                  borderColor: theme.line.DEFAULT,
                  backgroundColor: theme.bg[1],
                },
              ]}
              value={f.label}
              onChangeText={(v) => updateField(idx, { label: v.slice(0, 60) })}
              placeholder={t.fieldLabelPlaceholder}
              placeholderTextColor={theme.ink[500]}
              editable={!disabled}
            />
            <View style={styles.contactFieldFooter}>
              <View style={styles.contactFieldRequired}>
                <Switch
                  value={f.required}
                  onValueChange={(v) => updateField(idx, { required: v })}
                  trackColor={{ false: theme.bg[2], true: copper[500] }}
                  thumbColor="#FFFFFF"
                  disabled={disabled}
                />
                <Text style={[styles.hint, { color: theme.ink[400] }]}>
                  {t.requiredLabel}
                </Text>
              </View>
              {value.fields.length > 1 ? (
                <TouchableOpacity
                  onPress={() => !disabled && removeField(idx)}
                  disabled={disabled}
                  hitSlop={8}
                >
                  <Text style={[styles.contactFieldRemove, { color: theme.ink[400] }]}>
                    {t.removeField}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      ))}

      {value.fields.length < CONTACT_FORM_MAX_FIELDS ? (
        <TouchableOpacity
          onPress={() => !disabled && addField()}
          disabled={disabled}
          style={[
            styles.contactAddBtn,
            { borderColor: theme.line.DEFAULT, opacity: disabled ? 0.5 : 1 },
          ]}
        >
          <Text style={[styles.contactAddBtnText, { color: copper[500] }]}>
            {t.addField}
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* ESP integrations */}
      <Text
        style={[styles.fieldLabel, { color: theme.ink[400], marginTop: 16 }]}
      >
        {t.espSection}
      </Text>
      <Text style={[styles.hint, { color: theme.ink[400] }]}>{t.espHint}</Text>

      {/* Mailchimp */}
      <View style={[styles.fieldWrap, { opacity: disabled ? 0.5 : 1 }]}>
        <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
          Mailchimp
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.ink[100],
              borderColor: theme.line.DEFAULT,
              backgroundColor: theme.bg[1],
            },
          ]}
          editable={!disabled}
          value={value.esps?.mailchimp?.listId ?? ''}
          onChangeText={(v) => patchEsp('mailchimp', { listId: v.trim() })}
          placeholder={t.mailchimpListId}
          placeholderTextColor={theme.ink[500]}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={[
            styles.input,
            {
              color: theme.ink[100],
              borderColor: theme.line.DEFAULT,
              backgroundColor: theme.bg[1],
            },
          ]}
          editable={!disabled}
          value={value.esps?.mailchimp?.audienceId ?? ''}
          onChangeText={(v) => patchEsp('mailchimp', { audienceId: v.trim() })}
          placeholder={t.mailchimpAudienceId}
          placeholderTextColor={theme.ink[500]}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={[
            styles.input,
            {
              color: theme.ink[100],
              borderColor: theme.line.DEFAULT,
              backgroundColor: theme.bg[1],
            },
          ]}
          editable={!disabled}
          value={value.esps?.mailchimp?.apiKey ?? ''}
          onChangeText={(v) => patchEsp('mailchimp', { apiKey: v.trim() })}
          placeholder={t.mailchimpApiKey}
          placeholderTextColor={theme.ink[500]}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
      </View>

      {/* MailerLite */}
      <View style={[styles.fieldWrap, { opacity: disabled ? 0.5 : 1 }]}>
        <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
          MailerLite
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.ink[100],
              borderColor: theme.line.DEFAULT,
              backgroundColor: theme.bg[1],
            },
          ]}
          editable={!disabled}
          value={value.esps?.mailerlite?.groupId ?? ''}
          onChangeText={(v) => patchEsp('mailerlite', { groupId: v.trim() })}
          placeholder={t.mailerliteGroupId}
          placeholderTextColor={theme.ink[500]}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={[
            styles.input,
            {
              color: theme.ink[100],
              borderColor: theme.line.DEFAULT,
              backgroundColor: theme.bg[1],
            },
          ]}
          editable={!disabled}
          value={value.esps?.mailerlite?.apiKey ?? ''}
          onChangeText={(v) => patchEsp('mailerlite', { apiKey: v.trim() })}
          placeholder={t.mailerliteApiKey}
          placeholderTextColor={theme.ink[500]}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
      </View>

      {/* Webhook */}
      <View style={[styles.fieldWrap, { opacity: disabled ? 0.5 : 1 }]}>
        <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
          {t.webhookLabel}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.ink[100],
              borderColor: theme.line.DEFAULT,
              backgroundColor: theme.bg[1],
            },
          ]}
          editable={!disabled}
          value={value.esps?.webhook?.url ?? ''}
          onChangeText={(v) => patchEsp('webhook', { url: v.trim() })}
          placeholder={t.webhookPlaceholder}
          placeholderTextColor={theme.ink[500]}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

// ---------- TagsSection (M2 — sector / topic tags) ----------
// Owner picks up to 5 tags from a curated 24-sector menu, plus optionally a
// custom kebab-case slug. Tags drive Discover chip-strip filtering and the
// people-you-may-know sector-overlap score on the server. Slug is the stable
// network identifier; display label is locale-aware.

import { CURATED_TAG_SLUGS, MAX_TAGS_PER_CARD, normalizeTagSlug } from '../../lib/discover/tags';

export function TagsSection({
  theme,
  selected,
  onChange,
}: {
  theme: ThemeTokens;
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const tTags = useTranslations(detectLocale()).tags;
  const [customDraft, setCustomDraft] = useState('');

  const atCap = selected.length >= MAX_TAGS_PER_CARD;
  const selectedSet = new Set(selected);

  function toggle(tag: string) {
    if (selectedSet.has(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else if (!atCap) {
      onChange([...selected, tag]);
    }
  }

  function addCustom() {
    const normalized = normalizeTagSlug(customDraft);
    if (!normalized) return;
    if (selectedSet.has(normalized)) {
      setCustomDraft('');
      return;
    }
    if (atCap) return;
    onChange([...selected, normalized]);
    setCustomDraft('');
  }

  // Curated tags are split into the curated palette (chips) and any selected
  // tag the user has previously added that's NOT in the curated set — those
  // get rendered as "custom" pills above the curated palette so the user
  // can still see + remove them.
  const customSelections = selected.filter(
    (t) => !(CURATED_TAG_SLUGS as readonly string[]).includes(t),
  );

  return (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
        {tTags.section}
      </Text>
      <Text style={[styles.hint, { color: theme.ink[400] }]}>
        {tTags.hint.replace('{n}', String(MAX_TAGS_PER_CARD))}
      </Text>

      {/* Custom selections — surface above the curated palette so the user
          can see them in the same chip-row visual language. */}
      {customSelections.length > 0 ? (
        <View style={styles.tagWrap}>
          {customSelections.map((tag) => (
            <TouchableOpacity
              key={tag}
              onPress={() => toggle(tag)}
              activeOpacity={0.85}
              style={[
                styles.tagChip,
                styles.tagChipCustom,
                {
                  backgroundColor: copper[500],
                  borderColor: copper[500],
                },
              ]}
            >
              <Check size={12} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={[styles.tagChipText, { color: '#FFFFFF' }]} numberOfLines={1}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {/* Curated palette — 24 chips. Selected: copper-filled. */}
      <View style={styles.tagWrap}>
        {CURATED_TAG_SLUGS.map((tag) => {
          const isSelected = selectedSet.has(tag);
          const disabled = !isSelected && atCap;
          const label = (tTags.labels as Record<string, string | undefined>)[tag] ?? tag;
          return (
            <TouchableOpacity
              key={tag}
              onPress={() => toggle(tag)}
              disabled={disabled}
              activeOpacity={0.85}
              style={[
                styles.tagChip,
                {
                  backgroundColor: isSelected ? copper[500] : theme.bg[1],
                  borderColor: isSelected ? copper[500] : theme.line.DEFAULT,
                  opacity: disabled ? 0.4 : 1,
                },
              ]}
            >
              {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={2.5} />}
              <Text
                style={[
                  styles.tagChipText,
                  { color: isSelected ? '#FFFFFF' : theme.ink[200] },
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Custom tag input. Disabled when at cap so the user knows they need
          to remove one before adding a custom slug. */}
      <View style={styles.tagCustomRow}>
        <TextInput
          style={[
            styles.input,
            {
              flex: 1,
              color: theme.ink[100],
              borderColor: theme.line.DEFAULT,
              backgroundColor: theme.bg[1],
              opacity: atCap ? 0.5 : 1,
            },
          ]}
          editable={!atCap}
          value={customDraft}
          onChangeText={(v) => setCustomDraft(v.slice(0, 24))}
          placeholder={tTags.customPlaceholder}
          placeholderTextColor={theme.ink[500]}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={addCustom}
          returnKeyType="done"
        />
        <TouchableOpacity
          onPress={addCustom}
          disabled={atCap || customDraft.trim().length === 0}
          activeOpacity={0.85}
          style={[
            styles.tagAddBtn,
            {
              borderColor: theme.line.DEFAULT,
              opacity: atCap || customDraft.trim().length === 0 ? 0.4 : 1,
            },
          ]}
        >
          <Text style={[styles.tagAddBtnText, { color: copper[500] }]}>
            {tTags.add}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------- EmbedsSection (M3 — Carrd amendment: curated embed whitelist) ----------
// Owner pastes up to 3 video / audio / booking embeds; only the 5 whitelisted
// hosts are accepted (youtube / vimeo / spotify / soundcloud / calendly). The
// public viewer renders each entry as a tappable thumbnail (mobile) or a
// sandboxed iframe (web) — never `<iframe srcdoc>` or arbitrary URLs (XSS risk).

export type EmbedKind = 'youtube' | 'vimeo' | 'spotify' | 'soundcloud' | 'calendly';
export type EmbedItem = { kind: EmbedKind; url: string };

const EMBED_KINDS: readonly EmbedKind[] = [
  'youtube',
  'vimeo',
  'spotify',
  'soundcloud',
  'calendly',
];

const MAX_EMBEDS = 3;

// Host allowlist — the same set the server validates against. We re-validate
// here so the form gives an immediate error instead of letting a save fail.
const EMBED_HOSTS: Record<EmbedKind, RegExp> = {
  youtube: /(?:^|\.)(youtube\.com|youtu\.be|youtube-nocookie\.com)$/i,
  vimeo: /(?:^|\.)(vimeo\.com|player\.vimeo\.com)$/i,
  spotify: /(?:^|\.)(spotify\.com|open\.spotify\.com)$/i,
  soundcloud: /(?:^|\.)(soundcloud\.com|w\.soundcloud\.com)$/i,
  calendly: /(?:^|\.)(calendly\.com)$/i,
};

function detectEmbedKind(url: string): EmbedKind | null {
  try {
    const host = new URL(url).hostname.toLowerCase();
    for (const k of EMBED_KINDS) {
      if (EMBED_HOSTS[k].test(host)) return k;
    }
    return null;
  } catch {
    return null;
  }
}

export function asEmbeds(v: unknown): EmbedItem[] {
  if (!Array.isArray(v)) return [];
  const out: EmbedItem[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') continue;
    const o = raw as Record<string, unknown>;
    const kindRaw = typeof o.kind === 'string' ? o.kind : '';
    const url = typeof o.url === 'string' ? o.url.trim() : '';
    if (!url) continue;
    if (!(EMBED_KINDS as readonly string[]).includes(kindRaw)) continue;
    out.push({ kind: kindRaw as EmbedKind, url });
    if (out.length >= MAX_EMBEDS) break;
  }
  return out;
}

export function EmbedsSection({
  theme,
  value,
  onChange,
}: {
  theme: ThemeTokens;
  value: EmbedItem[];
  onChange: (next: EmbedItem[]) => void;
}) {
  const tEmb = useTranslations(detectLocale()).embeds;
  const [draft, setDraft] = useState('');
  const [draftError, setDraftError] = useState<string | null>(null);

  const atCap = value.length >= MAX_EMBEDS;

  function tryAdd() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (atCap) return;
    const kind = detectEmbedKind(trimmed);
    if (!kind) {
      setDraftError(tEmb.invalidHost);
      return;
    }
    onChange([...value, { kind, url: trimmed }]);
    setDraft('');
    setDraftError(null);
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
        {tEmb.section}
      </Text>
      <Text style={[styles.hint, { color: theme.ink[400] }]}>
        {tEmb.hint.replace('{n}', String(MAX_EMBEDS))}
      </Text>

      {value.map((em, i) => (
        <View
          key={`${em.kind}-${i}-${em.url}`}
          style={[
            styles.embedRow,
            { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.embedRowKind, { color: copper[500] }]}>
              {(tEmb.kinds as Record<string, string | undefined>)[em.kind] ??
                em.kind}
            </Text>
            <Text
              style={[styles.embedRowUrl, { color: theme.ink[200] }]}
              numberOfLines={1}
            >
              {em.url}
            </Text>
          </View>
          <TouchableOpacity onPress={() => remove(i)} hitSlop={8}>
            <Text style={[styles.embedRemove, { color: theme.ink[400] }]}>
              {tEmb.remove}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {!atCap ? (
        <View style={styles.tagCustomRow}>
          <TextInput
            style={[
              styles.input,
              {
                flex: 1,
                color: theme.ink[100],
                borderColor: draftError ? '#B8514B' : theme.line.DEFAULT,
                backgroundColor: theme.bg[1],
              },
            ]}
            value={draft}
            onChangeText={(v) => {
              setDraft(v);
              if (draftError) setDraftError(null);
            }}
            placeholder={tEmb.placeholder}
            placeholderTextColor={theme.ink[500]}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            onSubmitEditing={tryAdd}
            returnKeyType="done"
          />
          <TouchableOpacity
            onPress={tryAdd}
            disabled={draft.trim().length === 0}
            activeOpacity={0.85}
            style={[
              styles.tagAddBtn,
              {
                borderColor: theme.line.DEFAULT,
                opacity: draft.trim().length === 0 ? 0.4 : 1,
              },
            ]}
          >
            <Text style={[styles.tagAddBtnText, { color: copper[500] }]}>
              {tEmb.add}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {draftError ? (
        <Text style={[styles.hint, { color: '#B8514B' }]}>{draftError}</Text>
      ) : null}
    </View>
  );
}

/** Defensive read of tags from a stored cardData record. Drops non-strings. */
export function asTags(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const item of v) {
    if (typeof item !== 'string') continue;
    const norm = normalizeTagSlug(item);
    if (norm) out.push(norm);
  }
  // Deduplicate while preserving order.
  return Array.from(new Set(out)).slice(0, MAX_TAGS_PER_CARD);
}

// ---------- M5 — Pro-only sections ----------

export type PasswordState = {
  /** True when the server says a password is currently set. Read-only — the
   *  hash never round-trips, so the form can only set or clear, not display. */
  passwordSet: boolean;
  /** Owner-typed plain string for the next save. Empty = leave unchanged.
   *  Use the explicit `clear` flag to remove the password. */
  newPassword: string;
  clear: boolean;
};

export const DEFAULT_PASSWORD_STATE: PasswordState = {
  passwordSet: false,
  newPassword: '',
  clear: false,
};

export function PasswordSection({
  theme,
  value,
  onChange,
  isPro,
  onProGate,
  labels,
}: {
  theme: ThemeTokens;
  value: PasswordState;
  onChange: (next: PasswordState) => void;
  isPro: boolean;
  onProGate: () => void;
  labels: {
    title: string;
    set: string;
    hint: string;
    placeholder: string;
    clear: string;
  };
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: theme.ink[300] }]}>
        {labels.title}
      </Text>
      <Text style={{ color: theme.ink[400], fontSize: 12 }}>{labels.hint}</Text>
      {value.passwordSet && !value.clear ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 8,
          }}
        >
          <Text style={{ color: theme.ink[200], fontSize: 14 }}>
            🔒 {labels.set}
          </Text>
          <TouchableOpacity
            onPress={() => onChange({ ...value, clear: true })}
            activeOpacity={0.7}
          >
            <Text style={{ color: '#B8514B', fontSize: 13, fontWeight: '600' }}>
              {labels.clear}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <TextInput
        value={value.newPassword}
        onChangeText={(v) => onChange({ ...value, newPassword: v, clear: false })}
        placeholder={labels.placeholder}
        placeholderTextColor={theme.ink[400]}
        secureTextEntry
        editable={isPro}
        onFocus={isPro ? undefined : onProGate}
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          styles.input,
          {
            borderColor: theme.line.DEFAULT,
            backgroundColor: theme.bg[1],
            color: theme.ink[100],
            opacity: isPro ? 1 : 0.5,
          },
        ]}
      />
    </View>
  );
}

export type TipJarState = {
  enabled: boolean;
  label: string;
  stripePriceId: string;
};

export const DEFAULT_TIP_JAR: TipJarState = {
  enabled: false,
  label: '',
  stripePriceId: '',
};

export function TipJarSection({
  theme,
  value,
  onChange,
  isPro,
  onProGate,
  labels,
}: {
  theme: ThemeTokens;
  value: TipJarState;
  onChange: (next: TipJarState) => void;
  isPro: boolean;
  onProGate: () => void;
  labels: {
    title: string;
    enabled: string;
    label: string;
    labelPlaceholder: string;
    priceId: string;
    priceIdHint: string;
  };
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.fieldLabel, { color: theme.ink[300] }]}>
        {labels.title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ color: theme.ink[200], fontSize: 14 }}>
          {labels.enabled}
        </Text>
        <Switch
          value={value.enabled && isPro}
          onValueChange={(v) => {
            if (!isPro) {
              onProGate();
              return;
            }
            onChange({ ...value, enabled: v });
          }}
          trackColor={{ false: theme.bg[2], true: '#C27940' }}
          thumbColor="#fff"
        />
      </View>
      {value.enabled && isPro ? (
        <>
          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, { color: theme.ink[300] }]}>
              {labels.label}
            </Text>
            <TextInput
              value={value.label}
              onChangeText={(v) => onChange({ ...value, label: v })}
              placeholder={labels.labelPlaceholder}
              placeholderTextColor={theme.ink[400]}
              maxLength={60}
              style={[
                styles.input,
                {
                  borderColor: theme.line.DEFAULT,
                  backgroundColor: theme.bg[1],
                  color: theme.ink[100],
                },
              ]}
            />
          </View>
          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, { color: theme.ink[300] }]}>
              {labels.priceId}
            </Text>
            <TextInput
              value={value.stripePriceId}
              onChangeText={(v) => onChange({ ...value, stripePriceId: v.trim() })}
              placeholder="price_…"
              placeholderTextColor={theme.ink[400]}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.input,
                {
                  borderColor: theme.line.DEFAULT,
                  backgroundColor: theme.bg[1],
                  color: theme.ink[100],
                  fontFamily: 'monospace' as never,
                },
              ]}
            />
            <Text style={{ color: theme.ink[400], fontSize: 11 }}>
              {labels.priceIdHint}
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

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
  // Sprint F2 — Events attending chips
  eventChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  eventChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: '100%',
  },
  eventChipText: {
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
  // M1 — ContactFormSection rows
  contactFieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  contactFieldKeyRow: {
    flexDirection: 'row',
    gap: 6,
  },
  contactFieldKeyChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  contactFieldKeyText: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  contactFieldFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  contactFieldRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactFieldRemove: { fontSize: 12, fontWeight: '500' },
  contactAddBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  contactAddBtnText: { fontSize: 13, fontWeight: '600' },
  // M2 — TagsSection chips + custom input
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: '100%',
  },
  tagChipCustom: {
    // Visually identical to selected curated chip; subclass exists in case
    // we want to differentiate later (e.g. show a small "•" prefix).
  },
  tagChipText: {
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
  tagCustomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagAddBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  tagAddBtnText: { fontSize: 13, fontWeight: '600' },
  // M3 — embed row entry style
  embedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  embedRowKind: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  embedRowUrl: { fontSize: 13, marginTop: 2 },
  embedRemove: { fontSize: 12, fontWeight: '600' },
});
