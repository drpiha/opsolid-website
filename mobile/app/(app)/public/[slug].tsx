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
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
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
  BadgeAlert,
  Send,
  Star,
  MessageSquare,
  X,
  Plus,
} from 'lucide-react-native';
import { getPublicCard } from '../../../src/lib/api/discover';
import { listCards } from '../../../src/lib/api/cards';
import { saveCard, unsaveCard, checkSaved } from '../../../src/lib/api/contacts';
import { saveCardToDeviceContacts } from '../../../src/lib/contacts/native';
import { sendCardExchange, getFeedbackAggregate } from '../../../src/lib/api/crm';
import type { FeedbackAggregate } from '../../../src/lib/api/crm';
import { logShareEvent, type ShareChannel } from '../../../src/lib/api/share-events';
import type { ApiCard } from '../../../src/lib/api/types';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import type { ThemeTokens } from '../../../src/lib/theme/tokens';
import { copper } from '../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';
import { useAuthStore } from '../../../src/lib/auth/store';
import { useContactsRefreshStore } from '../../../src/store/contactsRefreshStore';
import { API_BASE } from '../../../src/lib/api/client';
import { Button } from '../../../src/components/ui/Button';
import { QrCodeModal } from '../../../src/components/cards/QrCodeModal';
import { LeadFormModal } from '../../../src/components/cards/LeadFormModal';
import {
  FeedbackModal,
  FeedbackBreakdownModal,
} from '../../../src/components/cards/FeedbackModal';

type ServiceItem = { title: string; description?: string; price?: string };
type CustomButton = { label: string; url: string };
type FaqItem = { question: string; answer: string };
type GalleryItem = { src: string; alt?: string };
type EmbedKind = 'youtube' | 'vimeo' | 'spotify' | 'soundcloud' | 'calendly';
type EmbedItem = { kind: EmbedKind; url: string };
type StatusBannerTone = 'info' | 'success' | 'warn' | 'announce';
type StatusBanner = { enabled: boolean; text: string; tone: StatusBannerTone };
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

function pickGallery(v: unknown): GalleryItem[] {
  if (!Array.isArray(v)) return [];
  const out: GalleryItem[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') continue;
    const o = raw as Record<string, unknown>;
    const src = pickString(o.src);
    if (!src) continue;
    out.push({ src, alt: pickString(o.alt) });
    if (out.length >= 24) break;
  }
  return out;
}

const EMBED_KINDS: EmbedKind[] = [
  'youtube',
  'vimeo',
  'spotify',
  'soundcloud',
  'calendly',
];

function pickEmbeds(v: unknown): EmbedItem[] {
  if (!Array.isArray(v)) return [];
  const out: EmbedItem[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') continue;
    const o = raw as Record<string, unknown>;
    const kindRaw = typeof o.kind === 'string' ? o.kind : '';
    const url = pickString(o.url);
    if (!url) continue;
    if (!(EMBED_KINDS as string[]).includes(kindRaw)) continue;
    out.push({ kind: kindRaw as EmbedKind, url });
    if (out.length >= 3) break;
  }
  return out;
}

