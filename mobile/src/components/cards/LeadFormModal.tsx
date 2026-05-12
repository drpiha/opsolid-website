// -----------------------------------------------------------------------
// LeadFormModal — public-card "Get in touch" sheet (Sprint 5).
//
// Posts to /api/cards/[slug]/lead which is rate-limited 5/10min per
// (slug, ip) and stores a CardLead row + fires email/Telegram/webhook
// notifications. The form mirrors the server zod schema field-for-field:
// name (required), email/phone/company/message/interest (optional),
// consent (boolean true, required).
//
// UX rules from the spec:
// - Send disabled until name + consent.
// - Inline success state ("Sent…") with auto-close after 2s.
// - 429 → rate-limited copy (server returns 429 when bucket is full).
// - Other errors → generic "Could not send" line, modal stays open.
// - KeyboardAvoidingView + automaticallyAdjustKeyboardInsets so phone
//   keyboards don't cover the inputs (matches the create/edit form fix).
// -----------------------------------------------------------------------

import { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Check, X } from 'lucide-react-native';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { copper } from '../../lib/theme/tokens';
import { useTranslations, detectLocale } from '../../lib/i18n/locale';
import { submitLead } from '../../lib/api/crm';
import type { ContactFormConfig } from '../../lib/api/types';

type Props = {
  visible: boolean;
  slug: string;
  onClose: () => void;
  /** M1 — Form-builder-lite. When set + `enabled === true`, the modal renders
   *  the owner-defined fields/labels/required flags instead of the legacy
   *  hard-coded shape. The submit endpoint is unchanged — server's lead route
   *  validates each field independently and forwards to the configured ESP. */
  contactForm?: ContactFormConfig | null;
};

const MESSAGE_MAX = 500;

