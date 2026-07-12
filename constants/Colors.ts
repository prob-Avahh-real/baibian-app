// 百变大咖秀 - Entertainment Theme
const primary = '#7C3AED';      // Purple
const secondary = '#F59E0B';    // Gold
const accent = '#EF4444';       // Red
const bgDark = '#0F0F23';       // Deep navy
const cardDark = '#1A1A3E';     // Card bg
const surfaceDark = '#252550';  // Surface
const textLight = '#F8FAFC';
const textMuted = '#94A3B8';

export default {
  light: {
    text: '#1E293B',
    textMuted: '#64748B',
    background: '#F8FAFC',
    card: '#FFFFFF',
    surface: '#F1F5F9',
    tint: primary,
    tabIconDefault: '#94A3B8',
    tabIconSelected: primary,
    primary,
    secondary,
    accent,
    gradient: [primary, '#A855F7'] as [string, string],
  },
  dark: {
    text: textLight,
    textMuted: textMuted,
    background: bgDark,
    card: cardDark,
    surface: surfaceDark,
    tint: secondary,
    tabIconDefault: textMuted,
    tabIconSelected: secondary,
    primary,
    secondary,
    accent,
    gradient: [primary, '#EC4899'] as [string, string],
  },
};
