import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen, { generate } from '../app/(tabs)/index';
import { AppProvider } from '../store/AppContext';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

describe('HomeScreen', () => {
  it('renders title and prompt input', () => {
    const { getByText, getByPlaceholderText } = render(
      <AppProvider>
        <HomeScreen />
      </AppProvider>
    );

    expect(getByText('百变大咖秀')).toBeTruthy();
    expect(getByPlaceholderText('输入描述文字，AI 帮你生成...')).toBeTruthy();
    expect(getByText('✨ 生成')).toBeTruthy();
  });

  it('shows template cards', () => {
    const { getByText } = render(
      <AppProvider>
        <HomeScreen />
      </AppProvider>
    );

    expect(getByText('明星大咖')).toBeTruthy();
    expect(getByText('古装风华')).toBeTruthy();
  });
});

describe('generate', () => {
  it('returns a generated string from the prompt', () => {
    const result = generate('test prompt');
    expect(result).toContain('test prompt');
    expect(result).toContain('Generated from prompt');
  });
});
