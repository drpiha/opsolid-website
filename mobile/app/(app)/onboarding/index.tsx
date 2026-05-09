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
import { ChevronLeft, Camera, Check, Phone, Mail, MessageCircle } from 'lucide-react-native';

import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { teal, copper } from '../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import {
  useOnboardingDraftStore,
  type OnboardingContactChip,
} from '../../../src/store/onboardingDraftStore';
import { createCard, updateCard, uploadPhoto } from '../../../src/lib/api/cards';
import type { CardPatchInput } from '../../../src/lib/api/types';

const TEMPLATE_IDS: number[] = [1, 6, 14, 84];

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

  function goStep(next: 1 | 2 | 3 | 4 | 5) {
    setDraft({ step: next });
  }

  function back() {
    if (draft.step > 1) goStep((draft.step - 1) as 1 | 2 | 3 | 4 | 5);
  }

  function skipWizard() {
    setDraft({ skipped: true });
    router.replace('/(app)/cards' as never);
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

      const created = await createCard({
        templateId: draft.templateId,
        // Server accepts arbitrary cardData keys — cast through unknown.
        cardData: cardData as unknown as { name: string },
      });

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

      router.replace(`/(app)/cards/${created.id}` as never);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setPublishError(msg || t.publishingError);
    } finally {
      setSaving(false);
    }
  }

  // ---------- Render ----------

  const showSkip = draft.step === 1 || draft.step === 3;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top chrome — progress bar + back/skip */}
        <View style={styles.chrome}>
          <View style={styles.chromeRow}>
            <View style={styles.chromeLeft}>
              {draft.step > 1 ? (
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
                        n <= draft.step ? teal[500] : theme.bg[3],
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
                  templateId={draft.templateId}
                  onPick={(id) => {
                    setDraft({ templateId: id });
                    goStep(5);
                  }}
                  t={t}
                  inkColor={theme.ink[100]}
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
                    contactChip: draft.contactChip,
                    contactValue: draft.contactValue,
                    templateId: draft.templateId,
                  }}
                  saving={saving}
                  publishError={publishError}
                  onPublish={() => void handlePublish()}
                  onEditDetails={() => {
                    draft.reset();
                    router.replace('/(app)/cards/create' as never);
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
    </View>
  );
}

// ----------------------------------------------------------------- STEP 1
type T = ReturnType<typeof useTranslations>['onboarding'];

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
        <Text style={[styles.photoErr, { color: '#B8514B' }]}>{props.photoError}</Text>
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
function Step4Style(props: {
  templateId: number;
  onPick: (id: number) => void;
  t: T;
  inkColor: string;
  hintColor: string;
  bgColor: string;
  borderColor: string;
  screenWidth: number;
}) {
  // 2-column grid, width = (screenWidth - 48) / 2, aspect 1.6
  const cardW = (props.screenWidth - 48 - 12) / 2;
  const cardH = cardW / 1.6;
  const tplNames = props.t.templateNames;
  // Static template tints to give the chips visual variety even without
  // a real preview render.
  const tints: Record<number, [string, string]> = {
    1: ['#1AA6B7', '#0F4F58'],
    6: ['#C27940', '#7E4A24'],
    14: ['#0B1A1F', '#454B56'],
    84: ['#F4F1EC', '#1AA6B7'],
  };

  return (
    <View style={styles.stepBody}>
      <Text style={[styles.stepTitle, { color: props.inkColor }]}>
        {props.t.step4Title}
      </Text>

      <View style={[styles.tplGrid, { marginTop: 24 }]}>
        {TEMPLATE_IDS.map((id) => {
          const active = props.templateId === id;
          const [bgA, bgB] = tints[id] ?? [teal[500], teal[700]];
          return (
            <Pressable
              key={id}
              onPress={() => props.onPick(id)}
              style={[
                styles.tplCard,
                {
                  width: cardW,
                  height: cardH,
                  backgroundColor: bgA,
                  borderColor: active ? teal[500] : props.borderColor,
                  borderWidth: active ? 2 : 1,
                },
              ]}
            >
              <View style={[styles.tplAccent, { backgroundColor: bgB }]} />
              <Text style={styles.tplName}>
                {tplNames[String(id) as '1' | '6' | '14' | '84']}
              </Text>
              {active ? (
                <View style={[styles.tplCheck, { backgroundColor: teal[500] }]}>
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ----------------------------------------------------------------- STEP 5
function Step5Preview(props: {
  draft: {
    photoUri: string | null;
    name: string;
    jobTitle: string;
    contactChip: OnboardingContactChip;
    contactValue: string;
    templateId: number;
  };
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

  return (
    <View style={styles.stepBody}>
      <Text style={[styles.stepTitle, { color: props.inkColor }]}>
        {props.t.step5Title}
      </Text>
      <Text style={[styles.stepHint, { color: props.hintColor }]}>
        {props.t.step5Hint}
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

      {props.publishError ? (
        <Text style={[styles.publishErr, { color: '#B8514B' }]}>
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

  // Step 4
  tplGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  tplCard: {
    borderRadius: 16,
    padding: 16,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
  },
  tplAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 28,
  },
  tplName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tplCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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

