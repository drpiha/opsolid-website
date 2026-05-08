// -----------------------------------------------------------------------
// Template preview modal — full-screen pageable carousel of card-NN.png
// previews. Reachable via router.push('/(app)/cards/template-preview',
// { params: { selectedId } }) from the edit/create form's TemplateSection.
//
// Uses a zustand atom (templatePickerStore) to return the picked id back
// to the parent — see store/templatePickerStore.ts for rationale.
// -----------------------------------------------------------------------

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  type ViewToken,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import { useTheme } from '../../../src/lib/theme/ThemeProvider';
import { teal } from '../../../src/lib/theme/tokens';
import { listTemplates, type Template } from '../../../src/lib/api/templates';
import { API_BASE } from '../../../src/lib/api/client';
import { useTemplatePickerStore } from '../../../src/store/templatePickerStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TemplatePreviewScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { selectedId, sector } = useLocalSearchParams<{
    selectedId?: string;
    sector?: string;
  }>();

  const setPickedId = useTemplatePickerStore((s) => s.setPickedId);

  const [items, setItems] = useState<Template[] | null>(null);
  const [error, setError] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  // Filtered list — only the templates from the active sector. Keeps the
  // pageable carousel narrow enough that swiping reaches the end.
  const filtered = useMemo(() => {
    if (!items) return [] as Template[];
    if (!sector || sector === 'all') return items;
    return items.filter((it) => (it.sectorHint ?? 'general') === sector);
  }, [items, sector]);

  // Index of the initially-selected template inside the filtered list.
  const initialIdx = useMemo(() => {
    if (!filtered.length) return 0;
    const sel = selectedId ? Number(selectedId) : null;
    if (!sel) return 0;
    const idx = filtered.findIndex((it) => it.id === sel);
    return idx >= 0 ? idx : 0;
  }, [filtered, selectedId]);

  useEffect(() => {
    let cancelled = false;
    void listTemplates()
      .then((res) => {
        if (!cancelled) setItems(res.items);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync activeIdx when filtered list arrives.
  useEffect(() => {
    setActiveIdx(initialIdx);
  }, [initialIdx]);

  const listRef = useRef<FlatList<Template>>(null);
  const viewability = useRef({ itemVisiblePercentThreshold: 60 });
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (typeof first?.index === 'number') {
        setActiveIdx(first.index);
      }
    },
  );

  const current = filtered[activeIdx];

  function handleApply() {
    if (current) setPickedId(current.id);
    router.back();
  }

  function handleCancel() {
    router.back();
  }

  const renderCell = ({ item }: { item: Template }) => {
    const previewUri = item.previewPath
      ? item.previewPath.startsWith('http')
        ? item.previewPath
        : `${API_BASE}${item.previewPath}`
      : null;
    return (
      <View style={[styles.page, { width: SCREEN_WIDTH }]}>
        <View
          style={[
            styles.previewFrame,
            { borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[2] },
          ]}
        >
          {previewUri ? (
            <Image
              source={{ uri: previewUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.previewEmpty}>
              <Text style={[styles.previewEmptyText, { color: theme.ink[400] }]}>
                {item.name}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.bg[0] }]} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.line.DEFAULT }]}>
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={[styles.headerTitle, { color: theme.ink[100] }]}
          >
            {current?.name ?? '…'}
          </Text>
          {current?.sectorHint ? (
            <Text style={[styles.headerSub, { color: theme.ink[400] }]}>
              {current.sectorHint}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={handleCancel}
          style={styles.iconBtn}
          hitSlop={12}
          accessibilityLabel="Close"
        >
          <X size={22} color={theme.ink[200]} />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {items === null && !error ? (
          <View style={styles.center}>
            <ActivityIndicator color={teal[500]} size="large" />
          </View>
        ) : error || filtered.length === 0 ? (
          <View style={styles.center}>
            <Text style={{ color: theme.ink[400] }}>No templates available.</Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={filtered}
            keyExtractor={(it) => String(it.id)}
            renderItem={renderCell}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIdx}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            onViewableItemsChanged={onViewableItemsChanged.current}
            viewabilityConfig={viewability.current}
            decelerationRate="fast"
          />
        )}

        {/* Page indicator (idx / total) */}
        {filtered.length > 1 ? (
          <View style={styles.pageIndicator}>
            <Text style={[styles.pageIndicatorText, { color: theme.ink[400] }]}>
              {activeIdx + 1} / {filtered.length}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.line.DEFAULT }]}>
        <TouchableOpacity
          onPress={handleCancel}
          style={[
            styles.btn,
            styles.btnGhost,
            { borderColor: theme.line.DEFAULT, backgroundColor: theme.bg[1] },
          ]}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnText, { color: theme.ink[200] }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleApply}
          style={[
            styles.btn,
            styles.btnPrimary,
            { backgroundColor: teal[500] },
          ]}
          activeOpacity={0.85}
          disabled={!current}
        >
          <Check size={16} color="#FFFFFF" />
          <Text style={[styles.btnText, { color: '#FFFFFF' }]}>Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  headerSub: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: { flex: 1 },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  previewFrame: {
    width: '100%',
    aspectRatio: 540 / 960,
    maxHeight: '100%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%' },
  previewEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  previewEmptyText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pageIndicator: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  pageIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnGhost: { borderWidth: 1 },
  btnPrimary: {},
  btnText: { fontSize: 15, fontWeight: '600' },
});
