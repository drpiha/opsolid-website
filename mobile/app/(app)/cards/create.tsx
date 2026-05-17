import { useState, useEffect, useMemo, useRef } from 'react';
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
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { X } from 'lucide-react-native';
import { createCard, updateCard, uploadPhoto } from '../../../src/lib/api/cards';
import { listTemplates, type Template } from '../../../src/lib/api/templates';
import { API_BASE } from '../../../src/lib/api/client';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { accent } from '../../../src/lib/theme/tokens';
import { typography } from '../../../src/lib/theme/typography';
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
import { AppBar, AppBarIconButton } from '../../../src/components/ui/AppBar';
import { Button } from '../../../src/components/ui/Button';
import { Avatar } from '../../../src/components/ui/Avatar';
import { SectionLabel } from '../../../src/components/ui/SectionLabel';
import { Chip } from '../../../src/components/ui/Chip';
import { Input } from '../../../src/components/ui/Input';

const TOTAL_STEPS = 5;

export default function CardCreateScreen() {
  const router = useRouter();
  const theme = useTheme();
  const tFull = useTranslations(detectLocale());
  const t = tFull.cards;

  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // ─── Form state (unchanged from original) ─────────────────────────────────
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

  // ─── Inline template picker ────────────────────────────────────────────────
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

  // ─── Photo picker ──────────────────────────────────────────────────────────
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

  // ─── Create ────────────────────────────────────────────────────────────────
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

  // ─── Navigation ───────────────────────────────────────────────────────────
  function goBack() {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    } else {
      router.back();
    }
  }

  function goNext() {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
    } else {
      void handleCreate();
    }
  }

  // ─── Step label ───────────────────────────────────────────────────────────
  const stepLabel = (t.stepLabel ?? 'Step {n} of {total}')
    .replace('{n}', String(currentStep))
    .replace('{total}', String(TOTAL_STEPS));

  // ─── Step titles & hints ──────────────────────────────────────────────────
  const stepMeta: { title: string; hint: string }[] = [
    {
      title: t.pickTemplate ?? 'Pick a template',
      hint: t.sectionTemplate,
    },
    {
      title: t.addPhoto,
      hint: tFull.onboarding?.step1Hint ?? '',
    },
    {
      title: tFull.onboarding?.step2Title ?? t.fieldName,
      hint: tFull.onboarding?.step2NamePlaceholder ?? '',
    },
    {
      title: tFull.onboarding?.step3Title ?? t.fieldPhone,
      hint: tFull.onboarding?.step3Skip ?? '',
    },
    {
      title: tFull.onboarding?.step5Title ?? t.save,
      hint: tFull.onboarding?.step5Hint ?? '',
    },
  ];

  const meta = stepMeta[currentStep - 1] ?? stepMeta[0];

  // ─── Progress fraction ────────────────────────────────────────────────────
  const progressFraction = currentStep / TOTAL_STEPS;

  const windowWidth = Dimensions.get('window').width;

  return (
    <>
      {/* AppBar */}
      <AppBar
        variant="default"
        title={t.createTitle}
        leading={
          <AppBarIconButton ghost onPress={goBack} accessibilityLabel={t.cancel}>
            <X size={20} color={theme.text} />
          </AppBarIconButton>
        }
        trailing={null}
      />

      {/* Progress bar — 4px flat View, no primitive needed */}
      <View style={[styles.progressTrack, { backgroundColor: theme.line.DEFAULT }]}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: accent, width: `${progressFraction * 100}%` },
          ]}
        />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.pageBg }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: theme.pageBg }}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
        >
          {/* Step eyebrow + headline */}
          <SectionLabel style={styles.eyebrow}>{stepLabel}</SectionLabel>
          <Text style={[typography.display2, styles.headline, { color: theme.text }]}>
            {meta.title}
          </Text>
          {meta.hint ? (
            <Text style={[typography.lead, styles.hint, { color: theme.textSecondary }]}>
              {meta.hint}
            </Text>
          ) : null}

          {/* ── Step 1: Template ─────────────────────────────────────────── */}
          {currentStep === 1 && (
            <View style={styles.stepBody}>
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
            </View>
          )}

          {/* ── Step 2: Photo ─────────────────────────────────────────────── */}
          {currentStep === 2 && (
            <View style={styles.stepBody}>
              <View style={styles.photoWrap}>
                <Avatar
                  name={basics.name || undefined}
                  imageUri={photoUri ?? undefined}
                  size={96}
                  shape="circle"
                />
                {/* Edit badge overlapping the avatar */}
                <TouchableOpacity
                  onPress={() => void pickPhoto()}
                  disabled={saving}
                  style={[styles.photoEditBadge, { backgroundColor: accent }]}
                  activeOpacity={0.85}
                >
                  <Text style={[typography.caption, { color: '#FFFFFF' }]}>
                    {photoUri ? t.changePhoto : t.addPhoto}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── Step 3: Identity (name, title, company) ───────────────────── */}
          {currentStep === 3 && (
            <View style={styles.stepBody}>
              <View style={styles.fieldGroup}>
                <Input
                  label={t.fieldName}
                  value={basics.name}
                  onChangeText={(v) => setBasic('name', v)}
                  placeholder={t.namePlaceholder}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                <Input
                  label={t.fieldJobTitle}
                  value={basics.jobTitle}
                  onChangeText={(v) => setBasic('jobTitle', v)}
                  placeholder={t.titlePlaceholder}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                <Input
                  label={t.fieldPosition}
                  value={basics.position}
                  onChangeText={(v) => setBasic('position', v)}
                  placeholder={t.positionPlaceholder}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                <Input
                  label={t.fieldCompany}
                  value={basics.company}
                  onChangeText={(v) => setBasic('company', v)}
                  placeholder={t.companyPlaceholder}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                <Input
                  label={t.fieldBio}
                  value={basics.bio}
                  onChangeText={(v) => setBasic('bio', v)}
                  placeholder={t.bioPlaceholder}
                  autoCapitalize="sentences"
                  multiline
                  returnKeyType="done"
                />
              </View>
            </View>
          )}

          {/* ── Step 4: Contact info ──────────────────────────────────────── */}
          {currentStep === 4 && (
            <View style={styles.stepBody}>
              <View style={styles.fieldGroup}>
                <Input
                  label={t.fieldEmail}
                  value={basics.email}
                  onChangeText={(v) => setBasic('email', v)}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                />
                <Input
                  label={t.fieldPhone}
                  value={basics.phone}
                  onChangeText={(v) => setBasic('phone', v)}
                  placeholder="+49 …"
                  keyboardType="phone-pad"
                  returnKeyType="next"
                />
                <Input
                  label={t.fieldWhatsapp}
                  value={basics.whatsapp}
                  onChangeText={(v) => setBasic('whatsapp', v)}
                  placeholder="+49 …"
                  keyboardType="phone-pad"
                  returnKeyType="next"
                />
                <Input
                  label={t.fieldWebsite}
                  value={basics.website}
                  onChangeText={(v) => setBasic('website', v)}
                  placeholder={t.websitePlaceholder}
                  keyboardType="url"
                  autoCapitalize="none"
                  returnKeyType="next"
                />
                <Input
                  label={t.fieldAddress}
                  value={basics.address}
                  onChangeText={(v) => setBasic('address', v)}
                  placeholder={t.addressPlaceholder}
                  autoCapitalize="words"
                  returnKeyType="done"
                />
              </View>
            </View>
          )}

          {/* ── Step 5: Socials, brand, advanced ──────────────────────────── */}
          {currentStep === 5 && (
            <View style={styles.stepBody}>
              <SocialsSection theme={theme} values={socials} onChange={setSocial} />
              <BrandColorsSection
                theme={theme}
                primaryHex={primaryHex}
                accentHex={accentHex}
                onPrimaryChange={setPrimaryHex}
                onAccentChange={setAccentHex}
              />
              <QrStyleSection theme={theme} value={qrPreset} onChange={setQrPreset} />
              <ServicesSection theme={theme} items={services} onChange={setServices} />
              <CustomButtonsSection theme={theme} items={customButtons} onChange={setCustomButtons} />
              <FaqsSection theme={theme} items={faqs} onChange={setFaqs} />
              <StatusBannerSection theme={theme} value={statusBanner} onChange={setStatusBanner} />
              <FeedbackSection theme={theme} value={feedbackEnabled} onChange={setFeedbackEnabled} />
              <VisibilitySection theme={theme} value={visibility} onChange={setVisibility} />
              <DiscoverySection theme={theme} values={discovery} onChange={setDiscoveryField} />
            </View>
          )}
        </ScrollView>

        {/* Bottom action bar */}
        <View
          style={[
            styles.actionBar,
            { backgroundColor: theme.pageBg, borderTopColor: theme.line.DEFAULT },
          ]}
        >
          {currentStep > 1 ? (
            <Button
              label={t.cancel}
              variant="ghost"
              onPress={goBack}
              fullWidth={false}
              style={styles.backBtn}
            />
          ) : (
            <View style={styles.backBtn} />
          )}
          <View style={styles.nextBtnWrap}>
            <Button
              label={currentStep === TOTAL_STEPS ? t.save : (tFull.onboarding?.step1Next ?? 'Next')}
              variant="accent"
              onPress={goNext}
              loading={saving && currentStep === TOTAL_STEPS}
              disabled={saving}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* ── Inline template picker modal ────────────────────────────────────── */}
      <Modal
        visible={templatePickerOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setTemplatePickerOpen(false)}
      >
        <View style={[styles.tplPickerRoot, { backgroundColor: theme.pageBg }]}>
          {/* Modal AppBar */}
          <AppBar
            variant="default"
            title={t.pickTemplate ?? 'Pick a template'}
            leading={null}
            trailing={
              <AppBarIconButton ghost onPress={() => setTemplatePickerOpen(false)} accessibilityLabel="Close">
                <X size={20} color={theme.text} />
              </AppBarIconButton>
            }
          />

          {/* Template carousel */}
          <View style={{ flex: 1 }}>
            {templatePickerItems === null ? (
              <View style={styles.center}>
                <ActivityIndicator color={accent} size="large" />
              </View>
            ) : templatePickerFiltered.length === 0 ? (
              <View style={styles.center}>
                <Text style={[typography.body, { color: theme.textFaint }]}>
                  {t.templatesEmpty}
                </Text>
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
                  length: windowWidth,
                  offset: windowWidth * index,
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
                    <View style={[styles.tplPickerPage, { width: windowWidth }]}>
                      <View
                        style={[
                          styles.tplPickerFrame,
                          { borderColor: theme.line.DEFAULT, backgroundColor: theme.surface },
                        ]}
                      >
                        {previewUri ? (
                          <Image
                            source={{ uri: previewUri }}
                            style={styles.tplPickerImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <View style={[styles.center, styles.tplPickerNoPreview]}>
                            <View
                              style={[
                                styles.tplPickerNoPreviewIcon,
                                { borderColor: theme.line.DEFAULT },
                              ]}
                            >
                              <Text
                                style={[styles.tplPickerNoPreviewGlyph, { color: theme.textMuted }]}
                              >
                                ◻
                              </Text>
                            </View>
                            <Text
                              style={[typography.bodyMedium, { color: theme.textSecondary, textAlign: 'center' }]}
                            >
                              {item.name}
                            </Text>
                            <Text
                              style={[typography.bodySmall, { color: theme.textMuted, textAlign: 'center', lineHeight: 18 }]}
                            >
                              Tap Apply to see this template
                            </Text>
                          </View>
                        )}
                      </View>
                      {/* Template info below preview */}
                      <View style={styles.tplInfoWrap}>
                        <Text style={[typography.bodyMedium, { color: theme.text }]}>
                          {item.name}
                        </Text>
                        {item.sectorHint ? (
                          <Text style={[typography.bodySmall, { color: theme.textMuted }]}>
                            {item.sectorHint}
                          </Text>
                        ) : null}
                        {item.id === templateId ? (
                          <Chip variant="accent" label="Selected" style={styles.selectedChip} />
                        ) : null}
                      </View>
                    </View>
                  );
                }}
              />
            )}
            {templatePickerFiltered.length > 1 ? (
              <View style={styles.tplPageIndicator}>
                <Chip
                  variant="solid"
                  label={`${templatePickerActiveIdx + 1} / ${templatePickerFiltered.length}`}
                />
              </View>
            ) : null}
          </View>

          {/* Modal footer */}
          <View
            style={[styles.tplPickerFooter, { borderTopColor: theme.line.DEFAULT }]}
          >
            <View style={styles.tplCancelWrap}>
              <Button
                label={t.cancel}
                variant="secondary"
                onPress={() => setTemplatePickerOpen(false)}
              />
            </View>
            <View style={styles.tplApplyWrap}>
              <Button
                label={t.applyToCard}
                variant="accent"
                onPress={() => {
                  if (templatePickerCurrent) setTemplateId(templatePickerCurrent.id);
                  setTemplatePickerOpen(false);
                }}
                disabled={!templatePickerCurrent}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Progress bar
  progressTrack: {
    height: 4,
    width: '100%',
  },
  progressFill: {
    height: 4,
  },

  // Step content
  scroll: { padding: 20, paddingBottom: 24 },
  eyebrow: { marginBottom: 8 },
  headline: { marginBottom: 6 },
  hint: { marginBottom: 20 },
  stepBody: { gap: 0 },
  fieldGroup: { gap: 12 },

  // Photo step
  photoWrap: {
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  photoEditBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    paddingVertical: 5,
    alignItems: 'center',
  },

  // Bottom action bar
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  backBtn: {
    width: 80,
  },
  nextBtnWrap: {
    flex: 1,
  },

  // Inline template picker modal
  tplPickerRoot: { flex: 1 },
  tplPickerPage: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  tplPickerFrame: {
    flex: 1,
    aspectRatio: 540 / 960,
    maxHeight: '72%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    alignSelf: 'center',
    width: '100%',
  },
  tplPickerImage: { width: '100%', height: '100%' },
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
  tplInfoWrap: {
    gap: 4,
    paddingHorizontal: 4,
  },
  selectedChip: {
    marginTop: 4,
  },
  tplPageIndicator: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
  },
  tplPickerFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tplCancelWrap: { flex: 1 },
  tplApplyWrap: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
