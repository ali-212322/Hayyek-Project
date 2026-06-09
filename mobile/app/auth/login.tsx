import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '../../src/features/auth/context/AuthContext';
import { colors } from '../../src/shared/constants/colors';

export default function LoginScreen() {
  const { login } = useAuth();

  const [phone, setPhone] = useState('+966');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setError('');
    setIsSubmitting(true);

    try {
      await login(phone.trim(), password);
      router.replace('/resident/home');
    } catch {
      setError('رقم الجوال أو كلمة المرور غير صحيحة');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>حيّك<Text style={styles.logoDot}>.</Text></Text>
        <Text style={styles.welcome}>WELCOME BACK</Text>
        <Text style={styles.title}>تسجيل الدخول</Text>
        <Text style={styles.subtitle}>ادخل إلى خدمات حيك اليومية</Text>

        <View style={styles.form}>
          <Text style={styles.label}>رقم الجوال</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="+9665xxxxxxxx"
            keyboardType="phone-pad"
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.label}>كلمة المرور</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={handleLogin}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              isSubmitting && styles.buttonDisabled,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>تسجيل الدخول ←</Text>
            )}
          </Pressable>
        </View>

        <Link href="/auth/register" style={styles.registerLink}>
          إنشاء حساب جديد
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 26,
    padding: 26,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logo: {
    fontFamily: 'ReemKufi_700Bold',
    fontSize: 42,
    color: colors.gd,
    textAlign: 'center',
    marginBottom: 8,
  },
  logoDot: {
    color: colors.gf,
  },
  welcome: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: colors.gf,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 34,
    color: colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  form: {
    gap: 12,
  },
  label: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 13,
    color: colors.ink,
    textAlign: 'right',
  },
  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.cream,
    paddingHorizontal: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 15,
    color: colors.ink,
    textAlign: 'left',
  },
  error: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.err,
    textAlign: 'center',
    fontSize: 13,
  },
  button: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.gd,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
    fontSize: 16,
  },
  registerLink: {
    marginTop: 22,
    textAlign: 'center',
    color: colors.gd,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
