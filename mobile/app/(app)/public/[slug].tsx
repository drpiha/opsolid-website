import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Linking,
  Alert,
  Share,
  StyleSheet,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  Bookmark,
  BookmarkCheck,
  Mail,
  Phone,
  Globe,
  QrCode,
  Share2,
  ExternalLink,
  MapPin,
  MessageCircle,
  Calendar,
  Play,
  Briefcase,
  Camera,
  Video,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { getPublicCard } from '../../../src/lib/api/discover';
import { saveCard, unsaveCard, checkSaved } from '../../../src/lib/api/contacts';
import { saveCardToDeviceContacts } from '../../../src/lib/contacts/native';
import type { ApiCard } from '../../../src/lib/api/types';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { copper } from '../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { API_BASE } from '../../../src/lib/api/client';
import { Button } from '../../../src/components/ui/Button';
import { QrCodeModal } from '../../../src/components/cards/QrCodeModal';

type ServiceItem = { title: string; description?: string; price?: string };
type CustomButton = { label: string; url: string };
type FaqItem = { question: string; answer: string };
type Socials = {
  linkedin?: string;
  instagram?: string;
  x?: string;
  tiktok?: string;
  youtube?: string;
  github?: string;
  facebook?: string;
  xing?: string;
};

const SOCIAL_KEYS: (keyof Socials)[] = [
  'linkedin',
  'instagram',
  'x',
  'tiktok',
  'youtube',
  'github',
  'facebook',
  'xing',
];

