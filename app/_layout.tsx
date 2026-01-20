import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  // Başlangıç rotası hatalarını önlemek için
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Giriş Ekranı (Header Gizli) */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        {/* Ana Uygulama Sekmeleri (Header Gizli) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Modal Ekranı */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Bilgi' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}