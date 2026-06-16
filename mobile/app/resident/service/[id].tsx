import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getServiceById } from "@/src/features/services/api/servicesApi";
import type { Service } from "@/src/features/services/types/serviceTypes";
import { colors } from "@/src/shared/constants/colors";

export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadService = useCallback(async () => {
    if (!id) return;

    try {
      setError("");
      const data = await getServiceById(id);
      setService(data);
    } catch {
      setError("تعذر تحميل تفاصيل الخدمة.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadService();
  }, [loadService]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.gd} />
        <Text style={styles.loadingText}>جاري تحميل تفاصيل الخدمة...</Text>
      </View>
    );
  }

  if (error || !service) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || "الخدمة غير موجودة."}</Text>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>رجوع</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>

          {service.image_url ? (
            <Image source={{ uri: service.image_url }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.heroPlaceholderText}>{service.name.slice(0, 2)}</Text>
            </View>
          )}
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.titleRow}>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>{service.price} SAR</Text>
            </View>

            <View style={styles.titleBlock}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.providerName}>{service.provider_name}</Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>المدة</Text>
              <Text style={styles.infoValue}>{service.duration_minutes} دقيقة</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>التصنيف</Text>
              <Text style={styles.infoValue}>{service.category_name}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>وصف الخدمة</Text>
            <Text style={styles.description}>
              {service.description || "لا يوجد وصف متاح لهذه الخدمة."}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>مقدم الخدمة</Text>

            <View style={styles.providerCard}>
              <View style={styles.providerAvatar}>
                <Text style={styles.providerAvatarText}>
                  {service.provider_name.slice(0, 2)}
                </Text>
              </View>

              <View style={styles.providerInfo}>
                <Text style={styles.providerCardName}>{service.provider_name}</Text>
                <Text style={styles.providerCardMeta}>مقدم خدمة معتمد في حيّك</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            router.push({
              pathname: "/resident/order/create",
              params: {
                serviceId: String(service.id),
                providerId: String(service.provider),
                serviceName: service.name,
                providerName: service.provider_name,
                price: service.price,
              },
            })
          }
        >
          <Text style={styles.primaryButtonText}>اطلب الخدمة</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  center: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 15,
  },
  errorText: {
    color: colors.err,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  hero: {
    backgroundColor: colors.gd,
    minHeight: 300,
    paddingTop: 58,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 34,
    fontWeight: "600",
  },
  heroImage: {
    width: "100%",
    height: 190,
    borderRadius: 26,
    backgroundColor: colors.sand,
  },
  heroPlaceholder: {
    height: 190,
    borderRadius: 26,
    backgroundColor: colors.gl,
    alignItems: "center",
    justifyContent: "center",
  },
  heroPlaceholderText: {
    color: colors.gd,
    fontSize: 54,
    fontWeight: "800",
  },
  detailsCard: {
    marginTop: -24,
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  titleBlock: {
    flex: 1,
  },
  serviceName: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.ink,
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  providerName: {
    marginTop: 6,
    fontSize: 15,
    color: colors.muted,
    fontWeight: "600",
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  priceBadge: {
    backgroundColor: colors.gl,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  priceText: {
    color: colors.gd,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  infoGrid: {
    flexDirection: "row-reverse",
    gap: 12,
    marginTop: 22,
  },
  infoBox: {
    flex: 1,
    backgroundColor: colors.cream,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 6,
    textAlign: "right",
    fontFamily: "PlusJakartaSans_500Medium",
  },
  infoValue: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "right",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 19,
    color: colors.ink,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  description: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 25,
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "PlusJakartaSans_500Medium",
  },
  providerCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.cream,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  providerAvatar: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.gl,
    alignItems: "center",
    justifyContent: "center",
  },
  providerAvatarText: {
    color: colors.gd,
    fontSize: 19,
    fontWeight: "800",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  providerInfo: {
    flex: 1,
    marginRight: 12,
  },
  providerCardName: {
    fontSize: 16,
    color: colors.ink,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  providerCardMeta: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
    textAlign: "right",
    writingDirection: "rtl",
    fontFamily: "PlusJakartaSans_500Medium",
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
  primaryButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  secondaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: colors.gd,
    borderRadius: 14,
  },
  secondaryButtonText: {
    color: colors.white,
    fontWeight: "800",
  },
});