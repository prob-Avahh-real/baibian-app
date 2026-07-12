import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useApp, TEMPLATES, Template } from '@/store/AppContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - 40 - CARD_GAP) / 2;

export function generate(prompt: string): string {
  // Placeholder: in production this calls an AI API
  return `Generated from prompt: "${prompt}"`;
}

export default function HomeScreen() {
  const { state, selectTemplate } = useApp();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const [prompt, setPrompt] = useState('');

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) {
      Alert.alert('提示', '请输入描述文字');
      return;
    }
    const result = generate(prompt.trim());
    Alert.alert('生成成功', result);
    setPrompt('');
  }, [prompt]);

  const handleTemplatePress = useCallback(
    (template: Template) => {
      selectTemplate(template);
      router.push('/(tabs)/transform');
    },
    [selectTemplate]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>百变大咖秀</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            选择风格，一键变身
          </Text>
        </View>
      </View>

      {/* Prompt input area */}
      <View style={[styles.promptSection, { backgroundColor: theme.card }]}>
        <TextInput
          style={[styles.promptInput, { color: theme.text, borderColor: theme.textMuted }]}
          placeholder="输入描述文字，AI 帮你生成..."
          placeholderTextColor={theme.textMuted}
          value={prompt}
          onChangeText={setPrompt}
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={[styles.generateButton, { backgroundColor: theme.primary }]}
          onPress={handleGenerate}
          activeOpacity={0.8}
        >
          <Text style={styles.generateButtonText}>✨ 生成</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>热门风格</Text>
        <View style={styles.grid}>
          {TEMPLATES.map((template) => {
            const isSelected = state.selectedTemplate?.id === template.id;
            return (
              <TouchableOpacity
                key={template.id}
                activeOpacity={0.8}
                onPress={() => handleTemplatePress(template)}
                style={[styles.card, isSelected && styles.cardSelected]}
              >
                <LinearGradient
                  colors={template.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <Text style={styles.cardEmoji}>{template.emoji}</Text>
                  <Text style={styles.cardName}>{template.name}</Text>
                  <Text style={styles.cardDesc}>{template.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feature highlights */}
        <View style={styles.features}>
          <View style={[styles.featureCard, { backgroundColor: theme.card }]}>
            <Text style={styles.featureEmoji}>📸</Text>
            <Text style={[styles.featureTitle, { color: theme.text }]}>实时拍照</Text>
            <Text style={[styles.featureDesc, { color: theme.textMuted }]}>
              用相机捕捉完美瞬间
            </Text>
          </View>
          <View style={[styles.featureCard, { backgroundColor: theme.card }]}>
            <Text style={styles.featureEmoji}>🎭</Text>
            <Text style={[styles.featureTitle, { color: theme.text }]}>AI 换脸</Text>
            <Text style={[styles.featureDesc, { color: theme.textMuted }]}>
              智能生成专属变身效果
            </Text>
          </View>
          <View style={[styles.featureCard, { backgroundColor: theme.card }]}>
            <Text style={styles.featureEmoji}>📤</Text>
            <Text style={[styles.featureTitle, { color: theme.text }]}>一键分享</Text>
            <Text style={[styles.featureDesc, { color: theme.textMuted }]}>
              分享到朋友圈炫耀
            </Text>
          </View>
        </View>
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
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  promptSection: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  promptInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  generateButton: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginBottom: 28,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.25,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  features: {
    flexDirection: 'row',
    gap: 10,
  },
  featureCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
