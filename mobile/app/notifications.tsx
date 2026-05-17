import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
  type Notification,
} from "../services/notification";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotificationsData = async () => {
    try {
      const data = await getNotifications();
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sorted);
    } catch (error) {
      console.error("Gagal mengambil data notifikasi:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotificationsData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotificationsData();
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Gagal menandai notifikasi dibaca:", error);
    }
  };

  const handleMarkAllRead = async () => {
    if (notifications.filter((n) => !n.isRead).length === 0) {
      return;
    }

    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      Alert.alert("Sukses", "Semua notifikasi ditandai sebagai dibaca!");
    } catch (error) {
      console.error("Gagal menandai semua dibaca:", error);
      Alert.alert("Error", "Gagal melakukan aksi.");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString("id-ID", options) + " WIB";
    } catch {
      return dateString;
    }
  };

  const getNotificationIcon = (title: string, message: string) => {
    const text = (title + " " + message).toLowerCase();
    if (text.includes("setuju") || text.includes("disetujui") || text.includes("approved")) {
      return { name: "checkmark-circle" as const, color: "#16a34a", bg: "#f0fdf4" };
    }
    if (text.includes("hapus") || text.includes("dihapus") || text.includes("deleted")) {
      return { name: "trash" as const, color: "#ef4444", bg: "#fef2f2" };
    }
    if (text.includes("tolak") || text.includes("ditolak") || text.includes("rejected")) {
      return { name: "close-circle" as const, color: "#dc2626", bg: "#fef2f2" };
    }
    return { name: "information-circle" as const, color: "#5B9CF6", bg: "#eff6ff" };
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B9CF6" />
        <Text style={styles.loadingText}>Memuat notifikasi...</Text>
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

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Notifikasi</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSubtitle}>{unreadCount} Belum Dibaca</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.readAllBtn, unreadCount === 0 && styles.readAllBtnDisabled]}
          activeOpacity={0.7}
          onPress={handleMarkAllRead}
          disabled={unreadCount === 0}
        >
          <Ionicons
            name="mail-open-outline"
            size={20}
            color={unreadCount === 0 ? "#94A3B8" : "#5B9CF6"}
          />
        </TouchableOpacity>
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
        {notifications.length > 0 ? (
          notifications.map((notif) => {
            const iconDetails = getNotificationIcon(notif.title, notif.message);
            return (
              <TouchableOpacity
                key={notif.id}
                style={[styles.notifCard, !notif.isRead && styles.notifCardUnread]}
                activeOpacity={0.8}
                onPress={() => handleMarkAsRead(notif.id)}
              >
                <View
                  style={[
                    styles.notifIconBg,
                    { backgroundColor: iconDetails.bg },
                  ]}
                >
                  <Ionicons name={iconDetails.name} size={22} color={iconDetails.color} />
                </View>

                <View style={styles.notifContent}>
                  <View style={styles.notifHeaderRow}>
                    <Text
                      style={[
                        styles.notifTitle,
                        !notif.isRead && styles.notifTitleUnread,
                      ]}
                      numberOfLines={1}
                    >
                      {notif.title}
                    </Text>
                    {!notif.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notifMessage}>{notif.message}</Text>
                  <Text style={styles.notifTime}>{formatDate(notif.createdAt)}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={56}
              color="#94A3B8"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>Kotak Masuk Kosong</Text>
            <Text style={styles.emptyDesc}>
              Setiap pembaruan status laporan Anda dari Admin akan dikabarkan langsung di sini.
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
    paddingTop: Platform.OS === "ios" ? 60 : 54,
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

  headerTitleContainer: {
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },

  headerSubtitle: {
    fontSize: 11,
    color: "#5B9CF6",
    fontWeight: "700",
    marginTop: 2,
  },

  readAllBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dbeafe",
  },

  readAllBtnDisabled: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },

  listContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  notifCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.01,
    shadowRadius: 8,
    elevation: 1,
    alignItems: "center",
  },

  notifCardUnread: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },

  notifIconBg: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  notifContent: {
    flex: 1,
  },

  notifHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  notifTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
    flex: 1,
    marginRight: 8,
  },

  notifTitleUnread: {
    color: "#0F172A",
    fontWeight: "800",
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#5B9CF6",
  },

  notifMessage: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 18,
    fontWeight: "500",
  },

  notifTime: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 8,
    fontWeight: "600",
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
