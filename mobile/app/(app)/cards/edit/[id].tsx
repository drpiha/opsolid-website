import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
  type ViewToken,
  type TextInput as RNTextInput,
} from 'react-native';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useToast } from '../../../../src/components/ui/Toast';
import { Check, Eye, EyeOff, X } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { getCard, updateCard, uploadPhoto } from '../../../../src/lib/api/cards';
import { listTemplates, type Template } from '../../../../src/lib/api/templates';
import { updateCardEvents } from '../../../../src/lib/api/events';
import type { ApiCard } from '../../../../src/lib/api/types';
import { API_BASE } from '../../../../src/lib/api/client';
import { useTheme } from '../../../../src/lib/theme/ThemeProvider';
import { copper, teal } from '../../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../../src/lib/i18n/locale';
import { useTemplatePickerStore } from '../../../../src/store/templatePickerStore';
import { useAuthStore } from '../../../../src/lib/auth/store';
import { fetchMe } from '../../../../src/lib/auth/api';
import { PaywallModal } from '../../../../src/components/billing/PaywallModal';
import { useTour } from '../../../../src/components/tour/TourContext';
import { useFirstRunStore } from '../../../../src/store/firstRunStore';
import { SmartSuggestionsSection } from '../../../../src/components/cards/SmartSuggestionsSection';
import type { EnrichmentResult } from '../../../../src/lib/api/enrichment';
import {
  BasicFieldsSection,
  SocialsSection,
  BrandColorsSection,
  VisibilitySection,
  DiscoverySection,
  TemplateSection,
  LayoutSection,
  ThemeSection,
  QrStyleSection,
  ServicesSection,
  CustomButtonsSection,
  FaqsSection,
  StatusBannerSection,
  FeedbackSection,
  EventsAttendingSection,
  ContactFormSection,
  TagsSection,
  EmbedsSection,
  PasswordSection,
  TipJarSection,
  DEFAULT_PASSWORD_STATE,
  DEFAULT_TIP_JAR,
  asEmbeds,
  type EmbedItem,
  type PasswordState,
  type TipJarState,
  asTags,
  DEFAULT_CONTACT_FORM,
  STATUS_BANNER_TONES,
  DEFAULT_PRIMARY_HEX,
  DEFAULT_ACCENT_HEX,
  DEFAULT_STATUS_BANNER,
  stripEmpty,
  cleanServices,
  cleanCustomButtons,
  cleanFaqs,
} from '../../../../src/components/cards/CardFormSections';
import type {
  BasicFieldsState,
  SocialsState,
  Visibility,
  DiscoveryState,
  LayoutKey,
  CardThemeKey,
  QrStylePreset,
  ServiceItem,
  CustomButton,
  FaqItem,
  StatusBannerState,
  StatusBannerTone,
  ContactFormConfig,
} from '../../../../src/components/cards/CardFormSections';

function asString(v: unknown): string {
  return typeof v === 'string' ? v : '';
}
function asBool(v: unknown): boolean {
  return v === true;
}
function asVisibility(v: unknown): Visibility {
  return v === 'private' || v === 'unlisted' ? v : 'public';
}
const LAYOUT_OPTS: readonly LayoutKey[] = ['bento', 'accordion', 'cinema', 'editorial', 'split'];
function asLayout(v: unknown): LayoutKey {
  return typeof v === 'string' && (LAYOUT_OPTS as readonly string[]).includes(v)
    ? (v as LayoutKey)
    : 'bento';
}
const THEME_OPTS: readonly CardThemeKey[] = ['aurora', 'editorial', 'cinema'];
function asThemeKey(v: unknown): CardThemeKey {
  return typeof v === 'string' && (THEME_OPTS as readonly string[]).includes(v)
    ? (v as CardThemeKey)
    : 'aurora';
}
const QR_OPTS: readonly QrStylePreset[] = [
  'classic', 'rounded', 'dots', 'gradient', 'monoNeon', 'watercolor',
];
function asQrPreset(v: unknown): QrStylePreset {
  return typeof v === 'string' && (QR_OPTS as readonly string[]).includes(v)
    ? (v as QrStylePreset)
    : 'classic';
}

function asServices(v: unknown): ServiceItem[] {
  if (!Array.isArray(v)) return [];
  const out: ServiceItem[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') continue;
    const o = raw as Record<string, unknown>;
    // Server shape uses `priceLabel`; tolerate legacy `price` for any rows
    // that may have been saved before the boundary fix landed.
    const priceLabel = typeof o.priceLabel === 'string' ? o.priceLabel
      : typeof o.price === 'string' ? o.price
      : undefined;
    out.push({
      title: typeof o.title === 'string' ? o.title : '',
      description: typeof o.description === 'string' ? o.description : undefined,
      price: priceLabel,
    });
  }
  return out;
}
function asCustomButtons(v: unknown): CustomButton[] {
  if (!Array.isArray(v)) return [];
  const out: CustomButton[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') continue;
    const o = raw as Record<string, unknown>;
    // Server shape uses `href`; tolerate legacy `url`.
    const href = typeof o.href === 'string' ? o.href
      : typeof o.url === 'string' ? o.url
      : '';
    out.push({
      label: typeof o.label === 'string' ? o.label : '',
      url: href,
    });
  }
  return out;
}
function asFaqs(v: unknown): FaqItem[] {
  if (!Array.isArray(v)) return [];
  const out: FaqItem[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') continue;
    const o = raw as Record<string, unknown>;
    // Server shape uses short `q`/`a`; tolerate legacy `question`/`answer`.
    const question = typeof o.q === 'string' ? o.q
      : typeof o.question === 'string' ? o.question
      : '';
    const answer = typeof o.a === 'string' ? o.a
      : typeof o.answer === 'string' ? o.answer
      : '';
    out.push({ question, answer });
  }
  return out;
}
function asContactForm(v: unknown): ContactFormConfig {
  if (!v || typeof v !== 'object') return DEFAULT_CONTACT_FORM;
  const o = v as Record<string, unknown>;
  // Validate every field row's `key` against the closed enum so a malformed
  // server payload can't poison the editor's typed state.
  const allowedKeys = new Set(['name', 'email', 'message']);
  const fields: ContactFormConfig['fields'] = Array.isArray(o.fields)
    ? (o.fields as unknown[]).flatMap((raw) => {
        if (!raw || typeof raw !== 'object') return [];
        const r = raw as Record<string, unknown>;
        const key = typeof r.key === 'string' && allowedKeys.has(r.key)
          ? (r.key as ContactFormConfig['fields'][number]['key'])
          : null;
        if (!key) return [];
        return [
          {
            key,
            label: typeof r.label === 'string' ? r.label : '',
            required: r.required === true,
          },
        ];
      })
    : [];
  return {
    enabled: o.enabled === true,
    fields: fields.length > 0 ? fields : DEFAULT_CONTACT_FORM.fields,
    submitLabel:
      typeof o.submitLabel === 'string' && o.submitLabel.trim().length > 0
        ? o.submitLabel
        : DEFAULT_CONTACT_FORM.submitLabel,
    esps:
      o.esps && typeof o.esps === 'object'
        ? (o.esps as ContactFormConfig['esps'])
        : undefined,
  };
}

