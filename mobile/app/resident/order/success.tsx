import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/src/shared/constants/colors";

export default function OrderSuccessScreen() {
  const params = useLocalSearchParams<{
    orderNumber: string;
    serviceName: string;
    price: string;
  }>();

  return (
    <View style={styles.screen}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>✓</Text>
      </View>

      <Text style={styles.title}>تم إنشاء الطلب بنجاح</Text>
      <Text style={styles.subtitle}>
        تم تأكيد الطلب والدفع التجريبي بنجاح. يمكنك متابعة حالة الطلب لاحقًا من صفحة طلباتي.
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.value}>{params.orderNumber}</Text>
          <Text style={styles.label}>رقم الطلب</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.value}>{params.serviceName}</Text>
          <Text style={styles.label}>الخدمة</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.priceValue}>{params.price} SAR</Text>
          <Text style={styles.label}>المبلغ</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.replace("/resident/home")}
      >
        <Text style={styles.primaryButtonText}>العودة للرئيسية</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.gl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  icon: {
    color: colors.gd,
    fontSize: 52,
    fontWeight: "800",
  },
  title: {
    fontSize: 28,
    color: colors.ink,
    fontWeight: "800",
    textAlign: "center",
    writingDirection: "rtl",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  subtitle: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 25,
    textAlign: "center",
    writingDirection: "rtl",
    fontFamily: "PlusJakartaSans_500Medium",
  },
  card: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 18,
    marginTop: 28,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  label: {
    color: colors.muted,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  value: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "left",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  priceValue: {
    color: colors.gd,
    fontSize: 15,
    fontWeight: "800",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  primaryButton: {
    width: "100%",
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.gd,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
    fontFamily: "PlusJakartaSans_700Bold",
  },
});