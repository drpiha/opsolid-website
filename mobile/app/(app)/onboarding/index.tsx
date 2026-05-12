// -----------------------------------------------------------------------
// Onboarding wizard — single-file 5-step state machine.
//
// Reasoning for one file vs. per-step files: all 5 steps share the same
// draft store, the same progress chrome, and the same animated transition
// wrapper. Splitting into 5 routes would bring an Expo-Router Stack with
// hardware-back transitions the wizard explicitly does NOT want (we want
// forward momentum, not navigation history). Keeping everything in one
// file means each step is a small inner component below; the wizard is
// ~500 lines but each step body is 30-80 lines.
// -----------------------------------------------------------------------

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  ChevronLeft,
  Camera,
  Check,
  Phone,
  Mail,
  MessageCircle,
  Settings,
  ScanLine,
  Link as LinkIcon,
} from 'lucide-react-native';

import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { teal, copper, signal } from '../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import {
  useOnboardingDraftStore,
  type OnboardingContactChip,
  type OnboardingDraft,
  type OnboardingOrigin,
} from '../../../src/store/onboardingDraftStore';
import { useFirstRunStore } from '../../../src/store/firstRunStore';
import {
  createCard,
  updateCard,
  uploadPhoto,
  draftFromImage,
  draftFromUrl,
} from '../../../src/lib/api/cards';
import type {
  CardPatchInput,
  DraftFields,
} from '../../../src/lib/api/types';
import { useAuthStore } from '../../../src/lib/auth/store';
import {
  PRESET_PACKS,
  type PresetPack,
} from '../../../src/lib/cards/presets';

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const locale = detectLocale();
  const t = useTranslations(locale).onboarding;
  const { width: screenWidth } = useWindowDimensions();

  const draft = useOnboardingDraftStore();
  const setDraft = draft.set;

  const [photoError, setPhotoError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // M1 — Step 0 transient state. Held outside the persisted draft because
  // these are short-lived UI states (the URL input, the in-progress upload
  // spinner, the "OCR not available on this server" notice).
  const [scanLoading, setScanLoading] = useState(false);
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [urlMode, setUrlMode] = useState(false);
  const [stepZeroError, setStepZeroError] = useState<string | null>(null);
  // Fix 1.7 — camera rationale panel. Shown BEFORE requesting the native
  // permission prompt so the user understands why Verso needs the camera
  // without relying solely on the OS permission dialog copy.
  const [showScanRationale, setShowScanRationale] = useState(false);

  // M7 Wave 2 — when the user taps "Enter manually" on the prefill panel we
  // hide the panel and reveal the standard 3-ramp picker for this session.
  // Lives in component state (not the draft store) because it's a one-shot
  // UI dismissal — re-entering the wizard later should re-offer the panel.
  const [prefillDismissed, setPrefillDismissed] = useState(false);

  // M7 Wave 2 — Google OAuth auto-fill. Runs ONCE on wizard mount: if the
  // authenticated user has a name/email/picture and the draft is still
  // empty (no OCR / URL pre-fill, no manual typing), seed those fields so
  // the user lands on a "we found your details" panel instead of a blank
  // origin picker. Empty deps are intentional — re-running this on every
  // draft change would clobber user edits.
  useEffect(() => {
    const u = useAuthStore.getState().user;
    if (!u) return;
    if (draft.name?.trim()) return;

    const patch: Partial<OnboardingDraft> = {};
    if (u.name) patch.name = u.name.trim();
    if (u.email && !draft.contactValue?.trim()) {
      patch.contactChip = 'email';
      patch.contactValue = u.email;
    }
    if (u.image) patch.prefillAvatarUrl = u.image;

    if (Object.keys(patch).length > 0) {
      setDraft(patch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-run the enter animation whenever step changes
  const stepAnim = useSharedValue(1);
  useEffect(() => {
    stepAnim.value = 0;
    stepAnim.value = withTiming(1, { duration: 300 });
  }, [draft.step, stepAnim]);

  const stepStyle = useAnimatedStyle(() => ({
    opacity: interpolate(stepAnim.value, [0, 1], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        translateX: interpolate(
          stepAnim.value,
          [0, 1],
          [24, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  function goStep(next: 0 | 1 | 2 | 3 | 4 | 5) {
    setDraft({ step: next });
  }

  function back() {
    if (urlMode) {
      setUrlMode(false);
      setStepZeroError(null);
      return;
    }
    // From Step 5 we always send the user back to Step 0 so they can pick a
    // different on-ramp without typing through 4 manual steps just to undo
    // the OCR/URL pre-fill. Step 1 also returns to Step 0 (the new entry).
    if (draft.step === 5 && (draft.origin === 'scan' || draft.origin === 'url')) {
      setDraft({ step: 0, origin: null });
      return;
    }
    if (draft.step > 0) goStep((draft.step - 1) as 0 | 1 | 2 | 3 | 4);
  }

  function skipWizard() {
    setDraft({ skipped: true });
    router.replace('/(app)/cards' as never);
  }

  // -------------- Step 0 — pick an on-ramp --------------

  function pickManual() {
    setStepZeroError(null);
    setDraft({ origin: 'manual', step: 1 });
  }

  /**
   * Apply DraftFields from OCR or URL extraction onto the persisted draft.
   * Preserves the user's existing inputs when a field is missing in the
   * upstream response, but also overwrites a previously-prefilled value
   * if the user runs scan/url a second time (e.g. picked the wrong card).
   */
  function applyDraftFields(fields: DraftFields, origin: OnboardingOrigin) {
    const patch: Parameters<typeof setDraft>[0] = { origin, step: 5 };
    if (fields.name) patch.name = fields.name;
    if (fields.title) patch.jobTitle = fields.title;
    if (fields.company) patch.company = fields.company;
    if (fields.bio) patch.bio = fields.bio;
    if (fields.website) patch.website = fields.website;
    // Map either email or phone into the contact chip — prefer email since
    // it's the lower-friction follow-up channel.
    if (fields.email) {
      patch.contactChip = 'email';
      patch.contactValue = fields.email;
    } else if (fields.phone) {
      patch.contactChip = 'phone';
      patch.contactValue = fields.phone;
    }
    setDraft(patch);
  }

  // Fix 1.7 — show the rationale panel before touching the native OS prompt.
  // `pickScan` now just opens the panel; the actual camera work lives in
  // `executeScan` which is called only after the user taps "Continue".
  function pickScan() {
    if (scanLoading) return;
    setStepZeroError(null);
    setShowScanRationale(true);
  }

  async function executeScan() {
    setShowScanRationale(false);
    setScanLoading(true);
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        setStepZeroError(t.scanPermissionDenied);
        setScanLoading(false);
        return;
      }
      // expo-image-picker's launchCameraAsync is the closest "open the
      // system camera" affordance available without adding `expo-camera`
      // (the constraint forbids new mobile deps). The system camera
      // already provides framing guides; we don't render an overlay.
      // allowsEditing removed — expo-image-picker v17's CropImageContract
      // crashes the app with IllegalArgumentException when the crop
      // activity returns null (Android cancel paths). The OCR works on
      // the raw camera capture; cropping was a nice-to-have, not required.
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        base64: true,
      });
      if (result.canceled || !result.assets[0]?.base64) {
        setScanLoading(false);
        return;
      }
      const fields = await draftFromImage(result.assets[0].base64);
      applyDraftFields(fields, 'scan');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('503') || msg.includes('ocr_not_configured')) {
        setStepZeroError(t.scanComingSoon);
      } else if (msg.includes('429')) {
        setStepZeroError(t.scanRateLimit);
      } else {
        setStepZeroError(t.scanError);
      }
    } finally {
      setScanLoading(false);
    }
  }

  async function submitUrl() {
    if (urlLoading) return;
    const v = urlValue.trim();
    if (v.length < 4) {
      setStepZeroError(t.urlInvalid);
      return;
    }
    setStepZeroError(null);
    setUrlLoading(true);
    try {
      const fields = await draftFromUrl(v);
      applyDraftFields(fields, 'url');
      setUrlMode(false);
      setUrlValue('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('503') || msg.includes('ai_not_configured')) {
        setStepZeroError(t.urlComingSoon);
      } else if (msg.includes('429')) {
        setStepZeroError(t.urlRateLimit);
      } else if (msg.includes('502') || msg.includes('fetch_failed')) {
        setStepZeroError(t.urlFetchFailed);
      } else {
        setStepZeroError(t.urlError);
      }
    } finally {
      setUrlLoading(false);
    }
  }

  // Step 1 — photo
  async function pickPhoto() {
    setPhotoError(null);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setPhotoError(t.photoPermissionDenied);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    setDraft({
      photoUri: asset.uri,
      photoMimeType: asset.mimeType ?? 'image/jpeg',
    });
  }

  // Step 5 — publish
  async function handlePublish() {
    if (saving) return;
    setSaving(true);
    setPublishError(null);
    try {
      const cardData: Record<string, unknown> = {
        name: draft.name.trim(),
      };
      if (draft.jobTitle.trim()) cardData.title = draft.jobTitle.trim();
      const cv = draft.contactValue.trim();
      if (cv) {
        if (draft.contactChip === 'email') cardData.email = cv;
        else if (draft.contactChip === 'phone') cardData.phone = cv;
        else cardData.whatsapp = cv;
      }
      // M1 — extra fields the OCR / URL pre-fill may have populated. Always
      // included when non-empty; the user could also have edited them on
      // the Step 5 preview (we read the live draft state, not the upstream
      // pre-fill, so any user edits win).
      if (draft.company.trim()) cardData.company = draft.company.trim();
      if (draft.website.trim()) cardData.website = draft.website.trim();
      if (draft.bio.trim()) cardData.bio = draft.bio.trim();

      const created = await createCard({
        templateId: draft.templateId,
        // M7 Wave 2 — pass the preset's themeKey at create time. Brand
        // colors are NOT in CardCreateInput (only `themeKey` is), so we
        // PATCH them in a follow-up call below alongside the photo path.
        themeKey: draft.themeKey,
        // Server accepts arbitrary cardData keys — cast through unknown.
        cardData: cardData as unknown as { name: string },
      });

      // M7 Wave 2 — wire preset brand colors via PATCH. If the user picked
      // a preset (presetKey set) we always send the colors so the dark/light
      // pair matches what they previewed in Step 4. If the user skipped the
      // preset picker (presetKey null) we don't override anything.
      if (draft.presetKey) {
        try {
          await updateCard(created.id, {
            brandPrimaryHex: draft.brandPrimaryHex,
            brandAccentHex: draft.brandAccentHex,
            // Cast through unknown — server PATCH accepts these top-level
            // brand fields but the mobile CardPatchInput hasn't yet been
            // widened (it omits brand color keys; mirrors comment in
            // mobile/CLAUDE.md gotchas).
          } as unknown as CardPatchInput);
        } catch {
          // Best-effort — don't block the publish flow. The card is live
          // with default brand colors; user can re-pick on cards/edit.
        }
      }

      // Photo upload is best-effort: a network failure here doesn't block the
      // publish flow. The card is created without the photo and the draft
      // photoUri is preserved so the user can re-edit and try again later.
      let photoFailed = false;
      if (draft.photoUri) {
        try {
          const path = await uploadPhoto(draft.photoUri, draft.photoMimeType);
          const patch: CardPatchInput = { photoPath: path };
          await updateCard(created.id, patch);
        } catch {
          photoFailed = true;
        }
      }

      // Mark wizard finished. Don't reset photoUri yet if upload failed —
      // user can re-edit the card and add the photo from there.
      setDraft({ everPublished: true });
      if (!photoFailed) {
        draft.reset();
      } else {
        // Reset everything except photoUri/photoMimeType (and the guard flags
        // — reset() preserves those naturally).
        const keepPhoto = draft.photoUri;
        const keepMime = draft.photoMimeType;
        draft.reset();
        setDraft({ photoUri: keepPhoto, photoMimeType: keepMime });
      }

      useFirstRunStore.getState().markPendingCelebration(true);
      router.replace(`/(app)/cards/${created.id}` as never);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setPublishError(msg || t.publishingError);
    } finally {
      setSaving(false);
    }
  }

  // ---------- Render ----------

  const showSkip = draft.step === 0 || draft.step === 1 || draft.step === 3;
  // Progress bar — Step 0 renders 0/5 segments lit. After the user picks an
  // on-ramp the existing 1/5–5/5 progression takes over.
  const progressFilled = draft.step;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top chrome — progress bar + back/skip */}
        <View style={styles.chrome}>
          <View style={styles.chromeRow}>
            <View style={styles.chromeLeft}>
              {draft.step > 0 || urlMode ? (
                <TouchableOpacity onPress={back} hitSlop={12} style={styles.chromeBtn}>
                  <ChevronLeft size={22} color={theme.ink[200]} />
                </TouchableOpacity>
              ) : (
                <View style={styles.chromeBtn} />
              )}
            </View>
            <View style={styles.progressRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <View
                  key={n}
                  style={[
                    styles.progressSeg,
                    {
                      backgroundColor:
                        n <= progressFilled ? teal[500] : theme.bg[3],
                    },
                  ]}
                />
              ))}
            </View>
            <View style={styles.chromeRight}>
              {showSkip ? (
                <TouchableOpacity onPress={skipWizard} hitSlop={8}>
                  <Text style={[styles.skipLabel, { color: theme.ink[400] }]}>
                    {t.skip}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <Animated.View style={[styles.flex, stepStyle]}>
            <ScrollView
              style={styles.flex}
              contentContainerStyle={styles.scroll}
              keyboardShouldPersistTaps="handled"
            >
              {draft.step === 0 ? (
                <Step0Origin
                  urlMode={urlMode}
                  urlValue={urlValue}
                  onUrlChange={setUrlValue}
                  onUrlEnter={() => setUrlMode(true)}
                  onUrlSubmit={() => void submitUrl()}
                  scanLoading={scanLoading}
                  urlLoading={urlLoading}
                  onManual={pickManual}
                  onScan={() => void pickScan()}
                  errorMsg={stepZeroError}
                  // M7 Wave 2 — prefill panel surfaces when Google gave us a
                  // name and the user hasn't dismissed it yet for this run.
                  showPrefillPanel={
                    !prefillDismissed &&
                    !urlMode &&
                    !!draft.name?.trim() &&
                    (draft.origin === null || draft.origin === 'manual')
                  }
                  prefillName={draft.name}
                  prefillEmail={
                    draft.contactChip === 'email' ? draft.contactValue : ''
                  }
                  prefillAvatarUrl={draft.prefillAvatarUrl}
                  onPrefillUseThese={() => {
                    setDraft({ origin: 'manual', step: 4 });
                  }}
                  onPrefillEnterManually={() => setPrefillDismissed(true)}
                  t={t}
                  inkColor={theme.ink[100]}
                  inkSecondary={theme.ink[300]}
                  hintColor={theme.ink[400]}
                  bgColor={theme.bg[1]}
                  panelBgColor={theme.bg[2]}
                  borderColor={theme.line.DEFAULT}
                />
              ) : null}

              {draft.step === 1 ? (
                <Step1Photo
                  photoUri={draft.photoUri}
                  photoError={photoError}
                  onPick={pickPhoto}
                  onNext={() => goStep(2)}
                  t={t}
                  inkColor={theme.ink[100]}
                  hintColor={theme.ink[400]}
                  bgColor={theme.bg[1]}
                  borderColor={theme.line.DEFAULT}
                />
              ) : null}

              {draft.step === 2 ? (
                <Step2Identity
                  name={draft.name}
                  jobTitle={draft.jobTitle}
                  onChangeName={(v) => setDraft({ name: v })}
                  onChangeJobTitle={(v) => setDraft({ jobTitle: v })}
                  onNext={() => goStep(3)}
                  t={t}
                  inkColor={theme.ink[100]}
                  hintColor={theme.ink[400]}
                />
              ) : null}

              {draft.step === 3 ? (
                <Step3Contact
                  chip={draft.contactChip}
                  value={draft.contactValue}
                  onChip={(c) => setDraft({ contactChip: c, contactValue: '' })}
                  onValue={(v) => setDraft({ contactValue: v })}
                  onNext={() => goStep(4)}
                  t={t}
                  inkColor={theme.ink[100]}
                  hintColor={theme.ink[400]}
                  bgColor={theme.bg[1]}
                  borderColor={theme.line.DEFAULT}
                />
              ) : null}

              {draft.step === 4 ? (
                <Step4Style
                  presetKey={draft.presetKey}
                  onPick={(pack) => {
                    setDraft({
                      presetKey: pack.key,
                      templateId: pack.templateId,
                      themeKey: pack.themeKey,
                      brandPrimaryHex: pack.brandPrimaryHex,
                      brandAccentHex: pack.brandAccentHex,
                    });
                  }}
                  onContinue={() => goStep(5)}
                  t={t}
                  presetT={useTranslations(locale).presets}
                  inkColor={theme.ink[100]}
                  inkSecondary={theme.ink[300]}
                  hintColor={theme.ink[400]}
                  bgColor={theme.bg[1]}
                  borderColor={theme.line.DEFAULT}
                  screenWidth={screenWidth}
                />
              ) : null}

              {draft.step === 5 ? (
                <Step5Preview
                  draft={{
                    photoUri: draft.photoUri,
                    name: draft.name,
                    jobTitle: draft.jobTitle,
                    company: draft.company,
                    website: draft.website,
                    contactChip: draft.contactChip,
                    contactValue: draft.contactValue,
                    templateId: draft.templateId,
                    origin: draft.origin,
                  }}
                  // M1 — when the user landed on Step 5 via the OCR/URL fast-
                  // path, expose inline editors for each pre-filled field.
                  // The wizard atom is the single source of truth so each
                  // setter just patches one key.
                  onChangeName={(v) => setDraft({ name: v })}
                  onChangeJobTitle={(v) => setDraft({ jobTitle: v })}
                  onChangeCompany={(v) => setDraft({ company: v })}
                  onChangeWebsite={(v) => setDraft({ website: v })}
                  onChangeContact={(v) => setDraft({ contactValue: v })}
                  onChangeContactChip={(c) =>
                    setDraft({ contactChip: c, contactValue: '' })
                  }
                  saving={saving}
                  publishError={publishError}
                  onPublish={() => void handlePublish()}
                  onEditDetails={() => {
                    // Manual origin → keep legacy "reset and re-create" path
                    // so the user lands on the dedicated cards/create screen
                    // (richer field set than the wizard).
                    if (draft.origin === 'manual' || draft.origin === null) {
                      draft.reset();
                      router.replace('/(app)/cards/create' as never);
                      return;
                    }
                    // Scan / URL origin → step back into the manual wizard
                    // starting at the photo step. The pre-filled fields stay
                    // intact so the user can fine-tune typed inputs.
                    setDraft({ step: 1 });
                  }}
                  t={t}
                  inkColor={theme.ink[100]}
                  hintColor={theme.ink[400]}
                  bgColor={theme.bg[1]}
                  borderColor={theme.line.DEFAULT}
                />
              ) : null}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Fix 1.7 — camera rationale modal. Shown before the native OS
          permission prompt so the user understands why Verso needs the
          camera. Reusable pattern: same modal can be used in Step 1 for
          the photo-library rationale by wiring a separate state flag. */}
      <Modal
        visible={showScanRationale}
        transparent
        animationType="fade"
        onRequestClose={() => setShowScanRationale(false)}
      >
        <Pressable
          style={rationaleStyles.backdrop}
          onPress={() => setShowScanRationale(false)}
        >
          <Pressable
            style={[rationaleStyles.sheet, { backgroundColor: theme.bg[1] }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              style={[rationaleStyles.iconWrap, { backgroundColor: teal[50] }]}
            >
              <ScanLine size={28} color={teal[600]} />
            </View>
            <Text
              style={[rationaleStyles.rationaleTitle, { color: theme.ink[100] }]}
            >
              {t.scanRationaleTitle}
            </Text>
            <Text
              style={[rationaleStyles.rationaleBody, { color: theme.ink[300] }]}
            >
              {t.scanRationaleBody}
            </Text>
            <Pressable
              onPress={() => void executeScan()}
              style={[
                rationaleStyles.primaryBtn,
                { backgroundColor: teal[500] },
              ]}
            >
              <Text style={rationaleStyles.primaryBtnText}>{t.scanContinue}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setShowScanRationale(false);
                pickManual();
              }}
              style={rationaleStyles.ghostBtn}
            >
              <Text
                style={[rationaleStyles.ghostBtnText, { color: theme.ink[300] }]}
              >
                {t.scanSkip}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ----------------------------------------------------------------- STEP 0
type T = ReturnType<typeof useTranslations>['onboarding'];

/**
 * M1 — Step 0: pick an on-ramp.
 *
 * Three big tap-cards (Manuel / Kartvizit tara / URL'den oluştur). Picking
 * Scan or URL fires the corresponding API call inline; on success the
 * wizard fast-forwards to Step 5 (preview + publish) with the form
 * pre-filled. Manual hands off to the existing 5-step flow.
 *
 * The URL path has an in-screen "paste your URL" sub-mode so the user
 * doesn't get bumped to a new screen — keeps the entry-point screen
 * contained.
 */
function Step0Origin(props: {
  urlMode: boolean;
  urlValue: string;
  onUrlChange: (v: string) => void;
  onUrlEnter: () => void;
  onUrlSubmit: () => void;
  scanLoading: boolean;
  urlLoading: boolean;
  onManual: () => void;
  onScan: () => void;
  errorMsg: string | null;
  // M7 Wave 2 — prefill panel
  showPrefillPanel: boolean;
  prefillName: string;
  prefillEmail: string;
  prefillAvatarUrl: string | null;
  onPrefillUseThese: () => void;
  onPrefillEnterManually: () => void;
  t: T;
  inkColor: string;
  inkSecondary: string;
  hintColor: string;
  bgColor: string;
  panelBgColor: string;
  borderColor: string;
}) {
  if (props.urlMode) {
    return (
      <View style={styles.stepBody}>
        <Text style={[styles.stepTitle, { color: props.inkColor }]}>
          {props.t.step0UrlTitle}
        </Text>
        <Text style={[styles.stepHint, { color: props.hintColor }]}>
          {props.t.step0UrlHint}
        </Text>

        <View style={{ alignSelf: 'stretch', marginTop: 24 }}>
          <Input
            autoFocus
            value={props.urlValue}
            onChangeText={props.onUrlChange}
            placeholder={props.t.step0UrlPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            onSubmitEditing={() => props.onUrlSubmit()}
          />
        </View>

        {props.errorMsg ? (
          <Text style={[styles.photoErr, { color: signal.err }]}>
            {props.errorMsg}
          </Text>
        ) : null}

        <Pressable
          onPress={props.onUrlSubmit}
          disabled={props.urlLoading || props.urlValue.trim().length < 4}
          style={[
            styles.publishBtn,
            {
              backgroundColor: teal[500],
              opacity:
                props.urlLoading || props.urlValue.trim().length < 4 ? 0.6 : 1,
            },
          ]}
        >
          {props.urlLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.publishBtnText}>{props.t.step0UrlSubmit}</Text>
          )}
        </Pressable>
      </View>
    );
  }

  // 3 big tap-cards. Each card is a row with an icon column + a stacked
  // label / hint column. Cards visually mirror the BrandHeader minimal
  // style — copper-on-teal accents stay reserved for the publish CTA.
  type OnRamp = {
    key: 'manual' | 'scan' | 'url';
    icon: typeof Settings;
    title: string;
    hint: string;
    onPress: () => void;
    loading?: boolean;
  };
  const ramps: OnRamp[] = [
    {
      key: 'manual',
      icon: Settings,
      title: props.t.step0RampManualTitle,
      hint: props.t.step0RampManualHint,
      onPress: props.onManual,
    },
    {
      key: 'scan',
      icon: ScanLine,
      title: props.t.step0RampScanTitle,
      hint: props.t.step0RampScanHint,
      onPress: props.onScan,
      loading: props.scanLoading,
    },
    {
      key: 'url',
      icon: LinkIcon,
      title: props.t.step0RampUrlTitle,
      hint: props.t.step0RampUrlHint,
      onPress: props.onUrlEnter,
    },
  ];

  // M7 Wave 2 — initials fallback when Google didn't return a `picture` URL.
  // We capitalise first character of the auto-filled name; if for some reason
  // that's empty too we render '?'.
  const initial = props.prefillName.trim().charAt(0).toUpperCase() || '?';

  return (
    <View style={styles.stepBody}>
      <Text style={[styles.stepTitle, { color: props.inkColor }]}>
        {props.t.step0Title}
      </Text>
      <Text style={[styles.stepHint, { color: props.hintColor }]}>
        {props.t.step0Hint}
      </Text>

      {props.showPrefillPanel ? (
        <View
          style={[
            styles.prefillCard,
            {
              backgroundColor: props.panelBgColor,
              borderColor: props.borderColor,
            },
          ]}
        >
          <Text style={[styles.prefillTitle, { color: props.inkColor }]}>
            {props.t.step0PrefillTitle}
          </Text>

          <View style={styles.prefillRow}>
            {props.prefillAvatarUrl ? (
              <Image
                source={{ uri: props.prefillAvatarUrl }}
                style={styles.prefillAvatar}
              />
            ) : (
              <View
                style={[
                  styles.prefillAvatar,
                  styles.prefillAvatarFallback,
                  { backgroundColor: teal[500] },
                ]}
              >
                <Text style={styles.prefillAvatarInitial}>{initial}</Text>
              </View>
            )}
            <View style={styles.prefillTextCol}>
              <Text
                style={[styles.prefillName, { color: props.inkColor }]}
                numberOfLines={1}
              >
                {props.prefillName}
              </Text>
              {props.prefillEmail ? (
                <Text
                  style={[styles.prefillEmail, { color: props.inkSecondary }]}
                  numberOfLines={1}
                >
                  {props.prefillEmail}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.prefillBtnRow}>
            <Pressable
              onPress={props.onPrefillUseThese}
              style={[
                styles.prefillBtn,
                styles.prefillBtnPrimary,
                { backgroundColor: teal[600] },
              ]}
            >
              <Text style={styles.prefillBtnPrimaryText}>
                {props.t.step0PrefillUseThese}
              </Text>
            </Pressable>
            <Pressable
              onPress={props.onPrefillEnterManually}
              style={[styles.prefillBtn, styles.prefillBtnGhost]}
            >
              <Text style={[styles.prefillBtnGhostText, { color: props.hintColor }]}>
                {props.t.step0PrefillEnterManually}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View style={{ alignSelf: 'stretch', marginTop: 32, gap: 12 }}>
        {ramps.map((r) => {
          const Icon = r.icon;
          return (
            <Pressable
              key={r.key}
              onPress={r.onPress}
              disabled={r.loading}
              style={[
                styles.rampCard,
                {
                  backgroundColor: props.bgColor,
                  borderColor: props.borderColor,
                  opacity: r.loading ? 0.65 : 1,
                },
              ]}
            >
              <View
                style={[styles.rampIconWrap, { backgroundColor: teal[50] }]}
              >
                {r.loading ? (
                  <ActivityIndicator size="small" color={teal[500]} />
                ) : (
                  <Icon size={22} color={teal[600]} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rampTitle, { color: props.inkColor }]}>
                  {r.title}
                </Text>
                <Text style={[styles.rampHint, { color: props.hintColor }]}>
                  {r.hint}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {props.errorMsg ? (
        <Text style={[styles.photoErr, { color: signal.err }]}>
          {props.errorMsg}
        </Text>
      ) : null}
    </View>
  );
}

// ----------------------------------------------------------------- STEP 1

function Step1Photo(props: {
  photoUri: string | null;
  photoError: string | null;
  onPick: () => void;
  onNext: () => void;
  t: T;
  inkColor: string;
  hintColor: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <View style={styles.stepBody}>
      <Text style={[styles.stepTitle, { color: props.inkColor }]}>
        {props.t.step1Title}
      </Text>
      <Text style={[styles.stepHint, { color: props.hintColor }]}>
        {props.t.step1Hint}
      </Text>

      <Pressable
        onPress={props.onPick}
        style={[
          styles.photoCircle,
          { backgroundColor: props.bgColor, borderColor: props.borderColor },
        ]}
      >
        {props.photoUri ? (
          <Image source={{ uri: props.photoUri }} style={styles.photoImg} />
        ) : (
          <Camera size={36} color={teal[500]} />
        )}
      </Pressable>

      {props.photoError ? (
        <Text style={[styles.photoErr, { color: signal.err }]}>{props.photoError}</Text>
      ) : null}

      <Button
        label={props.t.step1Next}
        onPress={props.onNext}
        variant="primary"
        style={{ marginTop: 32, alignSelf: 'stretch', backgroundColor: teal[500] }}
      />
      <Button
        label={props.t.step1Skip}
        onPress={props.onNext}
        variant="ghost"
        style={{ marginTop: 8, alignSelf: 'stretch' }}
      />
    </View>
  );
}

// ----------------------------------------------------------------- STEP 2
function Step2Identity(props: {
  name: string;
  jobTitle: string;
  onChangeName: (v: string) => void;
  onChangeJobTitle: (v: string) => void;
  onNext: () => void;
  t: T;
  inkColor: string;
  hintColor: string;
}) {
  const ready = props.name.trim().length > 0;
  return (
    <View style={styles.stepBody}>
      <Text style={[styles.stepTitle, { color: props.inkColor }]}>
        {props.t.step2Title}
      </Text>

      <View style={{ alignSelf: 'stretch', gap: 14, marginTop: 24 }}>
        <Input
          autoFocus
          value={props.name}
          onChangeText={props.onChangeName}
          placeholder={props.t.step2NamePlaceholder}
          autoCapitalize="words"
          returnKeyType="next"
        />
        <Input
          value={props.jobTitle}
          onChangeText={props.onChangeJobTitle}
          placeholder={props.t.step2TitlePlaceholder}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => {
            if (ready) props.onNext();
          }}
        />
      </View>

      <Button
        label={props.t.step2Next}
        onPress={props.onNext}
        disabled={!ready}
        variant="primary"
        style={{
          marginTop: 24,
          alignSelf: 'stretch',
          backgroundColor: ready ? teal[500] : teal[500],
        }}
      />
    </View>
  );
}

// ----------------------------------------------------------------- STEP 3
function Step3Contact(props: {
  chip: OnboardingContactChip;
  value: string;
  onChip: (c: OnboardingContactChip) => void;
  onValue: (v: string) => void;
  onNext: () => void;
  t: T;
  inkColor: string;
  hintColor: string;
  bgColor: string;
  borderColor: string;
}) {
  const ready = props.value.trim().length > 0;
  const placeholder =
    props.chip === 'phone'
      ? props.t.step3PlaceholderPhone
      : props.chip === 'email'
        ? props.t.step3PlaceholderEmail
        : props.t.step3PlaceholderWhatsApp;
  const keyboardType =
    props.chip === 'email' ? 'email-address' : 'phone-pad';

  const chips: { key: OnboardingContactChip; label: string; icon: typeof Phone }[] = [
    { key: 'phone', label: props.t.step3ChipPhone, icon: Phone },
    { key: 'email', label: props.t.step3ChipEmail, icon: Mail },
    { key: 'whatsapp', label: props.t.step3ChipWhatsApp, icon: MessageCircle },
  ];

  return (
    <View style={styles.stepBody}>
      <Text style={[styles.stepTitle, { color: props.inkColor }]}>
        {props.t.step3Title}
      </Text>

      <View style={styles.chipRow}>
        {chips.map((c) => {
          const active = props.chip === c.key;
          const Icon = c.icon;
          return (
            <Pressable
              key={c.key}
              onPress={() => props.onChip(c.key)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? teal[500] : props.bgColor,
                  borderColor: active ? teal[500] : props.borderColor,
                },
              ]}
            >
              <Icon
                size={16}
                color={active ? '#FFFFFF' : props.inkColor}
              />
              <Text
                style={[
                  styles.chipLabel,
                  { color: active ? '#FFFFFF' : props.inkColor },
                ]}
              >
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ alignSelf: 'stretch', marginTop: 16 }}>
        <Input
          value={props.value}
          onChangeText={props.onValue}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={() => {
            if (ready) props.onNext();
          }}
        />
      </View>

      <Button
        label={props.t.step3Next}
        onPress={props.onNext}
        disabled={!ready}
        variant="primary"
        style={{ marginTop: 24, alignSelf: 'stretch', backgroundColor: teal[500] }}
      />
      <Button
        label={props.t.step3Skip}
        onPress={props.onNext}
        variant="ghost"
        style={{ marginTop: 8, alignSelf: 'stretch' }}
      />
    </View>
  );
}

// ----------------------------------------------------------------- STEP 4
/**
 * M7 Wave 2 — replaces the old 4-tile template picker with 5 curated preset
 * packs. Each pack bundles a templateId, themeKey, and brand color pair
 * (see `lib/cards/presets.ts`). Picking a pack updates several draft fields
 * at once — but doesn't auto-advance, so the user can compare the swatch
 * rows before committing with the bottom CTA.
 *
 * Layout: 2-column grid; with 5 items the last row has a single tile that
 * we let center via `justifyContent: space-between` plus an empty spacer.
 */
function Step4Style(props: {
  presetKey: string | null;
  onPick: (pack: PresetPack) => void;
  onContinue: () => void;
  t: T;
  presetT: ReturnType<typeof useTranslations>['presets'];
  inkColor: string;
  inkSecondary: string;
  hintColor: string;
  bgColor: string;
  borderColor: string;
  screenWidth: number;
}) {
  const cardW = (props.screenWidth - 48 - 12) / 2;

  return (
    <View style={styles.stepBody}>
      <Text style={[styles.stepTitle, { color: props.inkColor }]}>
        {props.t.step4Title}
      </Text>

      <View style={[styles.presetGrid, { marginTop: 24 }]}>
        {PRESET_PACKS.map((pack) => {
          const active = props.presetKey === pack.key;
          const labels = props.presetT[pack.key];
          return (
            <Pressable
              key={pack.key}
              onPress={() => props.onPick(pack)}
              style={[
                styles.presetCard,
                {
                  width: cardW,
                  backgroundColor: active ? teal[50] : props.bgColor,
                  borderColor: active ? teal[500] : props.borderColor,
                  borderWidth: active ? 2 : 1,
                },
              ]}
            >
              {/* Visual swatch row — three horizontal bands hinting at the
                  preset's brand pair plus a neutral. Keeps the tile useful
                  without rendering a full template preview. */}
              <View style={styles.presetSwatchRow}>
                <View
                  style={[
                    styles.presetSwatch,
                    { backgroundColor: pack.brandPrimaryHex },
                  ]}
                />
                <View
                  style={[
                    styles.presetSwatch,
                    { backgroundColor: pack.brandAccentHex },
                  ]}
                />
                <View
                  style={[
                    styles.presetSwatch,
                    {
                      backgroundColor:
                        pack.themeKey === 'dark' ? '#454B56' : '#F4F1EC',
                    },
                  ]}
                />
              </View>

              <Text style={[styles.presetLabel, { color: props.inkColor }]}>
                {labels.label}
              </Text>
              <Text
                style={[styles.presetSubtitle, { color: props.inkSecondary }]}
                numberOfLines={2}
              >
                {labels.subtitle}
              </Text>

              {active ? (
                <View
                  style={[styles.presetCheck, { backgroundColor: teal[500] }]}
                >
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <Button
        label={props.t.step1Next}
        onPress={props.onContinue}
        disabled={!props.presetKey}
        variant="primary"
        style={{
          marginTop: 24,
          alignSelf: 'stretch',
          backgroundColor: teal[500],
        }}
      />
    </View>
  );
}

// ----------------------------------------------------------------- STEP 5
function Step5Preview(props: {
  draft: {
    photoUri: string | null;
    name: string;
    jobTitle: string;
    company: string;
    website: string;
    contactChip: OnboardingContactChip;
    contactValue: string;
    templateId: number;
    origin: OnboardingOrigin | null;
  };
  onChangeName: (v: string) => void;
  onChangeJobTitle: (v: string) => void;
  onChangeCompany: (v: string) => void;
  onChangeWebsite: (v: string) => void;
  onChangeContact: (v: string) => void;
  onChangeContactChip: (c: OnboardingContactChip) => void;
  saving: boolean;
  publishError: string | null;
  onPublish: () => void;
  onEditDetails: () => void;
  t: T;
  inkColor: string;
  hintColor: string;
  bgColor: string;
  borderColor: string;
}) {
  const { draft } = props;
  const tplName = props.t.templateNames[
    String(draft.templateId) as '1' | '6' | '14' | '84'
  ];

  // M1 — When the user landed here via OCR/URL, surface inline editors so
  // they can correct the pre-fill without bouncing through Steps 1–4. Manual
  // origin keeps the legacy read-only preview because the user already typed
  // each value themselves.
  const showInlineEditors = draft.origin === 'scan' || draft.origin === 'url';
  const contactPlaceholder =
    draft.contactChip === 'phone'
      ? props.t.step3PlaceholderPhone
      : draft.contactChip === 'email'
        ? props.t.step3PlaceholderEmail
        : props.t.step3PlaceholderWhatsApp;
  const contactKeyboard =
    draft.contactChip === 'email' ? 'email-address' : 'phone-pad';

  return (
    <View style={styles.stepBody}>
      <Text style={[styles.stepTitle, { color: props.inkColor }]}>
        {props.t.step5Title}
      </Text>
      <Text style={[styles.stepHint, { color: props.hintColor }]}>
        {showInlineEditors ? props.t.step5HintReview : props.t.step5Hint}
      </Text>

      <View
        style={[
          styles.previewCard,
          { backgroundColor: props.bgColor, borderColor: props.borderColor },
        ]}
      >
        {/* Accent bar — copper for the credit lockup, teal would clash with
            the brand-primary in surrounding chrome. */}
        <View style={[styles.previewAccent, { backgroundColor: copper[500] }]} />

        <View style={styles.previewBody}>
          <View
            style={[
              styles.previewPhoto,
              { borderColor: props.borderColor, backgroundColor: props.borderColor },
            ]}
          >
            {draft.photoUri ? (
              <Image source={{ uri: draft.photoUri }} style={styles.previewPhotoImg} />
            ) : (
              <Text style={[styles.previewInitial, { color: props.hintColor }]}>
                {draft.name.charAt(0).toUpperCase() || '?'}
              </Text>
            )}
          </View>

          <Text style={[styles.previewName, { color: props.inkColor }]}>
            {draft.name || '—'}
          </Text>
          {draft.jobTitle ? (
            <Text style={[styles.previewTitle, { color: props.hintColor }]}>
              {draft.jobTitle}
            </Text>
          ) : null}
          {draft.company ? (
            <Text style={[styles.previewTitle, { color: props.hintColor }]}>
              {draft.company}
            </Text>
          ) : null}
          {draft.contactValue ? (
            <Text style={[styles.previewContact, { color: props.inkColor }]}>
              {draft.contactValue}
            </Text>
          ) : null}
          <View style={[styles.previewChip, { borderColor: teal[500] }]}>
            <Text style={[styles.previewChipText, { color: teal[500] }]}>
              {tplName}
            </Text>
          </View>
        </View>
      </View>

      {showInlineEditors ? (
        <View style={{ alignSelf: 'stretch', marginTop: 24, gap: 12 }}>
          <Input
            value={draft.name}
            onChangeText={props.onChangeName}
            placeholder={props.t.step2NamePlaceholder}
            autoCapitalize="words"
          />
          <Input
            value={draft.jobTitle}
            onChangeText={props.onChangeJobTitle}
            placeholder={props.t.step2TitlePlaceholder}
            autoCapitalize="words"
          />
          <Input
            value={draft.company}
            onChangeText={props.onChangeCompany}
            placeholder={props.t.step5CompanyPlaceholder}
            autoCapitalize="words"
          />
          <View style={[styles.chipRow, { marginTop: 4 }]}>
            {(
              [
                { key: 'phone' as const, label: props.t.step3ChipPhone, icon: Phone },
                { key: 'email' as const, label: props.t.step3ChipEmail, icon: Mail },
                {
                  key: 'whatsapp' as const,
                  label: props.t.step3ChipWhatsApp,
                  icon: MessageCircle,
                },
              ]
            ).map((c) => {
              const active = draft.contactChip === c.key;
              const Icon = c.icon;
              return (
                <Pressable
                  key={c.key}
                  onPress={() => props.onChangeContactChip(c.key)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? teal[500] : props.bgColor,
                      borderColor: active ? teal[500] : props.borderColor,
                    },
                  ]}
                >
                  <Icon size={16} color={active ? '#FFFFFF' : props.inkColor} />
                  <Text
                    style={[
                      styles.chipLabel,
                      { color: active ? '#FFFFFF' : props.inkColor },
                    ]}
                  >
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Input
            value={draft.contactValue}
            onChangeText={props.onChangeContact}
            placeholder={contactPlaceholder}
            keyboardType={contactKeyboard}
            autoCapitalize="none"
          />
          <Input
            value={draft.website}
            onChangeText={props.onChangeWebsite}
            placeholder={props.t.step5WebsitePlaceholder}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
      ) : null}

      {props.publishError ? (
        <Text style={[styles.publishErr, { color: signal.err }]}>
          {props.publishError}
        </Text>
      ) : null}

      <Pressable
        onPress={props.onPublish}
        disabled={props.saving}
        style={[
          styles.publishBtn,
          {
            backgroundColor: teal[500],
            opacity: props.saving ? 0.6 : 1,
          },
        ]}
      >
        {props.saving ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.publishBtnText}>{props.t.publish}</Text>
        )}
      </Pressable>

      <Pressable
        onPress={props.onEditDetails}
        disabled={props.saving}
        style={styles.editBtn}
      >
        <Text style={[styles.editBtnText, { color: props.hintColor }]}>
          {props.t.editDetails}
        </Text>
      </Pressable>
    </View>
  );
}

// ----------------------------------------------------------------- styles
const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  chrome: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chromeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chromeLeft: { width: 32 },
  chromeRight: { minWidth: 64, alignItems: 'flex-end' },
  chromeBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  progressSeg: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  skipLabel: {
    fontSize: 13,
    fontWeight: '500',
  },

  stepBody: {
    flex: 1,
    paddingTop: 24,
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  stepHint: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 24,
  },

  // Step 0
  rampCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  rampIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rampTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  rampHint: { fontSize: 12, lineHeight: 16 },

  // Step 1
  photoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    marginTop: 32,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImg: { width: '100%', height: '100%' },
  photoErr: {
    marginTop: 12,
    fontSize: 13,
    textAlign: 'center',
  },

  // Step 3
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipLabel: { fontSize: 14, fontWeight: '600' },

  // Step 4 — preset packs (M7 Wave 2)
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  presetCard: {
    minHeight: 140,
    borderRadius: 16,
    padding: 14,
    justifyContent: 'flex-start',
    overflow: 'hidden',
    position: 'relative',
  },
  presetSwatchRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  presetSwatch: {
    flex: 1,
    height: 16,
    borderRadius: 4,
  },
  presetLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  presetSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  presetCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Step 0 — Google prefill panel (M7 Wave 2)
  prefillCard: {
    alignSelf: 'stretch',
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  prefillTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  prefillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prefillAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  prefillAvatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  prefillAvatarInitial: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  prefillTextCol: {
    flex: 1,
  },
  prefillName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  prefillEmail: {
    fontSize: 13,
  },
  prefillBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  prefillBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prefillBtnPrimary: {},
  prefillBtnGhost: {
    borderWidth: 0,
  },
  prefillBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  prefillBtnGhostText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Step 5
  previewCard: {
    alignSelf: 'stretch',
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  previewAccent: {
    height: 6,
    width: '100%',
  },
  previewBody: {
    padding: 24,
    alignItems: 'center',
  },
  previewPhoto: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewPhotoImg: { width: '100%', height: '100%' },
  previewInitial: { fontSize: 32, fontWeight: '700' },
  previewName: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  previewTitle: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  previewContact: { fontSize: 14, marginTop: 8 },
  previewChip: {
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  previewChipText: { fontSize: 11, fontWeight: '600' },

  publishErr: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
  },
  publishBtn: {
    marginTop: 24,
    alignSelf: 'stretch',
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  editBtn: {
    marginTop: 12,
    alignSelf: 'stretch',
    paddingVertical: 12,
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

// Fix 1.7 — separate StyleSheet for the camera rationale modal so it can be
// copy-pasted to other screens (e.g. photo-library rationale in Step 1)
// without pulling in the main wizard styles.
const rationaleStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  rationaleTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  rationaleBody: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  primaryBtn: {
    alignSelf: 'stretch',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  ghostBtn: {
    alignSelf: 'stretch',
    paddingVertical: 12,
    alignItems: 'center',
  },
  ghostBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

