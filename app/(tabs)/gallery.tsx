import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/store/AppContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { TransformResult } from '@/store/AppContext';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 52) / 2;

export default function GalleryScreen() {
  const { state, deleteResult } = useApp();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  if (state.results.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>我的作品</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🎬</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>还没有作品</Text>
          <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>
            快去首页选择风格，拍张照片开始你的第一次变身吧
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>我的作品</Text>
        <Text style={[styles.count, { color: theme.textMuted }]}>
          {state.results.length} 张
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {state.results.map((item: TransformResult) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.resultUri }} style={styles.image} />
            <View style={styles.cardOverlay}>
              <Text style={styles.cardName}>{item.templateName}</Text>
              <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteResult(item.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  count: {
    fontSize: 14,
  },
  scroll: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.35,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#1A1A3E',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cardDate: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  deleteBtn: {
    position: 'absolute',
    top: -28,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
