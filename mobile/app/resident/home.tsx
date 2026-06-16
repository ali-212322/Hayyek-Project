import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getCategories, getServices } from "@/src/features/services/api/servicesApi";
import type { Service, ServiceCategory } from "@/src/features/services/types/serviceTypes";

const colors = {
  gd: "#2D6A4F",
  gm: "#40916C",
  gf: "#52B788",
  gl: "#D8F3DC",
  cream: "#FAFAF7",
  white: "#FFFFFF",
  sand: "#F2EFE9",
  ink: "#1A1A2E",
  muted: "#6B7280",
  light: "#9CA3AF",
  border: "#E5E7EB",
  err: "#EF4444",
};

export default function ResidentHomeScreen() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadHomeData = useCallback(async (categoryId?: number) => {
    try {
      setError("");

      const [categoriesData, servicesData] = await Promise.all([
        getCategories(),
        getServices(categoryId),
      ]);

      setCategories(categoriesData);
      setServices(servicesData);
    } catch {
      setError("تعذر تحميل الخدمات. حاول مرة أخرى.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData(selectedCategory);
  }, [loadHomeData, selectedCategory]);

  const filteredServices = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return services;

    return services.filter((service) => {
      return (
        service.name.toLowerCase().includes(keyword) ||
        service.provider_name.toLowerCase().includes(keyword) ||
        service.category_name.toLowerCase().includes(keyword)
      );
    });
  }, [search, services]);

  const onRefresh = () => {
    setRefreshing(true);
    loadHomeData(selectedCategory);
  };

  const openServiceDetails = (serviceId: number) => {
    router.push({
      pathname: "/resident/service/[id]",
      params: { id: String(serviceId) },
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.gd} />
        <Text style={styles.loadingText}>جاري تحميل الخدمات...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>مرحبًا بك 👋</Text>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔎</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="ابحث عن خدمة..."
            placeholderTextColor="#D8F3DC"
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>التصنيفات</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.categoryCard,
              selectedCategory === undefined && styles.categoryCardActive,
            ]}
            onPress={() => setSelectedCategory(undefined)}
          >
            <Text style={styles.categoryIcon}>🏠</Text>
            <Text style={styles.categoryText}>الكل</Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedCategory === category.id && styles.categoryCardActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon || "🛠️"}</Text>
              <Text style={styles.categoryText}>
                {category.name_ar || category.name_en}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الخدمات المتاحة</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {filteredServices.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>لا توجد خدمات متاحة حاليًا</Text>
          </View>
        ) : (
          filteredServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => openServiceDetails(service.id)}
              activeOpacity={0.85}
            >
              {service.image_url ? (
                <Image source={{ uri: service.image_url }} style={styles.serviceImage} />
              ) : (
                <View style={styles.serviceAvatar}>
                  <Text style={styles.serviceAvatarText}>
                    {service.name.slice(0, 2)}
                  </Text>
                </View>
              )}

              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.providerName}>{service.provider_name}</Text>
                <Text style={styles.metaText}>
                  {service.duration_minutes} دقيقة • {service.category_name}
                </Text>
              </View>

              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>{service.price} SAR</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cream,
  },
  loadingText: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 15,
  },
  header: {
    backgroundColor: colors.gd,
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greeting: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 22,
    textAlign: "right",
    writingDirection: "rtl",
  },
  searchBox: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
    writingDirection: "rtl",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 14,
    textAlign: "right",
    writingDirection: "rtl",
  },
  categoryCard: {
    width: 96,
    height: 96,
    borderRadius: 18,
    backgroundColor: colors.white,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryCardActive: {
    backgroundColor: colors.gl,
    borderColor: colors.gf,
  },
  categoryIcon: {
    fontSize: 26,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted,
    textAlign: "center",
  },
  serviceCard: {
    minHeight: 106,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginBottom: 14,
    padding: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceImage: {
    width: 62,
    height: 62,
    borderRadius: 16,
    backgroundColor: colors.sand,
  },
  serviceAvatar: {
    width: 62,
    height: 62,
    borderRadius: 16,
    backgroundColor: colors.gl,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceAvatarText: {
    color: colors.gd,
    fontSize: 22,
    fontWeight: "800",
  },
  serviceInfo: {
    flex: 1,
    marginRight: 14,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 4,
    textAlign: "right",
    writingDirection: "rtl",
  },
  providerName: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "600",
    textAlign: "right",
    writingDirection: "rtl",
  },
  metaText: {
    marginTop: 4,
    fontSize: 13,
    color: colors.light,
    textAlign: "right",
    writingDirection: "rtl",
  },
  priceBadge: {
    backgroundColor: colors.gl,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    marginRight: 10,
  },
  priceText: {
    color: colors.gd,
    fontSize: 12,
    fontWeight: "800",
  },
  emptyCard: {
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: 18,
    alignItems: "center",
  },
  emptyText: {
    color: colors.muted,
    fontWeight: "600",
    textAlign: "center",
  },
  errorText: {
    color: colors.err,
    marginBottom: 12,
    fontWeight: "700",
    textAlign: "right",
  },
});