export function LeadFormModal({ visible, slug, onClose, contactForm }: Props) {
  const theme = useTheme();
  const t = useTranslations(detectLocale()).crm.lead;
  // When the owner has enabled a custom contact form, drive the field set
  // off their config; otherwise render the legacy hard-coded shape so existing
  // cards keep working without any data migration. Each rendered field still
  // maps to one of the server's accepted keys (name / email / message), so
  // submitLead() continues to type-check.
  const useCustom =
    Boolean(contactForm?.enabled) &&
    Array.isArray(contactForm?.fields) &&
    (contactForm?.fields.length ?? 0) > 0;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [interest, setInterest] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset form whenever the modal opens — otherwise stale state from a
  // previous submission lingers when the user re-opens.
  useEffect(() => {
    if (visible) {
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setInterest('');
      setMessage('');
      setConsent(false);
      setSending(false);
      setErrorMsg(null);
      setSuccess(false);
    }
  }, [visible]);

  // Auto-close after success — give the user 2s to register the success
  // state, then dismiss. The parent decides what to do (we just call onClose).
  useEffect(() => {
    if (!success) return;
    const id = setTimeout(onClose, 2000);
    return () => clearTimeout(id);
  }, [success, onClose]);

  // Determine submit-readiness. Custom form: every required field must be
  // non-empty + consent. Legacy: name + consent (existing behaviour).
  const customRequiredOk = useCustom
    ? (contactForm?.fields ?? []).every((f) => {
        if (!f.required) return true;
        if (f.key === 'name') return name.trim().length > 0;
        if (f.key === 'email') return email.trim().length > 0;
        if (f.key === 'message') return message.trim().length > 0;
        return true;
      })
    : true;
  const canSubmit =
    (useCustom
      ? customRequiredOk
      : name.trim().length > 0) &&
    consent &&
    !sending;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSending(true);
    setErrorMsg(null);
    try {
      // Server's lead schema requires `name` non-empty. When the owner removed
      // the name field from the custom form, fall back to the email's local-
      // part so we never 400 the visitor for an owner choice they made later.
      const fallbackName =
        name.trim() ||
        (email.trim() ? email.trim().split('@')[0] : 'Anonymous');
      await submitLead(slug, {
        name: useCustom ? fallbackName : name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        interest: interest.trim() || undefined,
        message: message.trim() || undefined,
        consent: true,
      });
      setSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      // apiFetch wraps non-2xx as `API <status>: <body>` — sniff for 429.
      if (msg.includes('API 429')) {
        setErrorMsg(t.rateLimited);
      } else {
        setErrorMsg(t.error);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          style={styles.kavRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <View style={[styles.sheet, { backgroundColor: theme.bg[1] }]}>
            <View style={[styles.handleBar, { backgroundColor: theme.line.firm }]} />
            <View style={styles.headerRow}>
              <Text style={[styles.title, { color: theme.ink[100] }]}>
                {t.title}
              </Text>
              <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
                <X size={20} color={theme.ink[300]} />
              </Pressable>
            </View>

            {success ? (
              <View style={styles.successWrap}>
                <View style={[styles.successCheck, { backgroundColor: copper[500] }]}>
                  <Check size={28} color="#FFFFFF" />
                </View>
                <Text style={[styles.successText, { color: theme.ink[100] }]}>
                  {t.success}
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                automaticallyAdjustKeyboardInsets
              >
                {useCustom ? (
                  // M1 — Owner-defined fields. We map each configured field
                  // back onto our existing name/email/message state so the
                  // submit handler stays stable. Phone / company / interest
                  // never appear in the custom shape (intentional v0 scope).
                  <>
                    {(contactForm?.fields ?? []).map((f) => {
                      if (f.key === 'message') {
                        return (
                          <View key="message" style={styles.fieldWrap}>
                            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
                              {f.label}{f.required ? ' *' : ''}
                            </Text>
                            <TextInput
                              style={[
                                styles.input,
                                styles.multiline,
                                {
                                  color: theme.ink[100],
                                  borderColor: theme.line.DEFAULT,
                                  backgroundColor: theme.bg[2],
                                },
                              ]}
                              value={message}
                              onChangeText={(v) => setMessage(v.slice(0, MESSAGE_MAX))}
                              placeholderTextColor={theme.ink[500]}
                              multiline
                              numberOfLines={4}
                              maxLength={MESSAGE_MAX}
                              textAlignVertical="top"
                            />
                            <Text style={[styles.charCounter, { color: theme.ink[400] }]}>
                              {message.length}/{MESSAGE_MAX}
                            </Text>
                          </View>
                        );
                      }
                      const isEmail = f.key === 'email';
                      return (
                        <Field
                          key={f.key}
                          label={f.label}
                          required={f.required}
                          value={isEmail ? email : name}
                          onChange={isEmail ? setEmail : setName}
                          keyboardType={isEmail ? 'email-address' : undefined}
                        />
                      );
                    })}
                  </>
                ) : (
                  <>
                    <Field
                      label={t.nameLabel}
                      required
                      value={name}
                      onChange={setName}
                      placeholder={t.namePlaceholder}
                    />
                    <Field
                      label={t.emailLabel}
                      value={email}
                      onChange={setEmail}
                      placeholder={t.emailPlaceholder}
                      keyboardType="email-address"
                    />
                    <Field
                      label={t.phoneLabel}
                      value={phone}
                      onChange={setPhone}
                      placeholder={t.phonePlaceholder}
                      keyboardType="phone-pad"
                    />
                    <Field
                      label={t.companyLabel}
                      value={company}
                      onChange={setCompany}
                      placeholder={t.companyPlaceholder}
                    />
                    <Field
                      label={t.interestLabel}
                      value={interest}
                      onChange={setInterest}
                      placeholder={t.interestPlaceholder}
                    />

                    <View style={styles.fieldWrap}>
                      <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
                        {t.messageLabel}
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          styles.multiline,
                          {
                            color: theme.ink[100],
                            borderColor: theme.line.DEFAULT,
                            backgroundColor: theme.bg[2],
                          },
                        ]}
                        value={message}
                        onChangeText={(v) => setMessage(v.slice(0, MESSAGE_MAX))}
                        placeholder={t.messagePlaceholder}
                        placeholderTextColor={theme.ink[500]}
                        multiline
                        numberOfLines={4}
                        maxLength={MESSAGE_MAX}
                        textAlignVertical="top"
                      />
                      <Text style={[styles.charCounter, { color: theme.ink[400] }]}>
                        {message.length}/{MESSAGE_MAX}
                      </Text>
                    </View>
                  </>
                )}

                <Pressable
                  onPress={() => setConsent((c) => !c)}
                  style={[styles.consentRow, { borderColor: theme.line.DEFAULT }]}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: consent ? copper[500] : theme.line.firm,
                        backgroundColor: consent ? copper[500] : 'transparent',
                      },
                    ]}
                  >
                    {consent ? <Check size={14} color="#FFFFFF" /> : null}
                  </View>
                  <Text style={[styles.consentText, { color: theme.ink[200] }]}>
                    {t.consent}
                  </Text>
                </Pressable>

                {errorMsg ? (
                  <Text style={[styles.errorText, { color: theme.signalErr }]}>{errorMsg}</Text>
                ) : null}

                <Pressable
                  onPress={() => void handleSubmit()}
                  disabled={!canSubmit}
                  style={[
                    styles.submitBtn,
                    {
                      backgroundColor: canSubmit ? copper[500] : theme.bg[2],
                      opacity: canSubmit ? 1 : 0.6,
                    },
                  ]}
                >
                  {sending ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitBtnText}>
                      {sending
                        ? t.sending
                        : useCustom && contactForm?.submitLabel
                          ? contactForm.submitLabel
                          : t.send}
                    </Text>
                  )}
                </Pressable>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// Inline single-line input row — small enough that DRY-ing it isn't worth
// pulling into the wider design system; matches CardFormSections styling.
function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'email-address' | 'phone-pad';
  required?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
        {label}{required ? ' *' : ''}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.ink[100],
            borderColor: theme.line.DEFAULT,
            backgroundColor: theme.bg[2],
          },
        ]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.ink[500]}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={keyboardType ? 'none' : 'words'}
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  kavRoot: { width: '100%' },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    maxHeight: '92%',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '700' },
  closeBtn: { padding: 4 },
  scroll: { flexGrow: 0 },
  scrollContent: { gap: 14, paddingBottom: 8 },
  fieldWrap: { gap: 6 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  multiline: { minHeight: 96 },
  charCounter: { fontSize: 11, textAlign: 'right' },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  consentText: { flex: 1, fontSize: 13, lineHeight: 18 },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: -4,
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  successWrap: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 16,
  },
  successCheck: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
});
