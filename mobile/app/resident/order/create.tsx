import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { createMockPayment, createOrder } from "@/src/features/orders/api/ordersApi";
import { colors } from "@/src/shared/constants/colors";

export default function CreateOrderScreen() {
  const params = useLocalSearchParams<{
    serviceId: string;
    providerId: string;
    serviceName: string;
    providerName: string;
    price: string;
  }>();

  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleConfirmOrder = async () => {
    if (!params.serviceId || !params.providerId) {
      Alert.alert("خطأ", "بيانات الخدمة غير مكتملة.");
      return;
    }

    if (!address.trim()) {
      Alert.alert("العنوان مطلوب", "فضلاً أدخل عنوان تنفيذ الخدمة.");
      return;
    }

    try {
      setSubmitting(true);

      const order = await createOrder({
        provider: Number(params.providerId),
        service: Number(params.serviceId),
        address: address.trim(),
        notes: notes.trim(),
        latitude: null,
        longitude: null,
        scheduled_at: null,
      });

      await createMockPayment(order.id);

      router.replace({
        pathname: "/resident/order/success",
        params: {
          orderNumber: order.order_number,
          serviceName: order.service_name || params.serviceName,
          price: order.total_price || params.price,
        },
      });
    } catch (error: any) {
      console.log("ORDER ERROR:");
      console.log(JSON.stringify(error?.response?.data, null, 2));

      Alert.alert(
        "خطأ",
        JSON.stringify(error?.response?.data || error.message, null, 2)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>تأكيد الطلب</Text>
          <Text style={styles.headerSubtitle}>راجع تفاصيل الخدمة قبل المتابعة</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>تفاصيل الخدمة</Text>

          <View style={styles.row}>
            <Text style={styles.value}>{params.serviceName}</Text>
            <Text style={styles.label}>الخدمة</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.value}>{params.providerName}</Text>
            <Text style={styles.label}>مقدم الخدمة</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.priceValue}>{params.price} SAR</Text>
            <Text style={styles.label}>السعر</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>بيانات الطلب</Text>

          <Text style={styles.inputLabel}>العنوان</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="مثال: جدة، حي الرياض، شارع..."
            placeholderTextColor={colors.light}
            style={styles.input}
            textAlign="right"
          />

          <Text style={styles.inputLabel}>ملاحظات إضافية</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="اكتب أي ملاحظات لمقدم الخدمة..."
            placeholderTextColor={colors.light}
            style={[styles.input, styles.notesInput]}
            textAlign="right"
            multiline
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, submitting && styles.primaryButtonDisabled]}
          onPress={handleConfirmOrder}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.primaryButtonText}>تأكيد الطلب والدفع</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    paddingBottom: 120,
  },
  header: {
    backgroundColor: colors.gd,
    paddingTop: 58,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 34,
    fontWeight: "600",
  },
  headerTitle: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  headerSubtitle: {
    color: colors.gl,
    marginTop: 8,
    fontSize: 15,
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "PlusJakartaSans_500Medium",
  },
  card: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 16,
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 11,
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
    fontWeight: "700",
    textAlign: "left",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  priceValue: {
    color: colors.gd,
    fontSize: 15,
    fontWeight: "800",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  inputLabel: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 12,
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  input: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 15,
    writingDirection: "rtl",
    fontFamily: "PlusJakartaSans_500Medium",
  },
  notesInput: {
    minHeight: 110,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 30,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  primaryButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.gd,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
    fontFamily: "PlusJakartaSans_700Bold",
  },
});