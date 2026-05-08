import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getCard, updateCard, uploadPhoto } from '../../../../src/lib/api/cards';
import type { ApiCard } from '../../../../src/lib/api/types';
import { API_BASE } from '../../../../src/lib/api/client';
import { useTheme } from '../../../../src/lib/theme/ThemeProvider';
import { copper } from '../../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../../src/lib/i18n/locale';
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
  DEFAULT_PRIMARY_HEX,
  DEFAULT_ACCENT_HEX,
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
    out.push({
      title: typeof o.title === 'string' ? o.title : '',
      description: typeof o.description === 'string' ? o.description : undefined,
      price: typeof o.price === 'string' ? o.price : undefined,
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
    out.push({
      label: typeof o.label === 'string' ? o.label : '',
      url: typeof o.url === 'string' ? o.url : '',
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
    out.push({
      question: typeof o.question === 'string' ? o.question : '',
      answer: typeof o.answer === 'string' ? o.answer : '',
    });
  }
  return out;
}

export default function CardEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations(detectLocale()).cards;

  const [card, setCard] = useState<ApiCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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

  const [photoPath, setPhotoPath] = useState<string | null>(null);

  function setBasic<K extends keyof BasicFieldsState>(k: K, v: BasicFieldsState[K]) {
    setBasics((s) => ({ ...s, [k]: v }));
  }
  function setSocial<K extends keyof SocialsState>(k: K, v: SocialsState[K]) {
    setSocials((s) => ({ ...s, [k]: v }));
  }
  function setDiscoveryField<K extends keyof DiscoveryState>(k: K, v: DiscoveryState[K]) {
    setDiscovery((s) => ({ ...s, [k]: v }));
  }

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
      })
      .catch(() => Alert.alert('', t.errorLoad))
      .finally(() => setLoading(false));
  }, [id, t.errorLoad]);

  async function pickPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setUploadingPhoto(true);
    try {
      const path = await uploadPhoto(asset.uri, asset.mimeType ?? 'image/jpeg');
      setPhotoPath(path);
    } catch {
      Alert.alert('Upload failed', 'Could not upload photo. Try again.');
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
        qrStyle,
      });
      Alert.alert('', t.saveSuccess, [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('', t.errorLoad);
    } finally {
      setSaving(false);
    }
  }

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

  return (
    <>
      <Stack.Screen
        options={{
          title: t.editTitle,
          headerStyle: { backgroundColor: theme.bg[0] },
          headerTintColor: theme.ink[100],
          headerRight: () => (
            <TouchableOpacity onPress={() => void handleSave()} disabled={saving} style={styles.saveBtn}>
              {saving
                ? <ActivityIndicator size="small" color={copper[500]} />
                : <Text style={[styles.saveBtnText, { color: copper[500] }]}>{t.save}</Text>
              }
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.bg[0] }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
      <ScrollView
        style={{ backgroundColor: theme.bg[0] }}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
      >
        {/* Photo */}
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

        <BasicFieldsSection theme={theme} values={basics} onChange={setBasic} />
        <SocialsSection theme={theme} values={socials} onChange={setSocial} />
        <BrandColorsSection
          theme={theme}
          primaryHex={primaryHex}
          accentHex={accentHex}
          onPrimaryChange={setPrimaryHex}
          onAccentChange={setAccentHex}
        />
        <TemplateSection theme={theme} value={templateId} onChange={setTemplateId} />
        <LayoutSection theme={theme} value={layoutKey} onChange={setLayoutKey} />
        <ThemeSection theme={theme} value={themeKey} onChange={setThemeKey} />
        <QrStyleSection theme={theme} value={qrPreset} onChange={setQrPreset} />
        <ServicesSection theme={theme} items={services} onChange={setServices} />
        <CustomButtonsSection theme={theme} items={customButtons} onChange={setCustomButtons} />
        <FaqsSection theme={theme} items={faqs} onChange={setFaqs} />
        <VisibilitySection theme={theme} value={visibility} onChange={setVisibility} />
        <DiscoverySection theme={theme} values={discovery} onChange={setDiscoveryField} />

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
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 16, paddingBottom: 48 },
  saveBtn: { paddingHorizontal: 4 },
  saveBtnText: { fontSize: 16, fontWeight: '600' },
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
});