function asStatusBanner(v: unknown): StatusBannerState {
  if (!v || typeof v !== 'object') return DEFAULT_STATUS_BANNER;
  const o = v as Record<string, unknown>;
  const toneRaw = typeof o.tone === 'string' ? o.tone : 'info';
  const tone: StatusBannerTone = (STATUS_BANNER_TONES as readonly string[]).includes(toneRaw)
    ? (toneRaw as StatusBannerTone)
    : 'info';
  return {
    enabled: o.enabled === true,
    text: typeof o.text === 'string' ? o.text.slice(0, 200) : '',
    tone,
  };
}

// Sprint 6 — three-tab segmented control replaces the flat 14-section scroll.
// Tab partition is rendering-only: handleSave() still collects every field
// regardless of which tab is currently active.
type Tab = 'profil' | 'tasarim' | 'gelismis';

export default function CardEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const tAll = useTranslations(detectLocale());
  const t = tAll.cards;
  const tProSection = tAll.pro;
  const authUser = useAuthStore((s) => s.user);
  const setAuthUser = useAuthStore((s) => s.setUser);
  const isProUser = Boolean(authUser?.isPro);
  const { showToast } = useToast();

  const [card, setCard] = useState<ApiCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('profil');
  const [previewVisible, setPreviewVisible] = useState(false);

  // -----------------------------------------------------------------
  // Inline template picker — replaces router.push to template-preview.
  // Presenting the picker as a modal WITHIN the edit screen avoids the
  // Expo Router Tabs limitation where router.back() from a child-tab
  // route returns to the tab index rather than the originating screen.
  // Form state is fully preserved because the edit screen never unmounts.
  // -----------------------------------------------------------------
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [templatePickerItems, setTemplatePickerItems] = useState<Template[] | null>(null);
  const [templatePickerActiveIdx, setTemplatePickerActiveIdx] = useState(0);
  const templatePickerListRef = useRef<FlatList<Template>>(null);
  const templatePickerViewability = useRef({ itemVisiblePercentThreshold: 60 });
  const onTemplatePickerViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (typeof first?.index === 'number') {
        setTemplatePickerActiveIdx(first.index);
      }
    },
  );

  const [basics, setBasics] = useState<BasicFieldsState>({
    name: '', jobTitle: '', position: '', company: '', email: '',
    phone: '', whatsapp: '', website: '', address: '', bio: '',
  });
  const [socials, setSocials] = useState<SocialsState>({
    linkedin: '', instagram: '', x: '', tiktok: '',
    youtube: '', github: '', facebook: '', xing: '',
  });
  const [primaryHex, setPrimaryHex] = useState(DEFAULT_PRIMARY_HEX);
  const [accentHex, setAccentHex] = useState(DEFAULT_ACCENT_HEX);
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [discovery, setDiscovery] = useState<DiscoveryState>({
    openToNetworking: false, acceptingClients: false,
    industry: '', city: '', country: '',
  });
  const [templateId, setTemplateId] = useState<number>(1);
  const [layoutKey, setLayoutKey] = useState<LayoutKey>('bento');
  const [themeKey, setThemeKey] = useState<CardThemeKey>('aurora');
  const [qrPreset, setQrPreset] = useState<QrStylePreset>('classic');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [customButtons, setCustomButtons] = useState<CustomButton[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [statusBanner, setStatusBanner] = useState<StatusBannerState>(
    DEFAULT_STATUS_BANNER,
  );
  const [contactForm, setContactForm] = useState<ContactFormConfig>(
    DEFAULT_CONTACT_FORM,
  );
  const [feedbackEnabled, setFeedbackEnabled] = useState<boolean>(false);
  // M2 — sector / topic tags. Capped at 5 in TagsSection. Persists into
  // cardData.tags on save; round-trips through the existing PATCH.
  const [tags, setTags] = useState<string[]>([]);
  // M3 — curated embed whitelist (Carrd amendment). Up to 3 entries persisted
  // to cardData.embeds. Public viewer renders these as tappable thumbnails on
  // mobile and as sandboxed iframes on web.
  const [embeds, setEmbeds] = useState<EmbedItem[]>([]);
  // Sprint F2 — events the card is attending. Mirrors `attendingEventIds` from
  // the owner GET. Saved via a separate POST after the main PATCH (see
  // handleSave). Track the originally-loaded set so we only fire the events
  // POST when the chip selection has actually changed.
  const [attendingEventIds, setAttendingEventIds] = useState<string[]>([]);
  const [originalEventIds, setOriginalEventIds] = useState<string[]>([]);

  // M5 — password protection + tip jar (Pro-only). Hydrated from
  // `cardData.passwordSet` (the server-redacted boolean) and
  // `cardData.tipJar`. Saves are intercepted in handleSave to drop password
  // when unchanged so the existing hash is preserved.
  const [passwordState, setPasswordState] = useState<PasswordState>(
    DEFAULT_PASSWORD_STATE,
  );
  const [tipJar, setTipJar] = useState<TipJarState>(DEFAULT_TIP_JAR);
  const [paywallReason, setPaywallReason] = useState<
    'password_protection' | 'tip_jar' | null
  >(null);

  const [photoPath, setPhotoPath] = useState<string | null>(null);

  // -----------------------------------------------------------------
  // Live preview — debounced URL that updates without a save round-trip.
  //
  // `debouncedPreviewUrl` is what the WebView actually loads. We compute
  // the instant URL from state on every render; a useEffect debounces the
  // write to `debouncedPreviewUrl` so the WebView only reloads after the
  // user stops typing (500 ms for text, 200 ms for picker/toggle changes).
  //
  // Design changes (layout/theme/brand colors) use a tighter 200 ms window
  // so the picker feels snappy. We track "design-only" vs "any" changes
  // with a separate ref — keeping a single debounce avoids double-load.
  // -----------------------------------------------------------------
  const [debouncedPreviewUrl, setDebouncedPreviewUrl] = useState<string | null>(null);
  // Counter incremented on any picker change (layout / theme / colors). A
  // separate counter for text edits. Both gate the debounce delay.
  const previewDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -----------------------------------------------------------------
  // M7 Wave 2 — Tour B coaching marks. Refs anchor the spotlight to
  // the tab strip, the eye/preview FAB, and the save button. The
  // scrollRef lets the controller scroll the active tab so the target
  // is on-screen before measuring (the save button lives in the
  // header, the FAB in an absolute layer — both above the scroll
  // root, so they don't strictly need scroll-to but the eye FAB sits
  // on the Tasarim tab, which we switch to inline).
  // -----------------------------------------------------------------
  const editTabsRef = useRef<View>(null);
  const eyeButtonRef = useRef<View>(null);
  const saveButtonRef = useRef<View>(null);

  // SmartSuggestions plumbing — we need to focus the bio TextInput,
  // and scroll the Profil ScrollView to specific sub-sections.
  const profilScrollRef = useRef<ScrollView>(null);
  const photoSectionRef = useRef<View>(null);
  const socialsSectionRef = useRef<View>(null);
  const bioInputRef = useRef<RNTextInput>(null);

  const { startTour } = useTour();
  const seenTours = useFirstRunStore((s) => s.seenTours);

  // SmartSuggestions — section y-offsets captured via onLayout so we can
  // scroll the Profil ScrollView to the right anchor when a CTA fires.
  const [photoSectionY, setPhotoSectionY] = useState(0);
  const [socialsSectionY, setSocialsSectionY] = useState(0);

  function setBasic<K extends keyof BasicFieldsState>(k: K, v: BasicFieldsState[K]) {
    setBasics((s) => ({ ...s, [k]: v }));
  }
  function setSocial<K extends keyof SocialsState>(k: K, v: SocialsState[K]) {
    setSocials((s) => ({ ...s, [k]: v }));
  }
  function setDiscoveryField<K extends keyof DiscoveryState>(k: K, v: DiscoveryState[K]) {
    setDiscovery((s) => ({ ...s, [k]: v }));
  }

  // -----------------------------------------------------------------
  // Inline template picker data loading. Fires once on first open.
  // Subsequent opens reuse the cached items; the effect is gated on
  // `templatePickerOpen` so we don't load until the user actually
  // opens the picker.
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!templatePickerOpen) return;
    if (templatePickerItems !== null) return; // already loaded
    let cancelled = false;
    void listTemplates()
      .then((res) => {
        if (!cancelled) setTemplatePickerItems(res.items);
      })
      .catch(() => {
        if (!cancelled) setTemplatePickerItems([]); // show empty, not loading spinner
      });
    return () => {
      cancelled = true;
    };
  }, [templatePickerOpen, templatePickerItems]);

  // Show all templates — sector filter chip strip was removed per UX feedback.
  const templatePickerFiltered = useMemo(() => {
    if (!templatePickerItems) return [] as Template[];
    return templatePickerItems;
  }, [templatePickerItems]);

  // When the filtered list changes, find the currently selected template's
  // index and jump the carousel to it.
  useEffect(() => {
    if (!templatePickerFiltered.length) return;
    const idx = templatePickerFiltered.findIndex((it) => it.id === templateId);
    const target = idx >= 0 ? idx : 0;
    setTemplatePickerActiveIdx(target);
    setTimeout(() => {
      templatePickerListRef.current?.scrollToIndex({ index: target, animated: false });
    }, 50);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templatePickerFiltered]);

  const templatePickerCurrent = templatePickerFiltered[templatePickerActiveIdx];

  function openTemplatePicker(/* tplId unused — we open at current selection */) {
    setTemplatePickerOpen(true);
  }

  function applyTemplatePicker() {
    if (templatePickerCurrent) {
      setTemplateId(templatePickerCurrent.id);
    }
    setTemplatePickerOpen(false);
  }

  // -----------------------------------------------------------------
  // SmartSuggestions handlers — each scrolls/focuses to the relevant
  // form section. `onAddBio` reuses the photo anchor (BasicFields lives
  // immediately below) and just nudges the user to that area; the bio
  // field is the last input in the BasicFields list.
  // -----------------------------------------------------------------
  const handleSuggestPhoto = useCallback(() => {
    setActiveTab('profil');
    profilScrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const handleSuggestBio = useCallback(() => {
    setActiveTab('profil');
    // Scroll roughly to the bottom of the BasicFields block — bio is the
    // last entry and the section starts right after the photo wrap.
    profilScrollRef.current?.scrollTo({
      y: Math.max(photoSectionY + 80, 200),
      animated: true,
    });
    // Best-effort focus; fires after the scroll has had a chance to land.
    setTimeout(() => bioInputRef.current?.focus(), 350);
  }, [photoSectionY]);

  const handleSuggestServices = useCallback(() => {
    setActiveTab('profil');
    // Services lives below the Socials block on the Profil tab; scroll
    // far enough to reveal it without overshooting on shorter cards.
    profilScrollRef.current?.scrollTo({
      y: socialsSectionY + 600,
      animated: true,
    });
  }, [socialsSectionY]);

  const handleSuggestSocial = useCallback(() => {
    setActiveTab('profil');
    profilScrollRef.current?.scrollTo({
      y: Math.max(socialsSectionY - 20, 0),
      animated: true,
    });
  }, [socialsSectionY]);

  const handleSuggestSector = useCallback(() => {
    // Tags + Discovery both live on the Advanced tab.
    setActiveTab('gelismis');
  }, []);

  // -----------------------------------------------------------------
  // Paste-URL enrichment apply — patches the form fields in place.
  // GitHub / YouTube map directly to the matching social slot; OG and
  // oEmbed offer displayName + bio without choosing a social slot
  // (we don't know which one the URL belongs to).
  // -----------------------------------------------------------------
  const handleApplyEnrichment = useCallback(
    (result: EnrichmentResult, url: string) => {
      if (result.source === 'github') {
        setSocials((s) => ({ ...s, github: url }));
      } else if (result.source === 'youtube') {
        setSocials((s) => ({ ...s, youtube: url }));
      }
      setBasics((b) => ({
        ...b,
        name: b.name.trim() === '' && result.displayName ? result.displayName : b.name,
        bio: b.bio.trim() === '' && result.bio ? result.bio : b.bio,
      }));
      // If there's no card photo yet and the source returned an avatar, use it.
      if (result.avatarUrl) {
        setPhotoPath((cur) => (cur ? cur : (result.avatarUrl ?? null)));
      }
    },
    [],
  );

  // Read any picked template id pushed by the modal preview screen and apply
  // it on focus. `consume()` is one-shot — clears the atom so navigating away
  // and back doesn't re-apply the same id.
  useFocusEffect(
    useCallback(() => {
      const picked = useTemplatePickerStore.getState().consume();
      if (picked != null) setTemplateId(picked);
    }, []),
  );

  // -----------------------------------------------------------------
  // Tour B — first-time edit-screen coaching marks. Fires once after
  // the card data has loaded (so the Profil tab has fully laid out
  // and the tab strip is measurable). The 600ms delay lets the
  // navigation animation settle before measureInWindow runs.
  //
  // Step 2's `action` switches to Tasarim and opens the live preview
  // sheet — the eye-FAB only mounts on Tasarim, so we always switch
  // tabs before measuring it.
  // -----------------------------------------------------------------
  useFocusEffect(
    useCallback(() => {
      if (!card) return;
      if (seenTours['edit-screen']) return;

      const timer = setTimeout(() => {
        startTour({
          tourId: 'edit-screen',
          steps: [
            {
              key: 'B-1',
              targetRef: editTabsRef,
              title: tAll.tour.editScreenTitle1,
              body: tAll.tour.editScreenBody1,
              ctaLabel: tAll.tour.next,
            },
            {
              key: 'B-2',
              targetRef: eyeButtonRef,
              title: tAll.tour.editScreenTitle2,
              body: tAll.tour.editScreenBody2,
              ctaLabel: tAll.tour.editScreenCta2,
              action: async () => {
                setActiveTab('tasarim');
                // Wait one paint so the FAB mounts before the
                // controller measures it on the next step.
                await new Promise((r) => setTimeout(r, 100));
                setPreviewVisible(true);
              },
            },
            {
              key: 'B-3',
              targetRef: saveButtonRef,
              title: tAll.tour.editScreenTitle3,
              body: tAll.tour.editScreenBody3,
              ctaLabel: tAll.tour.done,
            },
          ],
        });
      }, 600);

      return () => clearTimeout(timer);
      // We intentionally re-run only when `card` flips from null → loaded.
      // The other deps are stable refs from outer scope.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [card]),
  );

  useEffect(() => {
    if (!id) return;
    void getCard(id)
      .then((c) => {
        setCard(c);
        const cd = c.cardData ?? {};
        setBasics({
          name: asString(cd.name),
          jobTitle: asString(cd.title),
          position: asString(cd.position),
          company: asString(cd.company),
          email: asString(cd.email),
          phone: asString(cd.phone),
          whatsapp: asString(cd.whatsapp),
          website: asString(cd.website),
          address: asString(cd.address),
          bio: asString(cd.bio),
        });
        const cdSocials = (cd.socials ?? {}) as Record<string, unknown>;
        setSocials({
          linkedin: asString(cdSocials.linkedin),
          instagram: asString(cdSocials.instagram),
          x: asString(cdSocials.x),
          tiktok: asString(cdSocials.tiktok),
          youtube: asString(cdSocials.youtube),
          github: asString(cdSocials.github),
          facebook: asString(cdSocials.facebook),
          xing: asString(cdSocials.xing),
        });
        // Brand colors live both at top level (CardOrder cols) and inside cardData.
        // Prefer top-level since the API returns them there explicitly.
        setPrimaryHex(c.brandPrimaryHex || asString(cd.brandPrimaryHex) || DEFAULT_PRIMARY_HEX);
        setAccentHex(c.brandAccentHex || asString(cd.brandAccentHex) || DEFAULT_ACCENT_HEX);
        setVisibility(asVisibility(cd.visibility));
        setDiscovery({
          openToNetworking: asBool(cd.openToNetworking),
          acceptingClients: asBool(cd.acceptingClients),
          industry: asString(cd.industry),
          city: asString(cd.city),
          country: asString(cd.country),
        });
        setPhotoPath(c.photoPath ?? null);
        // Template / layout / theme / qrStyle hydration. layoutKey + themeKey
        // live on top-level columns; qrStyle is a JSON column.
        setTemplateId(typeof c.templateId === 'number' ? c.templateId : 1);
        setLayoutKey(asLayout(c.layoutKey ?? cd.layoutKey));
        setThemeKey(asThemeKey(c.themeKey ?? cd.themeKey));
        const qr = (c.qrStyle ?? {}) as Record<string, unknown>;
        setQrPreset(asQrPreset(qr.preset));
        setServices(asServices(cd.services));
        setCustomButtons(asCustomButtons(cd.customButtons));
        setFaqs(asFaqs(cd.faqs));
        setStatusBanner(asStatusBanner(cd.statusBanner));
        setContactForm(asContactForm(cd.contactForm));
        setTags(asTags(cd.tags));
        setEmbeds(asEmbeds(cd.embeds));
        // feedbackEnabled lives on top-level CardOrder column (Phase 8.4),
        // exposed on owner GET /api/v1/cards/:id (CARD_API_SELECT).
        setFeedbackEnabled(c.feedbackEnabled === true);
        // Sprint F2 — attendingEventIds is exposed on owner GET via
        // CARD_API_SELECT.attendingEvents → toApiCard flattens to ids.
        const initialEventIds = Array.isArray(c.attendingEventIds)
          ? c.attendingEventIds
          : [];
        setAttendingEventIds(initialEventIds);
        setOriginalEventIds(initialEventIds);

        // M5 — passwordSet is the redacted boolean the server emits on owner
        // GET (the actual hash never round-trips). tipJar is a structured
        // object with an `enabled` flag.
        setPasswordState({
          passwordSet: (cd as Record<string, unknown>).passwordSet === true,
          newPassword: '',
          clear: false,
        });
        const tj = (cd as Record<string, unknown>).tipJar as
          | { enabled?: boolean; label?: string; stripePriceId?: string | null }
          | undefined;
        setTipJar({
          enabled: tj?.enabled === true,
          label: typeof tj?.label === 'string' ? tj.label : '',
          stripePriceId:
            typeof tj?.stripePriceId === 'string' ? tj.stripePriceId : '',
        });
      })
      .catch(() => Alert.alert('', t.errorLoad))
      .finally(() => setLoading(false));
  }, [id, t.errorLoad]);

  async function pickPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    // allowsEditing: true triggers expo-image-picker v17's native CropImage
    // contract, which throws `IllegalArgumentException: Required value was
    // null` when the crop activity returns no result (Android cancel paths,
    // certain OEM crop apps). FATAL crash, not a JS-catchable error. Skip
    // the native crop. JS cropper / pinch-to-zoom can come later if needed.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setUploadingPhoto(true);
    try {
      const path = await uploadPhoto(asset.uri, asset.mimeType ?? 'image/jpeg');
      setPhotoPath(path);
    } catch (err) {
      const isAuth = err instanceof Error && err.message === 'UNAUTHORIZED';
      Alert.alert(
        isAuth ? 'Session expired' : 'Upload failed',
        isAuth
          ? 'Please sign in again to upload photos.'
          : 'Could not upload photo. Try again.',
      );
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSave() {
    if (!id || !basics.name.trim()) return;
    setSaving(true);
    try {
      const socialsClean = stripEmpty(socials);
      const cardData: Record<string, unknown> = {
        name: basics.name.trim(),
        title: basics.jobTitle.trim() || undefined,
        position: basics.position.trim() || undefined,
        company: basics.company.trim() || undefined,
        email: basics.email.trim() || undefined,
        phone: basics.phone.trim() || undefined,
        whatsapp: basics.whatsapp.trim() || undefined,
        website: basics.website.trim() || undefined,
        address: basics.address.trim() || undefined,
        bio: basics.bio.trim() || undefined,
        brandPrimaryHex: primaryHex,
        brandAccentHex: accentHex,
        visibility,
        openToNetworking: discovery.openToNetworking,
        acceptingClients: discovery.acceptingClients,
        industry: discovery.industry.trim() || undefined,
        city: discovery.city.trim() || undefined,
        country: discovery.country.trim() || undefined,
      };
      if (Object.keys(socialsClean).length > 0) {
        cardData.socials = socialsClean;
      }
      const servicesClean = cleanServices(services);
      if (servicesClean.length > 0) cardData.services = servicesClean;
      const buttonsClean = cleanCustomButtons(customButtons);
      if (buttonsClean.length > 0) cardData.customButtons = buttonsClean;
      const faqsClean = cleanFaqs(faqs);
      if (faqsClean.length > 0) cardData.faqs = faqsClean;
      // Status banner — always persist (even when disabled, so toggling off
      // round-trips to the server and clears the public viewer banner).
      cardData.statusBanner = {
        enabled: statusBanner.enabled,
        text: statusBanner.text.trim(),
        tone: statusBanner.tone,
      };
      // M2 — Sector / topic tags. Persist when non-empty; omit otherwise so
      // a card without tags doesn't carry an empty array on the wire.
      if (tags.length > 0) {
        cardData.tags = tags;
      }
      // M3 — Curated embeds. Persist when non-empty.
      if (embeds.length > 0) {
        cardData.embeds = embeds;
      }
      // M1 — Form-builder-lite. Persist the contactForm config when the
      // owner has either turned it on or made any non-default changes.
      // Same round-trip pattern as statusBanner so toggling off propagates
      // back to the public viewer.
      if (contactForm.enabled || contactForm.fields !== DEFAULT_CONTACT_FORM.fields) {
        // Drop any empty ESP sub-objects so we don't ship "{ esps: { mailchimp: { listId: '', ... } } }".
        const esps = contactForm.esps
          ? Object.fromEntries(
              Object.entries(contactForm.esps).filter(([, v]) => {
                if (!v || typeof v !== 'object') return false;
                return Object.values(v).some(
                  (val) => typeof val === 'string' && val.trim() !== '',
                );
              }),
            )
          : {};
        cardData.contactForm = {
          enabled: contactForm.enabled,
          fields: contactForm.fields,
          submitLabel: contactForm.submitLabel,
          ...(Object.keys(esps).length > 0 ? { esps } : {}),
        };
      }
      // M5 — password protection. The server expects:
      //  - field omitted entirely → keep existing hash
      //  - "" or null              → clear existing hash
      //  - non-empty string         → server hashes + stores
      // We never send the existing hash back (we don't have it client-side).
      if (passwordState.clear) {
        cardData.password = "";
      } else if (passwordState.newPassword.length >= 4) {
        cardData.password = passwordState.newPassword;
      }
      // M5 — tip jar. Always persist when enabled; on disable we round-trip
      // the off state so the public viewer hides the button.
      if (tipJar.enabled) {
        cardData.tipJar = {
          enabled: true,
          label: tipJar.label.trim() || 'Tip',
          stripePriceId: tipJar.stripePriceId.trim() || null,
        };
      } else {
        cardData.tipJar = { enabled: false, label: tipJar.label.trim(), stripePriceId: null };
      }

      Object.keys(cardData).forEach((k) => {
        if (cardData[k] === undefined) delete cardData[k];
      });

      // Preserve any qrStyle subfields (colors, AI metadata) that the server
      // already has — we only override `preset`. The rest is spread from the
      // last-loaded card.
      const existingQr = (card?.qrStyle ?? {}) as Record<string, unknown>;
      const qrStyle = { ...existingQr, preset: qrPreset } as import('../../../../src/lib/api/types').QrStylePatch;

      await updateCard(id, {
        // Server accepts arbitrary keys; CardPatchInput is intentionally narrow.
        cardData: cardData as unknown as { name?: string },
        photoPath: photoPath,
        templateId,
        layoutKey,
        themeKey,
        // Brand colors MUST be sent as top-level PATCH fields so the server
        // writes them to the CardOrder.brandPrimaryHex / brandAccentHex columns.
        // The public /c/[slug] page reads those columns — NOT cardData — so
        // sending them only inside cardData left colors stale after every save.
        brandPrimaryHex: primaryHex,
        brandAccentHex: accentHex,
        qrStyle,
        feedbackEnabled,
      });

      // Sprint F2 — sync event attendance via the dedicated POST endpoint,
      // but only when the chip selection actually changed. We compare sorted
      // arrays so order-only diffs (which are meaningless) don't trigger a
      // network round-trip.
      const a = [...attendingEventIds].sort();
      const b = [...originalEventIds].sort();
      const changed = a.length !== b.length || a.some((v, i) => v !== b[i]);
      if (changed) {
        try {
          await updateCardEvents(id, attendingEventIds);
          setOriginalEventIds(attendingEventIds);
        } catch (eventsErr) {
          // Card itself saved; surface a softer warning so the user knows
          // the events update needs a retry.
          console.warn('[cards/edit] events update failed:', eventsErr);
        }
      }

      // Stay on the edit screen after save — user wants to keep iterating
      // (tweak fields, glance at the live preview, save again) without
      // bouncing back to the cards list each time. The toast confirms the
      // save; an explicit "Done" tap or system back exits the screen.
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast({ message: t.saveSuccess, variant: 'success' });
    } catch {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showToast({ message: t.errorSave, variant: 'error' });
    } finally {
      setSaving(false);
    }
  }

  // -----------------------------------------------------------------
  // Debounced preview URL — updated after user pauses input.
  //
  // Design knobs (layout/theme/colors) trigger a 300ms debounce so
  // picker changes feel snappy. Text fields (name/title/company/bio) use
  // 500ms to avoid reloads on every keystroke.
  //
  // The server reads ?preview=1 overrides for design knobs AND for the 4
  // highest-value text fields. Other fields (services, socials, faqs, …)
  // reflect only after Save — the URL would become too long otherwise.
  //
  // We detect whether only text changed vs design changed by comparing
  // a "design signature" ref so we can apply the right debounce delay.
  // -----------------------------------------------------------------
  const prevDesignSig = useRef('');
  useEffect(() => {
    const slug = card?.slug ?? '';
    if (!slug) return;

    const designSig = `${layoutKey}|${themeKey}|${qrPreset}|${primaryHex}|${accentHex}`;
    const designChanged = designSig !== prevDesignSig.current;
    prevDesignSig.current = designSig;

    // Build the URL with both design + text overrides. Empty strings are
    // omitted so the server uses the saved value as fallback.
    const qs = new URLSearchParams();
    qs.set('preview', '1');
    qs.set('layout', layoutKey);
    qs.set('theme', themeKey);
    qs.set('qr', qrPreset);
    qs.set('primary', primaryHex);
    qs.set('accent', accentHex);
    if (basics.name.trim())     qs.set('name',    basics.name.trim());
    if (basics.jobTitle.trim()) qs.set('title',   basics.jobTitle.trim());
    if (basics.company.trim())  qs.set('company', basics.company.trim());
    if (basics.bio.trim())      qs.set('bio',     basics.bio.trim());

    const url = `${API_BASE}/c/${encodeURIComponent(slug)}?${qs.toString()}`;

    const delay = designChanged ? 300 : 500;
    if (previewDebounceRef.current) clearTimeout(previewDebounceRef.current);
    previewDebounceRef.current = setTimeout(() => {
      setDebouncedPreviewUrl(url);
    }, delay);

    return () => {
      if (previewDebounceRef.current) clearTimeout(previewDebounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutKey, themeKey, qrPreset, primaryHex, accentHex,
      basics.name, basics.jobTitle, basics.company, basics.bio, card?.slug]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg[0] }]}>
        <ActivityIndicator size="large" color={copper[500]} />
      </View>
    );
  }

  const photoUri = photoPath
    ? photoPath.startsWith('http')
      ? photoPath
      : `${API_BASE}${photoPath}`
    : null;

  // The slug-based preview URL. Only available once a card has been
  // published at least once (slug is non-null). When no slug, we can't
  // show a web preview (no public URL to load).
  const hasPreview = !!(card?.slug && debouncedPreviewUrl);

  // Tab is rendered above the scroll, scroll is per-tab so each tab can be
  // scrolled independently (returning to "Profil" doesn't reset "Tasarim"'s
  // scroll position because they're separate ScrollView mounts).
  const tabs: { key: Tab; label: string }[] = [
    { key: 'profil', label: t.tabProfile },
    { key: 'tasarim', label: t.tabDesign },
    { key: 'gelismis', label: t.tabAdvanced },
  ];

  // Screen height split: when preview is open, form area shrinks to 52%
  // and preview pane takes 44% (remaining 4% is the preview header bar).
  const screenH = Dimensions.get('window').height;
  const formFlex = previewVisible ? 0.52 : 1;

  return (
    <>
      <Stack.Screen
        options={{
          title: t.editTitle,
          headerStyle: { backgroundColor: theme.bg[0] },
          headerTintColor: theme.ink[100],
          headerRight: () => (
            <View ref={saveButtonRef} collapsable={false}>
              <TouchableOpacity onPress={() => void handleSave()} disabled={saving} style={styles.saveBtn}>
                {saving
                  ? <ActivityIndicator size="small" color={copper[500]} />
                  : <Text style={[styles.saveBtnText, { color: copper[500] }]}>{t.save}</Text>
                }
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.bg[0] }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        {/* Tab bar + preview toggle. The Eye button lives here so it's
            reachable from all three tabs — the user doesn't need to switch
            to Tasarim to open the preview. Hidden when the card has no slug
            yet (unpublished draft with no public URL). */}
        <View
          ref={editTabsRef}
          collapsable={false}
          style={[styles.tabBar, { backgroundColor: theme.bg[1], borderBottomColor: theme.line.DEFAULT }]}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tabPill,
                  active && { borderBottomColor: teal[500] },
                ]}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: active ? teal[500] : theme.ink[400] },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Preview toggle — always visible when a slug exists. Shows EyeOff
              when preview is already open so the user knows tapping closes it. */}
          {hasPreview || card?.slug ? (
            <View
              ref={eyeButtonRef}
              collapsable={false}
              style={styles.previewToggleWrap}
            >
              <TouchableOpacity
                style={[
                  styles.previewToggleBtn,
                  {
                    backgroundColor: previewVisible ? teal[500] : theme.bg[2],
                    borderColor: previewVisible ? teal[500] : theme.line.DEFAULT,
                  },
                ]}
                onPress={() => setPreviewVisible((v) => !v)}
                activeOpacity={0.85}
                accessibilityLabel={previewVisible ? 'Önizlemeyi kapat' : t.preview}
              >
                {previewVisible
                  ? <EyeOff size={16} color="#FFFFFF" strokeWidth={2.2} />
                  : <Eye size={16} color={teal[500]} strokeWidth={2.2} />
                }
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Form area — shrinks when preview pane is open. */}
        <View style={{ flex: formFlex }}>
          {activeTab === 'profil' && (
            <ScrollView
              key="profil"
              ref={profilScrollRef}
              style={{ backgroundColor: theme.bg[0], flex: 1 }}
              contentContainerStyle={[styles.scroll, previewVisible && styles.scrollCompact]}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              automaticallyAdjustKeyboardInsets
            >
              {/* Photo */}
              <View
                ref={photoSectionRef}
                collapsable={false}
                onLayout={(e) => setPhotoSectionY(e.nativeEvent.layout.y)}
              >
                <TouchableOpacity
                  onPress={() => void pickPhoto()}
                  disabled={uploadingPhoto}
                  style={[styles.photoWrap, { borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[1] }]}
                >
                  {uploadingPhoto ? (
                    <ActivityIndicator color={copper[500]} />
                  ) : photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.photo} />
                  ) : (
                    <Text style={[styles.photoPlaceholder, { color: theme.ink[400] }]}>
                      {t.addPhoto}
                    </Text>
                  )}
                  {photoUri && !uploadingPhoto && (
                    <View style={styles.photoEditBadge}>
                      <Text style={styles.photoEditBadgeText}>{t.changePhoto}</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* M7 Wave 2 — "Use Google photo" one-tap. The OIDC payload
                    surfaces the user's Google avatar URL on `auth.user.image`.
                    We accept it as an external URL directly (server validation
                    permits any string up to 500 chars in `photoPath`). */}
                {authUser?.image && !photoPath ? (
                  <TouchableOpacity
                    onPress={() => setPhotoPath(authUser.image ?? null)}
                    activeOpacity={0.85}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                      gap: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderRadius: 8,
                      backgroundColor: theme.bg[2],
                      borderWidth: 1,
                      borderColor: theme.line.DEFAULT,
                      marginTop: 8,
                    }}
                  >
                    <Image
                      source={{ uri: authUser.image }}
                      style={{ width: 24, height: 24, borderRadius: 12 }}
                    />
                    <Text style={{ fontSize: 13, color: theme.ink[200] }}>
                      {t.useGooglePhoto}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <BasicFieldsSection
                theme={theme}
                values={basics}
                onChange={setBasic}
                bioInputRef={bioInputRef}
              />
              <View
                ref={socialsSectionRef}
                collapsable={false}
                onLayout={(e) => setSocialsSectionY(e.nativeEvent.layout.y)}
              >
                <SocialsSection
                  theme={theme}
                  values={socials}
                  onChange={setSocial}
                  onApplyEnrichment={handleApplyEnrichment}
                />
              </View>
              <ServicesSection theme={theme} items={services} onChange={setServices} />
              <CustomButtonsSection theme={theme} items={customButtons} onChange={setCustomButtons} />
              <FaqsSection theme={theme} items={faqs} onChange={setFaqs} />

              {card ? (
                <SmartSuggestionsSection
                  theme={theme}
                  card={card}
                  hasPhoto={!!photoPath}
                  bio={basics.bio}
                  servicesCount={services.length}
                  socialsFilledCount={
                    Object.values(socials).filter((v) => v.trim() !== '').length
                  }
                  tagsCount={tags.length}
                  onAddPhoto={handleSuggestPhoto}
                  onAddBio={handleSuggestBio}
                  onAddServices={handleSuggestServices}
                  onAddSocial={handleSuggestSocial}
                  onSetSector={handleSuggestSector}
                />
              ) : null}
            </ScrollView>
          )}

          {activeTab === 'tasarim' && (
            <ScrollView
              key="tasarim"
              style={{ backgroundColor: theme.bg[0], flex: 1 }}
              contentContainerStyle={[styles.scroll, previewVisible && styles.scrollCompact]}
              keyboardShouldPersistTaps="handled"
            >
              <TemplateSection
                theme={theme}
                value={templateId}
                onChange={setTemplateId}
                onPreviewRequest={() => {
                  // Open the inline template picker modal — avoids the Expo Router
                  // Tabs back-navigation bug where router.back() from a sibling
                  // Tabs.Screen returns to the tab index instead of this screen.
                  openTemplatePicker();
                }}
              />
              <LayoutSection theme={theme} value={layoutKey} onChange={setLayoutKey} />
              <ThemeSection theme={theme} value={themeKey} onChange={setThemeKey} />
              <BrandColorsSection
                theme={theme}
                primaryHex={primaryHex}
                accentHex={accentHex}
                onPrimaryChange={setPrimaryHex}
                onAccentChange={setAccentHex}
              />
              <QrStyleSection theme={theme} value={qrPreset} onChange={setQrPreset} />
            </ScrollView>
          )}

          {activeTab === 'gelismis' && (
            <ScrollView
              key="gelismis"
              style={{ backgroundColor: theme.bg[0], flex: 1 }}
              contentContainerStyle={[styles.scroll, previewVisible && styles.scrollCompact]}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              automaticallyAdjustKeyboardInsets
            >
              <StatusBannerSection theme={theme} value={statusBanner} onChange={setStatusBanner} />
              <ContactFormSection theme={theme} value={contactForm} onChange={setContactForm} />
              <TagsSection theme={theme} selected={tags} onChange={setTags} />
              <EmbedsSection theme={theme} value={embeds} onChange={setEmbeds} />
              <FeedbackSection theme={theme} value={feedbackEnabled} onChange={setFeedbackEnabled} />
              <EventsAttendingSection
                theme={theme}
                selectedIds={attendingEventIds}
                onChange={setAttendingEventIds}
              />
              <VisibilitySection theme={theme} value={visibility} onChange={setVisibility} />
              <DiscoverySection theme={theme} values={discovery} onChange={setDiscoveryField} />

              {/* M5 — Pro features (password + tip jar). Sections render for
                  all users; the toggles are gated on isPro and open the
                  paywall on tap when the user isn't a Pro subscriber. */}
              <PasswordSection
                theme={theme}
                value={passwordState}
                onChange={setPasswordState}
                isPro={isProUser}
                onProGate={() => setPaywallReason('password_protection')}
                labels={{
                  title: tProSection.passwordSection,
                  set: tProSection.passwordSet,
                  hint: tProSection.passwordHint,
                  placeholder: tProSection.passwordPlaceholder,
                  clear: tProSection.passwordClear,
                }}
              />
              <TipJarSection
                theme={theme}
                value={tipJar}
                onChange={setTipJar}
                isPro={isProUser}
                onProGate={() => setPaywallReason('tip_jar')}
                labels={{
                  title: tProSection.tipJarSection,
                  enabled: tProSection.tipJarEnabled,
                  label: tProSection.tipJarLabel,
                  labelPlaceholder: tProSection.tipJarLabelPlaceholder,
                  priceId: tProSection.tipJarPriceId,
                  priceIdHint: tProSection.tipJarPriceIdHint,
                }}
              />

              {/* Status (only for published cards) */}
              {card?.status === 'PUBLISHED' && (
                <View style={[styles.statusRow, { borderColor: theme.line.DEFAULT }]}>
                  <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>Status</Text>
                  <Text style={{ color: '#7FB286', fontSize: 14, fontWeight: '600' }}>
                    {t.status.PUBLISHED}
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>

        {/* Live preview pane — persistent split below the form when open.
            Updates debounced ~300ms after any input change, no save needed.
            The `key` prop forces the WebView to fully remount on URL change
            so stale page state can't bleed across preview refreshes. */}
        {previewVisible && debouncedPreviewUrl && (
          <View
            style={[
              styles.previewPane,
              { backgroundColor: theme.bg[1], borderTopColor: theme.line.DEFAULT },
              { height: screenH * 0.44 },
            ]}
          >
            {/* Preview pane header — label, scope caption, close button.
                The caption sets honest expectations: only design knobs +
                basics live-update in the WebView; services, FAQs, embeds,
                photo etc. show their saved state until the user taps Save. */}
            <View style={[styles.previewPaneHeader, { borderBottomColor: theme.line.DEFAULT }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.previewPaneLabel, { color: theme.ink[300] }]}>
                  {t.preview}
                </Text>
                <Text style={[styles.previewPaneCaption, { color: theme.ink[400] }]}>
                  {detectLocale() === 'tr'
                    ? 'Tasarım + temel bilgiler · diğer bölümler kaydedince görünür'
                    : detectLocale() === 'de'
                      ? 'Design + Grunddaten · andere Bereiche erscheinen nach Speichern'
                      : 'Design + basics · other sections appear once saved'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPreviewVisible(false)}
                hitSlop={12}
                style={styles.previewPaneClose}
                accessibilityLabel="Önizlemeyi kapat"
              >
                <X size={18} color={theme.ink[400]} />
              </TouchableOpacity>
            </View>
            <WebView
              key={debouncedPreviewUrl}
              source={{ uri: debouncedPreviewUrl }}
              style={{ flex: 1, backgroundColor: theme.bg[0] }}
              startInLoadingState
              renderLoading={() => (
                <View style={[styles.center, { backgroundColor: theme.bg[0] }]}>
                  <ActivityIndicator size="small" color={teal[500]} />
                </View>
              )}
            />
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Inline template picker modal — replaces navigation to template-preview.
          Keeps the edit screen mounted so all form state is preserved. The
          sector strip + horizontal pageable FlatList mirror template-preview.tsx
          so the UX is identical but without the nav-stack round-trip. */}
      <Modal
        visible={templatePickerOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setTemplatePickerOpen(false)}
      >
        <View style={[styles.tplPickerRoot, { backgroundColor: theme.bg[0] }]}>
          {/* Header */}
          <View style={[styles.tplPickerHeader, { borderBottomColor: theme.line.DEFAULT }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tplPickerTitle, { color: theme.ink[100] }]}>
                {templatePickerCurrent?.name ?? '…'}
              </Text>
              {templatePickerCurrent?.sectorHint ? (
                <Text style={[styles.tplPickerSub, { color: theme.ink[400] }]}>
                  {templatePickerCurrent.sectorHint}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={() => setTemplatePickerOpen(false)}
              style={styles.tplPickerIconBtn}
              hitSlop={12}
              accessibilityLabel="Close"
            >
              <X size={22} color={theme.ink[200]} />
            </TouchableOpacity>
          </View>

          {/* Sector filter strip removed — user wants clean preview-only modal. */}

          {/* Carousel body */}
          <View style={{ flex: 1 }}>
            {templatePickerItems === null ? (
              <View style={styles.center}>
                <ActivityIndicator color={teal[500]} size="large" />
              </View>
            ) : templatePickerFiltered.length === 0 ? (
              <View style={styles.center}>
                <Text style={{ color: theme.ink[400] }}>No templates available.</Text>
              </View>
            ) : (
              <FlatList
                ref={templatePickerListRef}
                data={templatePickerFiltered}
                keyExtractor={(it) => String(it.id)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={templatePickerActiveIdx}
                getItemLayout={(_, index) => ({
                  length: Dimensions.get('window').width,
                  offset: Dimensions.get('window').width * index,
                  index,
                })}
                onViewableItemsChanged={onTemplatePickerViewableItemsChanged.current}
                viewabilityConfig={templatePickerViewability.current}
                decelerationRate="fast"
                renderItem={({ item }) => {
                  const previewUri = item.previewPath
                    ? item.previewPath.startsWith('http')
                      ? item.previewPath
                      : `${API_BASE}${item.previewPath}`
                    : null;
                  return (
                    <View style={[styles.tplPickerPage, { width: Dimensions.get('window').width }]}>
                      <View style={[styles.tplPickerFrame, { borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[2] }]}>
                        {previewUri ? (
                          <Image source={{ uri: previewUri }} style={styles.tplPickerImage} resizeMode="contain" />
                        ) : (
                          <View style={[styles.center, styles.tplPickerNoPreview]}>
                            <View style={[styles.tplPickerNoPreviewIcon, { borderColor: theme.line.DEFAULT }]}>
                              <Text style={[styles.tplPickerNoPreviewGlyph, { color: theme.ink[300] }]}>◻</Text>
                            </View>
                            <Text style={[styles.tplPickerEmptyTitle, { color: theme.ink[200] }]}>
                              {item.name}
                            </Text>
                            <Text style={[styles.tplPickerEmptyHint, { color: theme.ink[400] }]}>
                              Tap Apply to see this template
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                }}
              />
            )}
            {templatePickerFiltered.length > 1 ? (
              <View style={styles.tplPageIndicator}>
                <Text style={[styles.tplPageIndicatorText, { color: '#FFFFFF' }]}>
                  {templatePickerActiveIdx + 1} / {templatePickerFiltered.length}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Footer */}
          <View style={[styles.tplPickerFooter, { borderTopColor: theme.line.DEFAULT }]}>
            <TouchableOpacity
              onPress={() => setTemplatePickerOpen(false)}
              style={[styles.tplBtn, styles.tplBtnGhost, { borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[1] }]}
              activeOpacity={0.85}
            >
              <Text style={[styles.tplBtnText, { color: theme.ink[200] }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={applyTemplatePicker}
              style={[styles.tplBtn, styles.tplBtnPrimary, { backgroundColor: teal[500] }]}
              activeOpacity={0.85}
              disabled={!templatePickerCurrent}
            >
              <Check size={16} color="#FFFFFF" />
              <Text style={[styles.tplBtnText, { color: '#FFFFFF' }]}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {paywallReason ? (
        <PaywallModal
          visible
          onClose={() => setPaywallReason(null)}
          reason={paywallReason}
          onReturned={() => {
            void (async () => {
              try {
                const me = await fetchMe();
                setAuthUser(me);
              } catch {
                // ignore
              }
            })();
          }}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // paddingBottom: when preview open we reduce so the WebView pane isn't
  // pushed off screen. Without preview, keep 160 so content clears gesture bar.
  scroll: { padding: 16, paddingBottom: 160 },
  scrollCompact: { paddingBottom: 80 },
  saveBtn: { paddingHorizontal: 4 },
  saveBtnText: { fontSize: 16, fontWeight: '600' },
  // Tab bar: 44pt tall, underline-style active indicator (no fill).
  // The Eye toggle button is appended as the rightmost element.
  tabBar: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  tabPill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Preview toggle button in the tab bar — compact pill, rightmost slot.
  previewToggleWrap: {
    paddingRight: 10,
    paddingLeft: 4,
    height: '100%',
    justifyContent: 'center',
  },
  previewToggleBtn: {
    width: 32,
    height: 26,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Live preview pane — sits below the form area, not a separate modal.
  previewPane: {
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  previewPaneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  previewPaneLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewPaneCaption: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 12,
  },
  previewPaneClose: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  photoWrap: {
    width: 96, height: 96, borderRadius: 48, borderWidth: 1,
    alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden', marginBottom: 8,
  },
  photo: { width: 96, height: 96, borderRadius: 48 },
  photoPlaceholder: { fontSize: 12, textAlign: 'center', paddingHorizontal: 8 },
  photoEditBadge: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 4, alignItems: 'center',
  },
  photoEditBadgeText: { color: '#fff', fontSize: 10 },
  fieldLabel: { fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.4 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, marginTop: 24 },
  // Inline template picker modal styles.
  tplPickerRoot: { flex: 1 },
  tplPickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  tplPickerTitle: { fontSize: 16, fontWeight: '700' },
  tplPickerSub: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  tplPickerIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  tplPickerPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  tplPickerFrame: {
    width: '100%',
    aspectRatio: 540 / 960,
    maxHeight: '100%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tplPickerImage: { width: '100%', height: '100%' },
  tplPickerEmptyText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  // Premium no-preview placeholder styles
  tplPickerNoPreview: { gap: 12, paddingHorizontal: 32 },
  tplPickerNoPreviewIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tplPickerNoPreviewGlyph: { fontSize: 28 },
  tplPickerEmptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  tplPickerEmptyHint: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  tplPageIndicator: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  tplPageIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tplPickerFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
  },
  tplBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tplBtnGhost: { borderWidth: 1 },
  tplBtnPrimary: {},
  tplBtnText: { fontSize: 15, fontWeight: '600' },
});