function pickString(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

function pickServices(v: unknown): ServiceItem[] {
  if (!Array.isArray(v)) return [];
  const out: ServiceItem[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') continue;
    const o = raw as Record<string, unknown>;
    const title = pickString(o.title);
    if (!title) continue;
    out.push({
      title,
      description: pickString(o.description),
      price: pickString(o.price),
    });
    if (out.length >= 12) break;
  }
  return out;
}

function pickFaqs(v: unknown): FaqItem[] {
  if (!Array.isArray(v)) return [];
  const out: FaqItem[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') continue;
    const o = raw as Record<string, unknown>;
    const question = pickString(o.question);
    const answer = pickString(o.answer);
    if (!question || !answer) continue;
    out.push({ question, answer });
    if (out.length >= 12) break;
  }
  return out;
}

function pickButtons(v: unknown): CustomButton[] {
  if (!Array.isArray(v)) return [];
  const out: CustomButton[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') continue;
    const o = raw as Record<string, unknown>;
    const label = pickString(o.label);
    const url = pickString(o.url);
    if (!label || !url) continue;
    out.push({ label, url });
    if (out.length >= 4) break;
  }
  return out;
}

function pickSocials(v: unknown): Socials {
  if (!v || typeof v !== 'object') return {};
  const o = v as Record<string, unknown>;
  const out: Socials = {};
  for (const k of SOCIAL_KEYS) {
    const u = pickString(o[k]);
    if (u) out[k] = u;
  }
  return out;
}

// lucide-react-native v1 dropped brand icons (Linkedin, Instagram, Twitter,
// YouTube, Github, Facebook), so we render the social row with semantically
// related generic icons + a label underneath. The label disambiguates the
// network for the user without us shipping custom brand SVGs.
function socialIcon(key: keyof Socials, color: string) {
  const size = 20;
  switch (key) {
    case 'instagram':
    case 'tiktok':
      return <Camera size={size} color={color} />;
    case 'youtube':
      return <Video size={size} color={color} />;
    case 'linkedin':
    case 'xing':
      return <Briefcase size={size} color={color} />;
    case 'github':
    case 'facebook':
    case 'x':
    default:
      return <ExternalLink size={size} color={color} />;
  }
}

function socialLabel(key: keyof Socials): string {
  switch (key) {
    case 'linkedin':
      return 'LinkedIn';
    case 'instagram':
      return 'Instagram';
    case 'x':
      return 'X';
    case 'tiktok':
      return 'TikTok';
    case 'youtube':
      return 'YouTube';
    case 'github':
      return 'GitHub';
    case 'facebook':
      return 'Facebook';
    case 'xing':
      return 'Xing';
  }
}

export default function PublicCardScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const theme = useTheme();
  const t = useTranslations(detectLocale()).publicCard;

  const [card, setCard] = useState<ApiCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());

  function toggleFaq(idx: number) {
    setExpandedFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  useEffect(() => {
    if (!slug) return;
    void loadCard(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function loadCard(s: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicCard(s);
      setCard(res.card);
      // Check save status silently — may fail if own card
      try {
        const saveStatus = await checkSaved(s);
        setSaved(saveStatus.saved);
      } catch {
        // ignore — own card or unauthenticated
      }
    } catch {
      setError(t.errorLoad);
    } finally {
      setLoading(false);
    }
  }

  async function toggleSave() {
    if (!slug || !card) return;
    setSaving(true);
    try {
      if (saved) {
        await unsaveCard(slug);
        setSaved(false);
      } else {
        await saveCard(slug);
        setSaved(true);
        // Mirror to device Contacts so the user can find this person from
        // their phone's Contacts app — server save alone isn't enough for
        // people who reach out via the dialer or default messaging app.
        const result = await saveCardToDeviceContacts(card);
        if (result === 'saved') {
          Alert.alert('', t.contactsSaved);
        } else if (result === 'denied') {
          Alert.alert('', t.contactsDenied);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('cannot_save_own_card')) {
        // silently ignore
      } else {
        Alert.alert('', t.errorLoad);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
        <Stack.Screen options={{ title: '' }} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={copper[500]} />
        </View>
      </View>
    );
  }

  if (error || !card) {
    return (
      <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
        <Stack.Screen options={{ title: '' }} />
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: '#B8514B' }]}>{error ?? t.errorLoad}</Text>
          <Button
            label={t.retry}
            onPress={() => slug && void loadCard(slug)}
            variant="secondary"
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    );
  }

  const data = card.cardData as Record<string, unknown>;
  const name = pickString(data.name) ?? slug ?? '';
  const title = pickString(data.title);
  const position = pickString(data.position);
  const company = pickString(data.company);
  const email = pickString(data.email);
  const phone = pickString(data.phone);
  const bio = pickString(data.bio);
  const whatsapp = pickString(data.whatsapp);
  const website = pickString(data.website);
  const address = pickString(data.address);
  const bookingUrl = pickString(data.bookingUrl);
  const videoUrl = pickString(data.videoUrl) ?? card.videoUrl ?? undefined;
  const socials = pickSocials(data.socials);
  const services = pickServices(data.services);
  const customButtons = pickButtons(data.customButtons);
  const faqs = pickFaqs(data.faqs);

  const photoUri = card.photoPath
    ? card.photoPath.startsWith('http')
      ? card.photoPath
      : `${API_BASE}${card.photoPath}`
    : null;

  const socialEntries = SOCIAL_KEYS
    .map((k) => ({ key: k, url: socials[k] }))
    .filter((s): s is { key: keyof Socials; url: string } => !!s.url);

  async function handleShareCard() {
    if (!card?.slug) return;
    const url = `https://opsolid.de/c/${card.slug}`;
    try {
      await Share.share({
        message: `${name} — ${url}`,
        url,
      });
    } catch {
      // user cancelled — silent
    }
  }

  function openMaps(addr: string) {
    void Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`,
    );
  }

  function openWhatsapp(num: string) {
    const digits = num.replace(/\D/g, '');
    if (!digits) return;
    void Linking.openURL(`https://wa.me/${digits}`);
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.bg[0] }]}>
      <Stack.Screen
        options={{
          title: name,
          headerRight: () => (
            <View style={styles.headerActions}>
              {card.slug ? (
                <Pressable
                  onPress={() => setQrOpen(true)}
                  style={styles.headerBtn}
                  hitSlop={8}
                >
                  <QrCode size={22} color={copper[500]} />
                </Pressable>
              ) : null}
              <Pressable
                onPress={() => void toggleSave()}
                disabled={saving}
                style={styles.headerBtn}
                hitSlop={8}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={copper[500]} />
                ) : saved ? (
                  <BookmarkCheck size={22} color={copper[500]} />
                ) : (
                  <Bookmark size={22} color={copper[500]} />
                )}
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.photoWrap, { backgroundColor: theme.bg[2] }]}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <Text style={[styles.photoInitial, { color: theme.ink[300] }]}>
                {name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          <Text style={[styles.name, { color: theme.ink[100] }]}>{name}</Text>

          {title ? (
            <Text style={[styles.jobTitle, { color: theme.ink[300] }]}>{title}</Text>
          ) : null}

          {position && position !== title ? (
            <Text style={[styles.jobTitle, { color: theme.ink[400] }]}>{position}</Text>
          ) : null}

          {company ? (
            <View style={[styles.companyBadge, { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT }]}>
              <Text style={[styles.companyText, { color: theme.ink[400] }]}>{company}</Text>
            </View>
          ) : null}
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.line.DEFAULT }]} />

        {/* Contact */}
        {(email || phone) && (
          <View style={[styles.section, { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT }]}>
            {email && (
              <Pressable
                onPress={() => void Linking.openURL(`mailto:${email}`)}
                style={[styles.contactRow, { borderBottomColor: phone ? theme.line.DEFAULT : 'transparent' }]}
              >
                <View style={[styles.contactIcon, { backgroundColor: theme.bg[2] }]}>
                  <Mail size={16} color={copper[500]} />
                </View>
                <Text style={[styles.contactLabel, { color: theme.ink[100] }]}>{email}</Text>
              </Pressable>
            )}
            {phone && (
              <Pressable
                onPress={() => void Linking.openURL(`tel:${phone}`)}
                style={styles.contactRow}
              >
                <View style={[styles.contactIcon, { backgroundColor: theme.bg[2] }]}>
                  <Phone size={16} color={copper[500]} />
                </View>
                <Text style={[styles.contactLabel, { color: theme.ink[100] }]}>{phone}</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Web link */}
        {card.slug && (
          <Pressable
            onPress={() => void Linking.openURL(`https://opsolid.de/c/${card.slug}`)}
            style={[styles.webRow, { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT }]}
          >
            <Globe size={16} color={theme.ink[400]} />
            <Text style={[styles.webLabel, { color: theme.ink[400] }]}>
              opsolid.de/c/{card.slug}
            </Text>
          </Pressable>
        )}

        {/* Share card pressable */}
        {card.slug ? (
          <Pressable
            onPress={() => void handleShareCard()}
            style={[styles.shareRow, { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT }]}
          >
            <Share2 size={16} color={copper[500]} />
            <Text style={[styles.shareRowLabel, { color: theme.ink[100] }]}>{t.shareCard}</Text>
          </Pressable>
        ) : null}

        {/* Bio */}
        {bio ? (
          <View style={styles.bioWrap}>
            <Text style={[styles.bio, { color: theme.ink[200] }]}>{bio}</Text>
          </View>
        ) : null}

        {/* Socials */}
        {socialEntries.length > 0 ? (
          <View style={styles.socialRow}>
            {socialEntries.map((s) => (
              <Pressable
                key={s.key}
                onPress={() => void Linking.openURL(s.url)}
                style={[
                  styles.socialBtn,
                  { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
                ]}
                hitSlop={6}
                accessibilityLabel={socialLabel(s.key)}
              >
                {socialIcon(s.key, copper[500])}
                <Text style={[styles.socialLabel, { color: theme.ink[400] }]}>
                  {socialLabel(s.key)}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {/* WhatsApp */}
        {whatsapp ? (
          <Pressable
            onPress={() => openWhatsapp(whatsapp)}
            style={[styles.actionRow, { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT }]}
          >
            <View style={[styles.contactIcon, { backgroundColor: theme.bg[2] }]}>
              <MessageCircle size={16} color={copper[500]} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.ink[100] }]}>{t.whatsapp}</Text>
          </Pressable>
        ) : null}

        {/* Website */}
        {website ? (
          <Pressable
            onPress={() => void Linking.openURL(website)}
            style={[styles.actionRow, { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT }]}
          >
            <View style={[styles.contactIcon, { backgroundColor: theme.bg[2] }]}>
              <Globe size={16} color={copper[500]} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.ink[100] }]}>{t.website}</Text>
          </Pressable>
        ) : null}

        {/* Booking CTA */}
        {bookingUrl ? (
          <View style={styles.ctaWrap}>
            <Pressable
              onPress={() => void Linking.openURL(bookingUrl)}
              style={[styles.bookCta, { backgroundColor: copper[500] }]}
            >
              <Calendar size={18} color="#fff" />
              <Text style={styles.bookCtaText}>{t.requestMeeting}</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Video */}
        {videoUrl ? (
          <Pressable
            onPress={() => void Linking.openURL(videoUrl)}
            style={[styles.actionRow, { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT }]}
          >
            <View style={[styles.contactIcon, { backgroundColor: theme.bg[2] }]}>
              <Play size={16} color={copper[500]} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.ink[100] }]}>{t.watchVideo}</Text>
          </Pressable>
        ) : null}

        {/* Services */}
        {services.length > 0 ? (
          <View style={styles.blockWrap}>
            <Text style={[styles.blockHeading, { color: theme.ink[300] }]}>{t.services}</Text>
            <View style={[styles.section, { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT }]}>
              {services.map((svc, i) => (
                <View
                  key={`${svc.title}-${i}`}
                  style={[
                    styles.serviceRow,
                    {
                      borderBottomColor:
                        i < services.length - 1 ? theme.line.DEFAULT : 'transparent',
                    },
                  ]}
                >
                  <View style={styles.serviceHeader}>
                    <Text style={[styles.serviceTitle, { color: theme.ink[100] }]}>
                      {svc.title}
                    </Text>
                    {svc.price ? (
                      <Text style={[styles.servicePrice, { color: copper[500] }]}>
                        {svc.price}
                      </Text>
                    ) : null}
                  </View>
                  {svc.description ? (
                    <Text style={[styles.serviceDesc, { color: theme.ink[400] }]}>
                      {svc.description}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Custom buttons */}
        {customButtons.length > 0 ? (
          <View style={styles.customBtnWrap}>
            {customButtons.map((btn, i) => (
              <Button
                key={`${btn.label}-${i}`}
                label={btn.label}
                onPress={() => void Linking.openURL(btn.url)}
                variant="secondary"
                style={i > 0 ? { marginTop: 10 } : undefined}
              />
            ))}
          </View>
        ) : null}

        {/* FAQs accordion */}
        {faqs.length > 0 ? (
          <View style={styles.blockWrap}>
            <Text style={[styles.blockHeading, { color: theme.ink[300] }]}>{t.faqs}</Text>
            <View style={[styles.section, { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT }]}>
              {faqs.map((faq, i) => {
                const open = expandedFaqs.has(i);
                return (
                  <View
                    key={`${faq.question}-${i}`}
                    style={{
                      borderBottomWidth: i < faqs.length - 1 ? StyleSheet.hairlineWidth : 0,
                      borderBottomColor: theme.line.DEFAULT,
                    }}
                  >
                    <Pressable
                      onPress={() => toggleFaq(i)}
                      style={styles.faqQuestionRow}
                    >
                      <Text
                        style={[styles.faqQuestion, { color: theme.ink[100] }]}
                        numberOfLines={open ? undefined : 2}
                      >
                        {faq.question}
                      </Text>
                      {open ? (
                        <ChevronUp size={18} color={theme.ink[400]} />
                      ) : (
                        <ChevronDown size={18} color={theme.ink[400]} />
                      )}
                    </Pressable>
                    {open ? (
                      <Text style={[styles.faqAnswer, { color: theme.ink[300] }]}>
                        {faq.answer}
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {/* Address */}
        {address ? (
          <View style={styles.blockWrap}>
            <Text style={[styles.blockHeading, { color: theme.ink[300] }]}>{t.address}</Text>
            <Pressable
              onPress={() => openMaps(address)}
              style={[styles.actionRow, { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT }]}
            >
              <View style={[styles.contactIcon, { backgroundColor: theme.bg[2] }]}>
                <MapPin size={16} color={copper[500]} />
              </View>
              <Text style={[styles.actionLabel, { color: theme.ink[100] }]} numberOfLines={3}>
                {address}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Save CTA */}
        <View style={styles.saveRow}>
          <Pressable
            onPress={() => void toggleSave()}
            disabled={saving}
            style={[
              styles.saveCta,
              saved
                ? { backgroundColor: theme.bg[1], borderWidth: 1, borderColor: copper[500] }
                : { backgroundColor: copper[500] },
            ]}
          >
            {saving ? (
              <ActivityIndicator size="small" color={saved ? copper[500] : '#fff'} />
            ) : (
              <Text style={[styles.saveCtaText, { color: saved ? copper[500] : '#fff' }]}>
                {saved ? t.saved : t.save}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {card.slug ? (
        <QrCodeModal
          visible={qrOpen}
          slug={card.slug}
          onClose={() => setQrOpen(false)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { fontSize: 16, textAlign: 'center' },
  scroll: { paddingBottom: 40 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  headerBtn: { paddingRight: 4 },
  hero: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    gap: 8,
  },
  photoWrap: {
    width: 100,
    height: 100,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  photo: { width: 100, height: 100 },
  photoInitial: { fontSize: 38, fontWeight: '600' },
  name: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  jobTitle: { fontSize: 15, textAlign: 'center' },
  companyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 4,
  },
  companyText: { fontSize: 13, fontWeight: '500' },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 24, marginBottom: 20 },
  section: {
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactLabel: { fontSize: 15, flex: 1 },
  webRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
  },
  webLabel: { fontSize: 13 },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
  },
  shareRowLabel: { fontSize: 14, fontWeight: '500' },
  bioWrap: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  bio: { fontSize: 15, lineHeight: 22 },
  socialRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  socialBtn: {
    minWidth: 80,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  socialLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
  },
  actionLabel: { fontSize: 15, flex: 1 },
  ctaWrap: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  bookCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
  },
  bookCtaText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  blockWrap: {
    marginTop: 8,
    marginBottom: 4,
  },
  blockHeading: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  serviceRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  serviceTitle: { fontSize: 15, fontWeight: '600', flex: 1 },
  servicePrice: { fontSize: 14, fontWeight: '600' },
  serviceDesc: { fontSize: 13, lineHeight: 18 },
  customBtnWrap: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  saveRow: { paddingHorizontal: 16, marginTop: 16 },
  saveCta: {
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveCtaText: { fontSize: 15, fontWeight: '600' },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  faqQuestion: { fontSize: 15, fontWeight: '600', flex: 1 },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
});
