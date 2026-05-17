import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getProfile, updateProfile } from "../services/auth";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setUser(data);
      setEditName(data.name || "");
    } catch (error) {
      console.error("Gagal memuat profil:", error);
      Alert.alert("Error", "Gagal mengambil data profil Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar dari akun Anda?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("token");
            router.replace("/login");
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      Alert.alert("Peringatan", "Nama tidak boleh kosong.");
      return;
    }

    setUpdating(true);
    try {
      const result = await updateProfile(editName.trim());
      setUser(result.user);
      setIsEditing(false);
      Alert.alert("Sukses", "Profil berhasil diperbarui!");
    } catch (error: any) {
      console.error("Gagal memperbarui profil:", error);
      Alert.alert(
        "Gagal",
        error.response?.data?.message || "Terjadi kesalahan saat menyimpan perubahan."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditName(user?.name || "");
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B9CF6" />
        <Text style={styles.loadingText}>Memuat profil...</Text>
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

        <Text style={styles.headerTitle}>Profil Pengguna</Text>

        <View style={{ width: 44 }} />
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {getInitials(user?.name || "W")}
          </Text>
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <Text style={styles.inputLabel}>Nama Lengkap</Text>
            <TextInput
              style={styles.editInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor="#94A3B8"
              autoFocus
            />
          </View>
        ) : (
          <View style={styles.infoWrapper}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {user?.role?.toLowerCase() === "admin"
                  ? "User"
                  : "Admin"}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.menuContainer}>
        {isEditing ? (
          <View style={styles.editActionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              activeOpacity={0.8}
              onPress={handleSave}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Simpan</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              activeOpacity={0.8}
              onPress={handleCancel}
              disabled={updating}
            >
              <Ionicons name="close-outline" size={20} color="#475569" />
              <Text style={[styles.actionButtonText, { color: "#475569" }]}>Batal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => setIsEditing(true)}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: "#eff6ff" }]}>
                  <Ionicons name="create-outline" size={20} color="#5B9CF6" />
                </View>
                <Text style={styles.menuText}>Edit Profil</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.logoutMenuItem]}
              activeOpacity={0.7}
              onPress={handleLogout}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconBg, { backgroundColor: "#fef2f2" }]}>
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                </View>
                <Text style={[styles.menuText, { color: "#EF4444" }]}>Keluar dari Akun</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </>
        )}
      </View>
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

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  profileCard: {
    margin: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },

  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#5B9CF6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
  },

  infoWrapper: {
    alignItems: "center",
    width: "100%",
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },

  email: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 14,
    fontWeight: "500",
  },

  roleBadge: {
    marginTop: 16,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },

  roleText: {
    color: "#5B9CF6",
    fontSize: 12,
    fontWeight: "700",
  },

  editForm: {
    width: "100%",
    marginTop: 8,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  editInput: {
    height: 52,
    borderWidth: 1,
    borderColor: "#5B9CF6",
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "600",
  },

  menuContainer: {
    paddingHorizontal: 24,
  },

  menuItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },

  logoutMenuItem: {
    borderColor: "#FEE2E2",
    shadowColor: "#EF4444",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  menuIconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  menuText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  editActionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },

  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  saveButton: {
    backgroundColor: "#5B9CF6",
    shadowColor: "#5B9CF6",
  },

  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#64748B",
    shadowOpacity: 0.05,
  },

  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});