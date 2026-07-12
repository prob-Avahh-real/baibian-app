import { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { useApp } from '@/store/AppContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function ResultScreen() {
  const { state } = useApp();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const latestResult = state.results[0];
  const template = state.templates.find((t) => t.id === latestResult?.templateId);

  const handleShare = useCallback(async () => {
    if (!latestResult) return;
    try {
      await Share.share({
        message: `我用百变大咖秀变身「${latestResult.templateName}」风格！快来试试吧 ✨`,
        url: latestResult.resultUri,
      });
    } catch {
      // user cancelled
    }
  }, [latestResult]);

  const handleBackToHome = useCallback(() => {
    router.push('/(tabs)');
  }, []);

  if (!latestResult) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={{ color: theme.textMuted, fontSize: 16 }}>没有结果</Text>
          <TouchableOpacity onPress={handleBackToHome}>
            <Text style={{ color: theme.primary, fontSize: 15, marginTop: 12, fontWeight: '600' }}>
              返回首页
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#0F0F23' }]}>
      <StatusBar barStyle="light-content" />

      {/* Result image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: latestResult.resultUri }} style={styles.image} />

        {/* Template badge on result */}
        {template && (
          <LinearGradient
            colors={template.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.badge}
          >
            <Text style={styles.badgeEmoji}>{template.emoji}</Text>
            <Text style={styles.badgeText}>{template.name}</Text>
          </LinearGradient>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.resultTitle}>变身完成 ✨</Text>
        <Text style={styles.resultDesc}>
          风格：{latestResult.templateName}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Text style={styles.btnPrimaryText}>📤 分享给朋友</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={handleBackToHome}
          activeOpacity={0.8}
        >
          <Text style={styles.btnSecondaryText}>🏠 返回首页</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnOutline]}
          onPress={() => router.push('/(tabs)/transform')}
          activeOpacity={0.8}
        >
          <Text style={styles.btnOutlineText}>🔄 再来一张</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeEmoji: {
    fontSize: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  resultTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  resultDesc: {
    color: '#94A3B8',
    fontSize: 14,
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  btn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#F59E0B',
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  btnSecondary: {
    backgroundColor: '#7C3AED',
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#94A3B8',
  },
  btnOutlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
