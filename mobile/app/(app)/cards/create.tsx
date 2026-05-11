import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Check, X } from 'lucide-react-native';
import { createCard, updateCard, uploadPhoto } from '../../../src/lib/api/cards';
import { listTemplates, type Template } from '../../../src/lib/api/templates';
import { API_BASE } from '../../../src/lib/api/client';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { copper, teal } from '../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
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

  // -----------------------------------------------------------------
  // Inline template picker — same pattern as edit/[id].tsx. The old
  // router.push-to-template-preview approach had a Tabs back-navigation
  // bug; using an inline Modal keeps the create screen mounted.
  // -----------------------------------------------------------------
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [templatePickerItems, setTemplatePickerItems] = useState<Template[] | null>(null);
  const [templatePickerActiveIdx, setTemplatePickerActiveIdx] = useState(0);
  const templatePickerListRef = useRef<FlatList<Template>>(null);
  const templatePickerViewability = useRef({ itemVisiblePercentThreshold: 60 });
  const onTemplatePickerViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (typeof first?.index === 'number') setTemplatePickerActiveIdx(first.index);
    },
  );

  useEffect(() => {
    if (!templatePickerOpen) return;
    if (templatePickerItems !== null) return;
    let cancelled = false;
    void listTemplates()
      .then((res) => { if (!cancelled) setTemplatePickerItems(res.items); })
      .catch(() => { if (!cancelled) setTemplatePickerItems([]); });
    return () => { cancelled = true; };
  }, [templatePickerOpen, templatePickerItems]);

  // Show all templates — sector filter chip strip was removed per UX feedback.
  const templatePickerFiltered = useMemo(() => {
    if (!templatePickerItems) return [] as Template[];
    return templatePickerItems;
  }, [templatePickerItems]);

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

  async function pickPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    // Skip allowsEditing — expo-image-picker v17 CropImageContract throws
    // IllegalArgumentException when the crop activity returns null
    // (cancel paths on Android), and the exception bypasses the JS catch
    // because it fires inside the native onActivityResult contract.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
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
        // Brand colors MUST be top-level POST fields — server writes them to
        // CardOrder.brandPrimaryHex / brandAccentHex columns. The public viewer
        // reads those columns, not cardData.brandPrimaryHex.
        brandPrimaryHex: primaryHex,
        brandAccentHex: accentHex,
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
      Alert.alert('', t.errorSave);
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
              onPreviewRequest={() => {
                // Open the inline picker modal — no router.push so the create
                // screen stays mounted and form state is preserved.
                setTemplatePickerOpen(true);
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

      {/* Inline template picker modal — mirrors edit/[id].tsx pattern. */}
      <Modal
        visible={templatePickerOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setTemplatePickerOpen(false)}
      >
        <View style={[styles.tplPickerRoot, { backgroundColor: theme.bg[0] }]}>
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
                <Text style={styles.tplPageIndicatorText}>
                  {templatePickerActiveIdx + 1} / {templatePickerFiltered.length}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={[styles.tplPickerFooter, { borderTopColor: theme.line.DEFAULT }]}>
            <TouchableOpacity
              onPress={() => setTemplatePickerOpen(false)}
              style={[styles.tplBtn, styles.tplBtnGhost, { borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[1] }]}
              activeOpacity={0.85}
            >
              <Text style={[styles.tplBtnText, { color: theme.ink[200] }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (templatePickerCurrent) setTemplateId(templatePickerCurrent.id);
                setTemplatePickerOpen(false);
              }}
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // Inline template picker modal — mirrors edit/[id].tsx styles.
  tplPickerRoot: { flex: 1 },
  tplPickerHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 12,
  },
  tplPickerTitle: { fontSize: 16, fontWeight: '700' },
  tplPickerSub: {
    fontSize: 11, fontWeight: '600', textTransform: 'uppercase',
    letterSpacing: 0.5, marginTop: 2,
  },
  tplPickerIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  tplPickerPage: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 12,
  },
  tplPickerFrame: {
    width: '100%', aspectRatio: 540 / 960, maxHeight: '100%',
    borderRadius: 16, borderWidth: 1, overflow: 'hidden',
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
    position: 'absolute', top: 12, alignSelf: 'center',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  tplPageIndicatorText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  tplPickerFooter: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1 },
  tplBtn: {
    flex: 1, height: 48, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  tplBtnGhost: { borderWidth: 1 },
  tplBtnPrimary: {},
  tplBtnText: { fontSize: 15, fontWeight: '600' },
});
