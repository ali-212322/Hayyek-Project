import { StyleSheet, Text, View } from 'react-native';

export default function ResidentHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>الرئيسية</Text>
      <Text>مرحبًا بك في تطبيق حيّك للمقيمين</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
});