function embedThumbnail(item: EmbedItem): string | null {
  // Cheap heuristic: derive a thumbnail URL from the canonical share URLs.
  // Failing to match returns null and the renderer falls back to a flat tile.
  try {
    const u = new URL(item.url);
    if (item.kind === 'youtube') {
      // youtu.be/<id> or youtube.com/watch?v=<id> or shorts/<id>
      let id: string | null = null;
      if (u.hostname.includes('youtu.be')) {
        id = u.pathname.replace(/^\//, '').split('/')[0] || null;
      } else if (u.searchParams.has('v')) {
        id = u.searchParams.get('v');
      } else if (u.pathname.startsWith('/shorts/')) {
        id = u.pathname.split('/shorts/')[1]?.split('/')[0] ?? null;
      } else if (u.pathname.startsWith('/embed/')) {
        id = u.pathname.split('/embed/')[1]?.split('/')[0] ?? null;
      }
      if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    }
    // No thumbnail oracle for vimeo / spotify / soundcloud / calendly without
    // an extra round-trip — we render the kind label instead.
    return null;
  } catch {
    return null;
  }
}

function embedDisplayLabel(kind: EmbedKind): string {
  switch (kind) {
    case 'youtube':
      return 'YouTube';
    case 'vimeo':
      return 'Vimeo';
    case 'spotify':
      return 'Spotify';
    case 'soundcloud':
      return 'SoundCloud';
    case 'calendly':
      return 'Calendly';
  }
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

const STATUS_BANNER_TONES = ['info', 'success', 'warn', 'announce'] as const;

function pickStatusBanner(v: unknown): StatusBanner | null {
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  const text = pickString(o.text);
  if (!text) return null;
  // enabled defaults to true when the key is missing — owners who set a
  // banner text without explicitly setting `enabled` expect it to show.
  const enabled = o.enabled === false ? false : true;
  if (!enabled) return null;
  const toneRaw = typeof o.tone === 'string' ? o.tone : 'info';
  const tone: StatusBannerTone = (STATUS_BANNER_TONES as readonly string[]).includes(toneRaw)
    ? (toneRaw as StatusBannerTone)
    : 'info';
  return { enabled, text: text.slice(0, 200), tone };
}

// Average all 7 category averages into a single overall score, rounded to
// one decimal. Categories with 0 (no submissions for that category, which
// shouldn't normally happen but is defensively handled) are excluded.
function aggregateMean(averages: Record<string, number>): number {
  const vals = Object.values(averages).filter((v) => typeof v === 'number' && v > 0);
  if (vals.length === 0) return 0;
  const m = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(m * 10) / 10;
}

function statusBannerStyle(tone: StatusBannerTone, theme: ThemeTokens): {
  bg: string;
  border: string;
} {
  switch (tone) {
    case 'success':
      return { bg: 'rgba(127, 178, 134, 0.15)', border: 'rgba(127, 178, 134, 0.35)' };
    case 'warn':
      return { bg: 'rgba(212, 162, 58, 0.15)', border: 'rgba(212, 162, 58, 0.35)' };
    case 'announce':
      return { bg: 'rgba(127, 221, 228, 0.20)', border: 'rgba(127, 221, 228, 0.40)' };
    case 'info':
    default:
      return { bg: theme.bg[2], border: theme.line.DEFAULT };
  }
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
  const locale = detectLocale();
  const t = useTranslations(locale).publicCard;
  const tCrm = useTranslations(locale).crm;

  const authUser = useAuthStore((s) => s.user);
  const isAuthenticated = !!authUser;
  const router = useRouter();

  const [card, setCard] = useState<ApiCard | null>(null);
  // M3 — gallery lightbox state. Index of the currently-displayed image, or
  // null when the lightbox is closed.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());

  // Sprint 5 — CRM state. The lead form is open to anonymous visitors; the
  // exchange button + feedback widget are owner-action features that require
  // the visitor to have their own published card / be logged in.
  const [leadOpen, setLeadOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [feedbackAggregate, setFeedbackAggregate] = useState<FeedbackAggregate | null>(null);
  // The current user's first published card — used for Smart Exchange. If
  // the user owns no PUBLISHED cards, the exchange button stays hidden.
  const [ownPublishedCard, setOwnPublishedCard] = useState<ApiCard | null>(null);
  const [exchanging, setExchanging] = useState(false);

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

  // Prefetch the public feedback aggregate. The endpoint always returns 200
  // (with enabled:false when the toggle is off), so we don't need to gate
  // this on anything other than the slug.
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    void getFeedbackAggregate(slug)
      .then((agg) => {
        if (!cancelled) setFeedbackAggregate(agg);
      })
      .catch(() => {
        // Network or 5xx — leave aggregate null; the entry button + row both
        // gate on `enabled === true`, so this just means no widget shows.
        if (!cancelled) setFeedbackAggregate(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Look up the visitor's own published cards once. We pull a small page and
  // pick the first PUBLISHED card to use as visitorSlug for the exchange POST.
  // Only authenticated users have any cards, so we short-circuit otherwise.
  useEffect(() => {
    if (!isAuthenticated) {
      setOwnPublishedCard(null);
      return;
    }
    let cancelled = false;
    void listCards({ limit: 20 })
      .then((res) => {
        if (cancelled) return;
        const published = res.items.find(
          (c) => c.status === 'PUBLISHED' && !!c.slug,
        );
        setOwnPublishedCard(published ?? null);
      })
      .catch(() => {
        // Don't surface — the exchange button just stays hidden.
        if (!cancelled) setOwnPublishedCard(null);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

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
        // Hint to the Contacts tab that its list is now stale. The tab also
        // refetches on every focus, so this is belt-and-braces.
        useContactsRefreshStore.getState().markDirty();
      } else {
        await saveCard(slug);
        setSaved(true);
        useContactsRefreshStore.getState().markDirty();
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

  async function handleSmartExchange() {
    if (!slug || !ownPublishedCard?.slug || exchanging) return;
    const ownName =
      pickString((ownPublishedCard.cardData as Record<string, unknown>)?.name) ??
      ownPublishedCard.slug;
    Alert.alert(
      tCrm.exchange.confirmTitle,
      tCrm.exchange.confirmBody.replace('{name}', ownName),
      [
        { text: tCrm.exchange.cancel, style: 'cancel' },
        {
          text: tCrm.exchange.confirmSend,
          onPress: () => {
            setExchanging(true);
            void sendCardExchange(slug, { visitorSlug: ownPublishedCard.slug! })
              .then(() => {
                Alert.alert('', tCrm.exchange.success);
              })
              .catch((err) => {
                const msg = err instanceof Error ? err.message : '';
                if (msg.includes('existing')) {
                  Alert.alert('', tCrm.exchange.existing);
                } else {
                  Alert.alert('', tCrm.exchange.error);
                }
              })
              .finally(() => setExchanging(false));
          },
        },
      ],
    );
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
  const statusBanner = pickStatusBanner(data.statusBanner);
  // M3 — gallery + curated embeds (Carrd amendments).
  const gallery = pickGallery(data.gallery);
  const embeds = pickEmbeds(data.embeds);

  // Visiting your own card? Compare the viewing slug to the cached own
  // published-card slug. The exchange + feedback features are gated on this
  // because the server hard-rejects self-exchange and self-review.
  const isOwnCard = !!ownPublishedCard?.slug && ownPublishedCard.slug === card.slug;
  const showSmartExchange = !!ownPublishedCard?.slug && !isOwnCard;
  const showFeedbackButton =
    isAuthenticated && !isOwnCard && feedbackAggregate?.enabled === true;
  const aggregateAverage = feedbackAggregate && feedbackAggregate.count > 0
    ? aggregateMean(feedbackAggregate.averages)
    : null;

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
      // M3 — share telemetry. Fire-and-forget: never block the share gesture
      // on a network failure or auth lapse.
      fireShareEvent('native_share');
    } catch {
      // user cancelled — silent
    }
  }

  function fireShareEvent(channel: ShareChannel) {
    if (!card?.id || !isAuthenticated) return;
    void logShareEvent(card.id, channel).catch(() => {
      // Telemetry must never surface — share gestures are the user's path.
    });
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
                  onPress={() => {
                    fireShareEvent('qr');
                    setQrOpen(true);
                  }}
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
        {/* Status banner — owner-set "Out of office" / "Now booking" line.
            Renders only when enabled and tone-tinted to match the four
            supported moods. Sits ABOVE the hero so it's the first thing
            visitors see. */}
        {statusBanner ? (() => {
          const toneStyle = statusBannerStyle(statusBanner.tone, theme);
          return (
            <View
              style={[
                styles.statusBanner,
                { backgroundColor: toneStyle.bg, borderColor: toneStyle.border },
              ]}
            >
              <BadgeAlert size={16} color={theme.ink[200]} />
              <Text
                style={[styles.statusBannerText, { color: theme.ink[100] }]}
                numberOfLines={3}
              >
                {statusBanner.text}
              </Text>
            </View>
          );
        })() : null}

        {/* Feedback aggregate — only when the card has feedback enabled AND
            at least one rating has been submitted. Tap to open per-category
            breakdown. */}
        {feedbackAggregate?.enabled && feedbackAggregate.count > 0 && aggregateAverage ? (
          <Pressable
            onPress={() => setBreakdownOpen(true)}
            style={[
              styles.aggregateRow,
              { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
            ]}
          >
            <Star size={14} color={copper[500]} fill={copper[500]} />
            <Text style={[styles.aggregateText, { color: theme.ink[100] }]}>
              {(feedbackAggregate.count === 1
                ? tCrm.feedback.aggregateOne
                : tCrm.feedback.aggregate
              )
                .replace('{rating}', aggregateAverage.toFixed(1))
                .replace('{count}', String(feedbackAggregate.count))}
            </Text>
          </Pressable>
        ) : null}

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
            onPress={() => {
              fireShareEvent('link');
              void Linking.openURL(`https://opsolid.de/c/${card.slug}`);
            }}
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

        {/* M3 — Curated embeds (Carrd amendment).
            Mobile renders each embed as a tappable thumbnail / labeled tile;
            tapping opens the source URL in expo-web-browser (no inline iframe
            in RN). The web public viewer renders the same data as a sandboxed
            iframe for the 5 whitelisted hosts. */}
        {embeds.length > 0 ? (
          <View style={styles.blockWrap}>
            <Text style={[styles.blockHeading, { color: theme.ink[300] }]}>
              {t.embeds}
            </Text>
            <View style={styles.embedsRow}>
              {embeds.map((em, i) => {
                const thumb = embedThumbnail(em);
                return (
                  <Pressable
                    key={`${em.kind}-${i}-${em.url}`}
                    onPress={() => {
                      void WebBrowser.openBrowserAsync(em.url).catch(() => {
                        void Linking.openURL(em.url);
                      });
                    }}
                    style={[
                      styles.embedTile,
                      {
                        backgroundColor: theme.bg[2],
                        borderColor: theme.line.DEFAULT,
                      },
                    ]}
                  >
                    {thumb ? (
                      <Image
                        source={{ uri: thumb }}
                        style={styles.embedThumb}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.embedThumb}>
                        <Play size={28} color={copper[500]} />
                      </View>
                    )}
                    <Text
                      style={[styles.embedLabel, { color: theme.ink[200] }]}
                      numberOfLines={1}
                    >
                      {embedDisplayLabel(em.kind)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {/* M3 — Gallery with lightbox (Carrd amendment).
            Tapping any thumbnail opens the swipeable full-screen lightbox. */}
        {gallery.length > 0 ? (
          <View style={styles.blockWrap}>
            <Text style={[styles.blockHeading, { color: theme.ink[300] }]}>
              {t.gallery}
            </Text>
            <View style={styles.galleryRow}>
              {gallery.map((g, i) => {
                const uri = g.src.startsWith('http')
                  ? g.src
                  : `${API_BASE}${g.src}`;
                return (
                  <Pressable
                    key={`${g.src}-${i}`}
                    onPress={() => setLightboxIndex(i)}
                    style={[
                      styles.galleryThumb,
                      {
                        backgroundColor: theme.bg[2],
                        borderColor: theme.line.DEFAULT,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri }}
                      style={styles.galleryThumbImg}
                      resizeMode="cover"
                    />
                  </Pressable>
                );
              })}
            </View>
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

        {/* Lead form CTA — public, anonymous-friendly. Sits below Save so the
            primary "save card" path stays the loudest CTA on the screen. */}
        {!isOwnCard ? (
          <View style={styles.crmCtaRow}>
            <Pressable
              onPress={() => setLeadOpen(true)}
              style={[
                styles.crmCta,
                { backgroundColor: theme.bg[1], borderColor: copper[500] },
              ]}
            >
              <MessageSquare size={16} color={copper[500]} />
              <Text style={[styles.crmCtaText, { color: copper[500] }]}>
                {tCrm.lead.cta}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Smart Exchange — only when the visitor has their own published card
            and isn't viewing it. */}
        {showSmartExchange ? (
          <View style={styles.crmCtaRow}>
            <Pressable
              onPress={() => void handleSmartExchange()}
              disabled={exchanging}
              style={[
                styles.crmCta,
                { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
              ]}
            >
              {exchanging ? (
                <ActivityIndicator size="small" color={copper[500]} />
              ) : (
                <Send size={16} color={copper[500]} />
              )}
              <Text style={[styles.crmCtaText, { color: theme.ink[100] }]}>
                {tCrm.exchange.cta}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Feedback rating button — only when the card has feedbackEnabled,
            the user is logged in, and they're not viewing their own card. */}
        {showFeedbackButton ? (
          <View style={styles.crmCtaRow}>
            <Pressable
              onPress={() => setFeedbackOpen(true)}
              style={[
                styles.crmCta,
                { backgroundColor: theme.bg[1], borderColor: theme.line.DEFAULT },
              ]}
            >
              <Star size={16} color={copper[500]} />
              <Text style={[styles.crmCtaText, { color: theme.ink[100] }]}>
                {tCrm.feedback.cta}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      {card.slug ? (
        <QrCodeModal
          visible={qrOpen}
          slug={card.slug}
          onClose={() => setQrOpen(false)}
        />
      ) : null}

      {card.slug ? (
        <LeadFormModal
          visible={leadOpen}
          slug={card.slug}
          onClose={() => setLeadOpen(false)}
          // M1 — When the owner enabled a custom contact form, the public
          // viewer reads it from cardData. Public reads strip ESP secrets
          // server-side (toPublicApiCard) — only field shapes ride the wire.
          contactForm={
            (card.cardData as Record<string, unknown> | null)?.contactForm as
              | import('../../../src/lib/api/types').ContactFormConfig
              | undefined
          }
        />
      ) : null}

      {card.slug ? (
        <FeedbackModal
          visible={feedbackOpen}
          slug={card.slug}
          onClose={() => setFeedbackOpen(false)}
        />
      ) : null}

      {feedbackAggregate ? (
        <FeedbackBreakdownModal
          visible={breakdownOpen}
          averages={feedbackAggregate.averages}
          count={feedbackAggregate.count}
          onClose={() => setBreakdownOpen(false)}
        />
      ) : null}

      {/* M3 — Gallery lightbox. Modal + horizontal FlatList for swipe paging.
          Pinch-zoom is intentionally omitted (would require react-native-
          gesture-handler + reanimated PinchGestureHandler) — basic full-screen
          + swipe is sufficient for v1 per the spec. */}
      {gallery.length > 0 ? (
        <Modal
          visible={lightboxIndex !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setLightboxIndex(null)}
        >
          <View style={styles.lightboxRoot}>
            <Pressable
              onPress={() => setLightboxIndex(null)}
              style={styles.lightboxClose}
              hitSlop={12}
              accessibilityLabel="Close"
            >
              <X size={24} color="#FFFFFF" />
            </Pressable>
            {lightboxIndex !== null ? (
              <FlatList
                horizontal
                pagingEnabled
                data={gallery}
                keyExtractor={(g, i) => `${g.src}-${i}`}
                initialScrollIndex={lightboxIndex}
                getItemLayout={(_, idx) => ({
                  length: Dimensions.get('window').width,
                  offset: Dimensions.get('window').width * idx,
                  index: idx,
                })}
                renderItem={({ item }) => {
                  const uri = item.src.startsWith('http')
                    ? item.src
                    : `${API_BASE}${item.src}`;
                  return (
                    <View style={styles.lightboxPage}>
                      <Image
                        source={{ uri }}
                        style={styles.lightboxImage}
                        resizeMode="contain"
                      />
                    </View>
                  );
                }}
                showsHorizontalScrollIndicator={false}
              />
            ) : null}
          </View>
        </Modal>
      ) : null}

      {/* M3 — "Create your own card" floating CTA for unauthenticated visitors.
          The mobile-app-deep-link route fires only when the user has the app;
          we route to the in-app onboarding wizard with `ref=<slug>` baked in
          so the redeem hook attributes the new signup back to this card's
          owner once the user authenticates. */}
      {!isAuthenticated && card.slug ? (
        <Pressable
          onPress={() => {
            void usePendingReferralStoreSafe(card.slug);
            router.replace('/(auth)/signup' as never);
          }}
          style={[
            styles.floatingCta,
            { backgroundColor: copper[500] },
          ]}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.floatingCtaText}>{t.createYours}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// M3 — fire-and-forget helper used by the floating CTA. Safe to call from any
// context; if SecureStore is wedged we just skip persistence and the redeem
// will silently no-op on the post-auth side.
async function usePendingReferralStoreSafe(slug: string | null): Promise<void> {
  if (!slug) return;
  try {
    const mod = await import('../../../src/store/pendingReferralStore');
    await mod.usePendingReferralStore.getState().setRef(slug);
  } catch {
    // ignore
  }
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
  // Sprint 5 — status banner above hero
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  statusBannerText: { fontSize: 14, fontWeight: '500', flex: 1 },
  // Sprint 5 — feedback aggregate row
  aggregateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  aggregateText: { fontSize: 13, fontWeight: '600' },
  // Sprint 5 — CRM CTA row (lead / exchange / feedback)
  crmCtaRow: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  crmCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  crmCtaText: { fontSize: 15, fontWeight: '600' },
  // M3 — Embeds + gallery + lightbox + floating CTA
  embedsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    flexWrap: 'wrap',
  },
  embedTile: {
    width: 110,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    paddingBottom: 8,
  },
  embedThumb: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: 'rgba(0,0,0,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  embedLabel: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingTop: 6,
    textAlign: 'center',
  },
  galleryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
  },
  galleryThumb: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  galleryThumbImg: { width: '100%', height: '100%' },
  lightboxRoot: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' },
  lightboxClose: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  lightboxPage: {
    width: Dimensions.get('window').width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxImage: {
    width: Dimensions.get('window').width,
    height: '80%',
  },
  floatingCta: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  floatingCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
