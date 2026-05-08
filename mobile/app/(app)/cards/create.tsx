import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator, // used for save indicator in header
  Image,
  StyleSheet,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { createCard, updateCard, uploadPhoto } from '../../../src/lib/api/cards';
// uploadPhoto is called inside handleCreate, after card creation succeeds
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { copper } from '../../../src/lib/theme/tokens';
import { useTranslations, detectLocale } from '../../../src/lib/i18n/locale';

export default function CardCreateScreen() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations(detectLocale()).cards;

  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // Store local URI only; upload happens inside handleCreate after the card exists
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string>('image/jpeg');

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
    if (!name.trim()) {
      Alert.alert('', 'Name is required.');
      return;
    }
    setSaving(true);
    try {
      // Create card first, then upload photo anchored to the new card id.
      // This prevents orphan assets if createCard() fails.
      const created = await createCard({
        templateId: 1,
        cardData: {
          name: name.trim(),
          title: jobTitle.trim() || undefined,
          company: company.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
        },
      });

      if (photoUri) {
        try {
          const path = await uploadPhoto(photoUri, photoMimeType);
          await updateCard(created.id, { photoPath: path });
        } catch {
          // Non-fatal: card created, photo failed — user can add later
          Alert.alert('', 'Card created, but photo upload failed. You can add it later.');
          router.back();
          return;
        }
      }

      Alert.alert('', t.createSuccess, [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('', t.errorLoad);
    } finally {
      setSaving(false);
    }
  }

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
      <ScrollView
        style={{ backgroundColor: theme.bg[0] }}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
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
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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
});
