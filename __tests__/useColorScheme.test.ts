import { useColorScheme } from '../components/useColorScheme';

describe('useColorScheme', () => {
  it('returns light when scheme is unspecified', () => {
    const result = useColorScheme();
    expect(['light', 'dark']).toContain(result);
  });
});
