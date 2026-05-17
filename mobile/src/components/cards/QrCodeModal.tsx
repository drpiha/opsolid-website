import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Share,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { accent } from '../../lib/theme/tokens';
import { useTranslations, detectLocale } from '../../lib/i18n/locale';
import { API_BASE } from '../../lib/api/client';

type Props = {
  visible: boolean;
  slug: string;
  onClose: () => void;
};

export function QrCodeModal({ visible, slug, onClose }: Props) {
  const theme = useTheme();
  const t = useTranslations(detectLocale()).publicCard;
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const publicUrl = `https://opsolid.de/c/${slug}`;
  const qrUrl = `${API_BASE}/api/qr/${slug}`;

  async function handleShare() {
    try {
      await Share.share({
        message: publicUrl,
        url: publicUrl,
      });
    } catch {
      // user cancelled — silent
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.card, { backgroundColor: '#fff' }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.title, { color: theme.text }]}>
            {t.qrTitle}
          </Text>

          <View style={styles.qrWrap}>
            {imgLoading && !imgError ? (
              <View style={styles.qrLoader}>
                <ActivityIndicator size="large" color={accent} />
              </View>
            ) : null}
            {!imgError ? (
              <Image
                source={{ uri: qrUrl }}
                style={styles.qrImage}
                onLoadEnd={() => setImgLoading(false)}
                onError={() => {
                  setImgLoading(false);
                  setImgError(true);
                }}
              />
            ) : (
              <View style={styles.qrLoader}>
                <Text style={{ color: theme.signalErr }}>—</Text>
              </View>
            )}
          </View>

          <Text style={[styles.url, { color: theme.textMuted }]}>
            opsolid.de/c/{slug}
          </Text>

          <Pressable
            onPress={() => void handleShare()}
            style={[styles.btnPrimary, { backgroundColor: accent }]}
          >
            <Text style={[styles.btnPrimaryText, { color: '#fff' }]}>
              {t.share}
            </Text>
          </Pressable>

          <Pressable onPress={onClose} style={styles.btnGhost}>
            <Text style={[styles.btnGhostText, { color: accent }]}>
              {t.close}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const QR_SIZE = 240;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  qrWrap: {
    width: QR_SIZE,
    height: QR_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    width: QR_SIZE,
    height: QR_SIZE,
    resizeMode: 'contain',
  },
  qrLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  url: {
    fontSize: 12,
    fontFamily: 'Courier',
  },
  btnPrimary: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  btnGhost: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnGhostText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
