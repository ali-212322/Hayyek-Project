import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../src/shared/constants/colors';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>حيّك<Text style={styles.logoDot}>.</Text></Text>

      <Text style={styles.title}>
        خدمات حيك، بشكل أبسط
      </Text>

      <Text style={styles.subtitle}>
        اطلب خدمات الحي اليومية بسهولة من مكان واحد.
      </Text>

      <Link href="/auth/login" style={styles.button}>
        ابدأ الآن →
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  logo: {
    fontFamily: 'ReemKufi_700Bold',
    fontSize: 48,
    color: colors.gd,
    marginBottom: 28,
  },
  logoDot: {
    color: colors.gf,
  },
  title: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 34,
    lineHeight: 42,
    textAlign: 'center',
    color: colors.ink,
    marginBottom: 14,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    color: colors.muted,
    marginBottom: 34,
  },
  button: {
    backgroundColor: colors.gd,
    color: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 100,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    overflow: 'hidden',
  },
});