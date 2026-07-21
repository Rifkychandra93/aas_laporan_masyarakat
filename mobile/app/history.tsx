import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getReports, type Laporan } from "../services/laporan";
import { getProfile } from "../services/auth";
import { SafeAreaView } from "react-native-safe-area-context";


export default function History() {
  const [myReports, setMyReports] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistoryData = async () => {
    try {
      const [reportsData, profileData] = await Promise.all([
        getReports(),
        getProfile().catch(() => null),
      ]);

      if (profileData) {
        const filtered = reportsData.filter(
          (report: any) => report.userId === profileData.id
        );
        const sorted = [...filtered].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setMyReports(sorted);
      }
    } catch (error) {
      console.error("Gagal mengambil data riwayat laporan:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistoryData();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHistoryData();
  };

  const getReportImageUrl = (image: string | null) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return `http://192.168.0.102:3000/uploads/${image}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
        year: "numeric",
      };
      return new Date(dateString).toLocaleDateString("id-ID", options);
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B9CF6" />
        <Text style={styles.loadingText}>Memuat riwayat laporan...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Riwayat Laporan</Text>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#5B9CF6"]}
            tintColor="#5B9CF6"
          />
        }
      >
        <Text style={styles.sectionSubtitle}>
          Daftar seluruh laporan yang telah Anda ajukan ke sistem.
        </Text>

        {myReports.length > 0 ? (
          myReports.map((report) => {
            const isHigh = report.severity?.toLowerCase() === "tinggi";
            const isMedium = report.severity?.toLowerCase() === "sedang";
            const sevBg = isHigh ? "#fef2f2" : isMedium ? "#fffbeb" : "#f0fdf4";
            const sevText = isHigh ? "#dc2626" : isMedium ? "#b45309" : "#16a34a";

            const isAppr = report.status === "approved";
            const isRej = report.status === "rejected";
            const statBg = isAppr ? "#dcfce7" : isRej ? "#fef2f2" : "#eff6ff";
            const statText = isAppr ? "#16a34a" : isRej ? "#dc2626" : "#2563eb";
            const statLabel = isAppr ? "Disetujui" : isRej ? "Ditolak" : "Pending";

            return (
              <TouchableOpacity
                key={report.id}
                style={styles.reportCard}
                activeOpacity={0.8}
                onPress={() => router.push(`/laporan/${report.id}` as any)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Ionicons name="document-text" size={20} color="#5B9CF6" />
                    <Text style={styles.reportDate}>{formatDate(report.createdAt)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statBg }]}>
                    <Text style={[styles.statusText, { color: statText }]}>{statLabel}</Text>
                  </View>
                </View>

                <Text style={styles.reportTitle} numberOfLines={1}>
                  {report.title}
                </Text>
                <View style={styles.badgeRow}>
                  <View style={[styles.severityBadge, { backgroundColor: sevBg }]}>
                    <Text style={[styles.severityText, { color: sevText }]}>
                      Tingkat: {report.severity || "rendah"}
                    </Text>
                  </View>
                  {report.category?.name && (
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{report.category.name}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.reportDesc} numberOfLines={2}>
                  {report.description}
                </Text>
                {report.image && (
                  <View style={styles.reportImageContainer}>
                    <Image
                      source={{ uri: getReportImageUrl(report.image) || "" }}
                      style={styles.reportAttachmentImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="time-outline"
              size={56}
              color="#94A3B8"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
            <Text style={styles.emptyDesc}>
              Anda belum pernah mengirim laporan masalah. Laporan pertama Anda akan tampil di sini.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },

  listContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    fontWeight: "500",
    marginBottom: 20,
  },

  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.01,
    shadowRadius: 8,
    elevation: 1,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 12,
    marginBottom: 12,
  },

  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  reportDate: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  reportTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
    lineHeight: 20,
    marginBottom: 8,
  },

  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },

  severityText: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: "#F1F5F9",
  },

  categoryText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#475569",
  },

  reportDesc: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    fontWeight: "500",
  },

  reportImageContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  reportAttachmentImage: {
    width: "100%",
    height: 120,
  },

  emptyContainer: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  emptyIcon: {
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },

  emptyDesc: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
    maxWidth: 260,
    lineHeight: 20,
    fontWeight: "500",
  },
});
