import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getCard, updateCard, uploadPhoto } from '../../../../src/lib/api/cards';
import type { ApiCard } from '../../../../src/lib/api/types';
import { useTheme } from '../../../../src/lib/theme/ThemeProvider';
import { copper } from '../../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../../src/lib/i18n/locale';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? 'https://opsolid.de';

export default function CardEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations(detectLocale()).cards;

  const [card, setCard] = useState<ApiCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoPath, setPhotoPath] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    void getCard(id)
      .then((c) => {
        setCard(c);
        setName((c.cardData?.name as string) ?? '');
        setJobTitle((c.cardData?.title as string) ?? '');
        setCompany((c.cardData?.company as string) ?? '');
        setEmail((c.cardData?.email as string) ?? '');
        setPhone((c.cardData?.phone as string) ?? '');
        setPhotoPath(c.photoPath ?? null);
      })
      .catch(() => Alert.alert(t.errorLoad))
      .finally(() => setLoading(false));
  }, [id, t.errorLoad]);

  async function pickPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    if (!id || !name.trim()) return;
    setSaving(true);
    try {
      await updateCard(id, {
        cardData: {
          name: name.trim(),
          title: jobTitle.trim() || undefined,
          company: company.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
        },
        photoPath: photoPath,
      });
      Alert.alert('', t.saveSuccess, [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert(t.errorLoad);
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
      <ScrollView
        style={{ backgroundColor: theme.bg[0] }}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
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

        {/* Fields */}
        {[
          { label: t.fieldName, value: name, onChange: setName, placeholder: t.namePlaceholder, required: true },
          { label: t.fieldJobTitle, value: jobTitle, onChange: setJobTitle, placeholder: t.titlePlaceholder },
          { label: t.fieldCompany, value: company, onChange: setCompany, placeholder: t.companyPlaceholder },
          { label: t.fieldEmail, value: email, onChange: setEmail, placeholder: 'name@example.com', keyboard: 'email-address' as const },
          { label: t.fieldPhone, value: phone, onChange: setPhone, placeholder: '+49 …', keyboard: 'phone-pad' as const },
        ].map((field) => (
          <View key={field.label} style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>
              {field.label}{field.required ? ' *' : ''}
            </Text>
            <TextInput
              style={[styles.input, { color: theme.ink[100], borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[1] }]}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={field.placeholder}
              placeholderTextColor={theme.ink[500]}
              keyboardType={field.keyboard ?? 'default'}
              autoCapitalize={field.keyboard ? 'none' : 'words'}
            />
          </View>
        ))}

        {/* Status (only for published cards — allow toggling off) */}
        {card?.status === 'PUBLISHED' && (
          <View style={[styles.statusRow, { borderColor: theme.line.DEFAULT }]}>
            <Text style={[styles.fieldLabel, { color: theme.ink[400] }]}>Status</Text>
            <Text style={{ color: '#7FB286', fontSize: 14, fontWeight: '600' }}>
              {t.status.PUBLISHED}
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 16, gap: 16, paddingBottom: 48 },
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
  fieldWrap: { gap: 6 },
  fieldLabel: { fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.4 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1 },
});
