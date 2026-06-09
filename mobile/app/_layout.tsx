import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import { useFonts } from 'expo-font';

import {
  ReemKufi_400Regular,
  ReemKufi_600SemiBold,
  ReemKufi_700Bold,
} from '@expo-google-fonts/reem-kufi';

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

import {
  DMSerifDisplay_400Regular,
  DMSerifDisplay_400Regular_Italic,
} from '@expo-google-fonts/dm-serif-display';

import { AuthProvider } from '../src/features/auth/context/AuthContext';
import { colors } from '../src/shared/constants/colors';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ReemKufi_400Regular,
    ReemKufi_600SemiBold,
    ReemKufi_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.cream,
        }}
      >
        <ActivityIndicator size="large" color={colors.gd} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="resident/home" />
      </Stack>

      <StatusBar style="dark" />
    </AuthProvider>
  );
}