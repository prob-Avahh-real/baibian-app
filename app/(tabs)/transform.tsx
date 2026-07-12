import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useApp, Template } from '@/store/AppContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function TransformScreen() {
  const { state, setPhoto, setTransforming, addResult, clearPhoto } = useApp();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const handlePickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  }, [setPhoto]);

  const handleTakePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert('需要相机权限才能拍照');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  }, [setPhoto]);

  const handleTransform = useCallback(() => {
    if (!state.userPhotoUri || !state.selectedTemplate) return;

    setTransforming(true);

    // Mock AI transformation — apply the template's gradient as an overlay tint.
    // In production, this would call a face-swap / style-transfer API.
    setTimeout(() => {
      addResult({
        id: Date.now().toString(),
        templateId: state.selectedTemplate!.id,
        templateName: state.selectedTemplate!.name,
        originalUri: state.userPhotoUri!,
        resultUri: state.userPhotoUri!, // same image for mock; real app returns transformed
        createdAt: Date.now(),
      });
      clearPhoto();
      router.push('/result');
    }, 2000);
  }, [state.userPhotoUri, state.selectedTemplate, setTransforming, addResult, clearPhoto]);

  const selectedTemplate: Template | null = state.selectedTemplate;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>开始变身</Text>
      </View>

      {/* Selected template badge */}
      {selectedTemplate && (
        <View style={styles.templateBar}>
          <LinearGradient
            colors={selectedTemplate.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.templateBadge}
          >
            <Text style={styles.templateEmoji}>{selectedTemplate.emoji}</Text>
            <Text style={styles.templateName}>{selectedTemplate.name}</Text>
          </LinearGradient>
          <TouchableOpacity
            onPress={() => router.push('/')}
            style={[styles.switchBtn, { backgroundColor: theme.surface }]}
          >
            <Text style={[styles.switchText, { color: theme.text }]}>切换风格</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Photo area */}
      <View style={styles.photoArea}>
        {state.userPhotoUri ? (
          <View style={styles.photoPreview}>
            <Image source={{ uri: state.userPhotoUri }} style={styles.photoImage} />
            {state.isTransforming && (
              <View style={styles.transformingOverlay}>
                <ActivityIndicator size="large" color="#F59E0B" />
                <Text style={styles.transformingText}>AI 正在变身...</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.placeholder, { backgroundColor: theme.card }]}>
            <Text style={styles.placeholderEmoji}>📸</Text>
            <Text style={[styles.placeholderText, { color: theme.textMuted }]}>
              {selectedTemplate
                ? '选择一张照片开始变身'
                : '请先在首页选择一种风格'}
            </Text>
          </View>
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        {!state.userPhotoUri ? (
          <>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.primary }]}
              onPress={handlePickImage}
              activeOpacity={0.8}
            >
              <Text style={styles.actionText}>📁 从相册选择</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.cameraBtn, { borderColor: theme.primary }]}
              onPress={handleTakePhoto}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionText, { color: theme.primary }]}>📷 拍照</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.secondary }]}
              onPress={handleTransform}
              activeOpacity={0.8}
              disabled={state.isTransforming}
            >
              <Text style={[styles.actionText, { color: '#1E293B' }]}>
                ✨ 开始变身
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.retakeBtn, { borderColor: theme.textMuted }]}
              onPress={clearPhoto}
              activeOpacity={0.8}
              disabled={state.isTransforming}
            >
              <Text style={[styles.actionText, { color: theme.textMuted }]}>重选照片</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {!selectedTemplate && (
        <TouchableOpacity
          style={[styles.goHomeBtn, { backgroundColor: theme.surface }]}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <Text style={[styles.goHomeText, { color: theme.primary }]}>
            ← 去首页选择风格
          </Text>
        </TouchableOpacity>
      )}
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
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  templateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  templateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  templateEmoji: {
    fontSize: 18,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  switchBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  switchText: {
    fontSize: 13,
    fontWeight: '600',
  },
  photoArea: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  photoPreview: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  transformingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 15, 35, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  transformingText: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    borderStyle: 'dashed',
  },
  placeholderEmoji: {
    fontSize: 48,
  },
  placeholderText: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  actionBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  cameraBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  retakeBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  goHomeBtn: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  goHomeText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
