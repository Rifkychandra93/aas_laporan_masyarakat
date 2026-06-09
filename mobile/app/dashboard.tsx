// app/dashboard.tsx

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
import { getProfile } from "../services/auth";
import { getReports, type Laporan } from "../services/laporan";
import { getNotifications } from "../services/notification";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Dashboard() {
  const [reports, setReports] = useState<Laporan[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const fetchData = async () => {
    try {
      const [reportsData, profileData, notificationsData] = await Promise.all([
        getReports(),
        getProfile().catch(() => null), // Fail-safe fallback if profile fetch fails
        getNotifications().catch(() => []),
      ]);
      
      // Sort reports by newest first
      const sortedReports = [...reportsData].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReports(sortedReports);

      if (profileData) {
        setUserProfile(profileData);
      }

      // Check if any unread notification exists
      const unreadExist = notificationsData.some((n: any) => !n.isRead);
      setHasUnreadNotifications(unreadExist);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleCreateReport = () => {
    router.push("/laporan" as any);
  };
  const totalStats = reports.length;
  const pendingStats = reports.filter((r) => r.status === "pending").length;
  const approvedStats = reports.filter((r) => r.status === "approved").length;
  const rejectedStats = reports.filter((r) => r.status === "rejected").length;

  const getReportImageUrl = (image: string | null) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return `http://192.168.43.124:3000/uploads/${image}`;
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
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
        <Text style={styles.loadingText}>Memuat data dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#5B9CF6"]}
            tintColor="#5B9CF6"
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>
              Report <Text style={styles.blue}>in</Text>
            </Text>
            <Text style={styles.greeting}>
              Halo, <Text style={styles.boldGreeting}>{userProfile?.name || "Warga"}</Text>
            </Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.7}
              onPress={() => router.push("/history")}
            >
              <Ionicons name="time-outline" size={22} color="#0F172A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.7}
              onPress={() => router.push("/notifications")}
            >
              <Ionicons name="notifications-outline" size={22} color="#0F172A" />
              {hasUnreadNotifications && <View style={styles.notificationBadge} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileButton}
              activeOpacity={0.7}
              onPress={() => router.push("/profile")}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {getInitials(userProfile?.name || "W")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeaderStats}>
          <Text style={styles.sectionTitleStats}>Statistik Laporan</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsWrapper}
        >
          <View style={styles.statsCard}>
            <View style={[styles.statsIconBg, { backgroundColor: "#eff6ff" }]}>
              <Ionicons name="stats-chart" size={18} color="#5B9CF6" />
            </View>
            <Text style={styles.statsNumber}>{totalStats}</Text>
            <Text style={styles.statsLabel}>Total</Text>
          </View>

          <View style={styles.statsCard}>
            <View style={[styles.statsIconBg, { backgroundColor: "#fffbeb" }]}>
              <Ionicons name="time" size={18} color="#d97706" />
            </View>
            <Text style={[styles.statsNumber, { color: "#d97706" }]}>
              {pendingStats}
            </Text>
            <Text style={styles.statsLabel}>Pending</Text>
          </View>

          <View style={styles.statsCard}>
            <View style={[styles.statsIconBg, { backgroundColor: "#f0fdf4" }]}>
              <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
            </View>
            <Text style={[styles.statsNumber, { color: "#16a34a" }]}>
              {approvedStats}
            </Text>
            <Text style={styles.statsLabel}>Disetujui</Text>
          </View>

          <View style={styles.statsCard}>
            <View style={[styles.statsIconBg, { backgroundColor: "#fef2f2" }]}>
              <Ionicons name="close-circle" size={18} color="#dc2626" />
            </View>
            <Text style={[styles.statsNumber, { color: "#dc2626" }]}>
              {rejectedStats}
            </Text>
            <Text style={styles.statsLabel}>Ditolak</Text>
          </View>
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Semua Laporan</Text>
          <TouchableOpacity
            style={styles.reportButton}
            activeOpacity={0.8}
            onPress={handleCreateReport}
          >
            <Text style={styles.reportButtonText}>+ Laporan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reportContainer}>
          {reports.length > 0 ? (
            reports.map((report) => {
              const isHigh = report.severity?.toLowerCase() === "tinggi";
              const isMedium = report.severity?.toLowerCase() === "sedang";
              const sevBg = isHigh ? "#fef2f2" : isMedium ? "#fffbeb" : "#f0fdf4";
              const sevText = isHigh ? "#dc2626" : isMedium ? "#b45309" : "#16a34a";

              const isAppr = report.status === "approved";
              const isRej = report.status === "rejected";
              const statBg = isAppr ? "#dcfce7" : isRej ? "#fef2f2" : "#eff6ff";
              const statText = isAppr ? "#16a34a" : isRej ? "#dc2626" : "#2563eb";
              const statLabel = isAppr
                ? "Disetujui"
                : isRej
                ? "Ditolak"
                : "Pending";

              return (
                <TouchableOpacity
                  key={report.id}
                  style={styles.reportCard}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/laporan/${report.id}` as any)}
                >
                  <View style={styles.reportTop}>
                    <View style={styles.userInfo}>
                      <View style={styles.userInitialsBg}>
                        <Text style={styles.userInitialsText}>
                          {getInitials(report.user?.name || "A")}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.userName}>
                          {report.user?.name || "Anonim"}
                        </Text>
                        <Text style={styles.reportDate}>
                          {formatDate(report.createdAt)}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: statBg }]}>
                      <Text style={[styles.statusText, { color: statText }]}>
                        {statLabel}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.reportTitleRow}>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                  </View>

                  <View style={styles.badgeRow}>
                    <View style={[styles.severityBadge, { backgroundColor: sevBg }]}>
                      <Text style={[styles.severityText, { color: sevText }]}>
                        Tingkat: {report.severity || "rendah"}
                      </Text>
                    </View>
                    {report.category?.name && (
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>
                          {report.category.name}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.reportDesc}>{report.description}</Text>

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
              <Ionicons name="document-text-outline" size={48} color="#94A3B8" style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>Belum Ada Laporan</Text>
              <Text style={styles.emptyDesc}>
                Laporan masyarakat yang diajukan akan tampil secara langsung di sini.
              </Text>
            </View>
          )}
        </View>
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
    // Spacing adjustment pushed down for notch clearance on iOS/Android
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },

  blue: {
    color: "#5B9CF6",
  },

  greeting: {
    marginTop: 6,
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
  },

  boldGreeting: {
    fontWeight: "700",
    color: "#0F172A",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  avatarCircle: {
    width: "100%",
    height: "100%",
    backgroundColor: "#5B9CF6",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  sectionHeaderStats: {
    marginTop: 28,
    paddingHorizontal: 24,
  },

  sectionTitleStats: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  statsWrapper: {
    paddingLeft: 24,
    paddingRight: 10,
    marginTop: 16,
    paddingBottom: 4,
  },

  statsCard: {
    width: 108,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },

  statsIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  statsNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: "#5B9CF6",
  },

  statsLabel: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },

  sectionHeader: {
    marginTop: 32,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },

  reportButton: {
    backgroundColor: "#5B9CF6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },

  reportButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },

  reportContainer: {
    paddingHorizontal: 24,
    marginTop: 18,
    paddingBottom: 36,
  },

  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },

  reportTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 12,
    marginBottom: 14,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  userInitialsBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  userInitialsText: {
    color: "#5B9CF6",
    fontWeight: "800",
    fontSize: 16,
  },

  userName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },

  reportDate: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 3,
    fontWeight: "500",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },

  reportTitleRow: {
    marginBottom: 8,
  },

  reportTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 22,
  },

  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },

  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  severityText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },

  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#475569",
  },

  reportDesc: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    fontWeight: "500",
  },

  reportImageContainer: {
    marginTop: 14,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  reportAttachmentImage: {
    width: "100%",
    height: 160,
  },

  emptyContainer: {
    paddingVertical: 60,
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
    marginTop: 6,
    maxWidth: 240,
    lineHeight: 18,
    fontWeight: "500",
  },
});