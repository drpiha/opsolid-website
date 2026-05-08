import { useState, useCallback } from 'react';
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
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { createCard, updateCard, uploadPhoto } from '../../../src/lib/api/cards';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { copper, teal } from '../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { useTemplatePickerStore } from '../../../src/store/templatePickerStore';
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
  DEFAULT_PRIMARY_HEX,
  DEFAULT_ACCENT_HEX,
  DEFAULT_STATUS_BANNER,
  stripEmpty,
  cleanServices,
  cleanCustomButtons,
  cleanFaqs,
} from '../../../src/components/cards/CardFormSections';
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
} from '../../../src/components/cards/CardFormSections';

// Sprint 6 — three-tab segmented control mirrors edit/[id].tsx.
type Tab = 'profil' | 'tasarim' | 'gelismis';

export default function CardCreateScreen() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations(detectLocale()).cards;

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('profil');

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
  const [feedbackEnabled, setFeedbackEnabled] = useState<boolean>(false);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string>('image/jpeg');

  function setBasic<K extends keyof BasicFieldsState>(k: K, v: BasicFieldsState[K]) {
    setBasics((s) => ({ ...s, [k]: v }));
  }
  function setSocial<K extends keyof SocialsState>(k: K, v: SocialsState[K]) {
    setSocials((s) => ({ ...s, [k]: v }));
  }
  function setDiscoveryField<K extends keyof DiscoveryState>(k: K, v: DiscoveryState[K]) {
    setDiscovery((s) => ({ ...s, [k]: v }));
  }

  // Apply any picked template id pushed by the modal preview screen.
  useFocusEffect(
    useCallback(() => {
      const picked = useTemplatePickerStore.getState().consume();
      if (picked != null) setTemplateId(picked);
    }, []),
  );

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
    setPhotoUri(asset.uri);
    setPhotoMimeType(asset.mimeType ?? 'image/jpeg');
  }

  async function handleCreate() {
    if (!basics.name.trim()) {
      Alert.alert('', 'Name is required.');
      return;
    }
    setSaving(true);
    try {
      // Build cardData from all sections. Strip empty strings.
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

      // Status banner — only persist when there's something meaningful to
      // store (saves payload bytes and avoids littering inactive defaults).
      if (statusBanner.enabled || statusBanner.text.trim().length > 0) {
        cardData.statusBanner = {
          enabled: statusBanner.enabled,
          text: statusBanner.text.trim(),
          tone: statusBanner.tone,
        };
      }

      // Drop undefined keys before sending
      Object.keys(cardData).forEach((k) => {
        if (cardData[k] === undefined) delete cardData[k];
      });

      const created = await createCard({
        templateId,
        layoutKey,
        themeKey,
        // The CardCreateInput type is intentionally narrow — server accepts
        // arbitrary keys, so cast through unknown.
        cardData: cardData as unknown as { name: string },
      });

      // Apply qrStyle, feedbackEnabled, and (if needed) photo after creation.
      // POST schema doesn't accept qrStyle / feedbackEnabled so we PATCH them.
      // Default preset 'classic' means we always send something — backend
      // stores the column.
      const postPatch: import('../../../src/lib/api/types').CardPatchInput = {
        qrStyle: { preset: qrPreset },
      };
      if (feedbackEnabled) postPatch.feedbackEnabled = true;

      if (photoUri) {
        try {
          const path = await uploadPhoto(photoUri, photoMimeType);
          postPatch.photoPath = path;
        } catch {
          Alert.alert('', 'Card created, but photo upload failed. You can add it later.');
          router.back();
          return;
        }
      }

      try {
        await updateCard(created.id, postPatch);
      } catch {
        // Non-fatal: card exists, qrStyle is optional. Surface a soft warning.
      }

      Alert.alert('', t.createSuccess, [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('', t.errorLoad);
    } finally {
      setSaving(false);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profil', label: t.tabProfile },
    { key: 'tasarim', label: t.tabDesign },
    { key: 'gelismis', label: t.tabAdvanced },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: t.createTitle,
          headerStyle: { backgroundColor: theme.bg[0] },
          headerTintColor: theme.ink[100],
          headerRight: () => (
            <TouchableOpacity onPress={() => void handleCreate()} disabled={saving} style={styles.saveBtn}>
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
        {/* Tab bar */}
        <View style={[styles.tabBar, { backgroundColor: theme.bg[1], borderBottomColor: theme.line.DEFAULT }]}>
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
        </View>

        {activeTab === 'profil' && (
          <ScrollView
            key="profil"
            style={{ backgroundColor: theme.bg[0] }}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets
          >
            {/* Photo */}
            <TouchableOpacity
              onPress={() => void pickPhoto()}
              disabled={saving}
              style={[styles.photoWrap, { borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[1] }]}
            >
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.photo} />
              ) : (
                <Text style={[styles.photoPlaceholder, { color: theme.ink[400] }]}>
                  {t.addPhoto}
                </Text>
              )}
              {photoUri && (
                <View style={styles.photoEditBadge}>
                  <Text style={styles.photoEditBadgeText}>{t.changePhoto}</Text>
                </View>
              )}
            </TouchableOpacity>

            <BasicFieldsSection theme={theme} values={basics} onChange={setBasic} />
            <SocialsSection theme={theme} values={socials} onChange={setSocial} />
            <ServicesSection theme={theme} items={services} onChange={setServices} />
            <CustomButtonsSection theme={theme} items={customButtons} onChange={setCustomButtons} />
            <FaqsSection theme={theme} items={faqs} onChange={setFaqs} />
          </ScrollView>
        )}

        {activeTab === 'tasarim' && (
          <ScrollView
            key="tasarim"
            style={{ backgroundColor: theme.bg[0] }}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <TemplateSection
              theme={theme}
              value={templateId}
              onChange={setTemplateId}
              onPreviewRequest={(tplId) => {
                router.push({
                  pathname: '/(app)/cards/template-preview',
                  params: { selectedId: String(tplId) },
                });
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
            {/* No live-preview FAB on create — there's no slug yet to preview. */}
          </ScrollView>
        )}

        {activeTab === 'gelismis' && (
          <ScrollView
            key="gelismis"
            style={{ backgroundColor: theme.bg[0] }}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets
          >
            <StatusBannerSection theme={theme} value={statusBanner} onChange={setStatusBanner} />
            <FeedbackSection theme={theme} value={feedbackEnabled} onChange={setFeedbackEnabled} />
            <VisibilitySection theme={theme} value={visibility} onChange={setVisibility} />
            <DiscoverySection theme={theme} values={discovery} onChange={setDiscoveryField} />
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 160 },
  saveBtn: { paddingHorizontal: 4 },
  saveBtnText: { fontSize: 16, fontWeight: '600' },
  tabBar: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 1,
  },
  tabPill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
});
