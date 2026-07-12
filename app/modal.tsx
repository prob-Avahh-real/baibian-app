import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bg = isDark ? '#0F0F23' : '#F8FAFC';
  const textColor = isDark ? '#F8FAFC' : '#1E293B';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.title, { color: textColor }]}>关于</Text>
      <View style={styles.separator} />
      <Text style={[styles.text, { color: isDark ? '#94A3B8' : '#64748B' }]}>
        百变大咖秀 v1.0.0
      </Text>
      <Text style={[styles.text, { color: isDark ? '#94A3B8' : '#64748B' }]}>
        AI 换脸娱乐应用原型
      </Text>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  separator: {
    marginVertical: 16,
    height: 1,
    width: '80%',
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
});
