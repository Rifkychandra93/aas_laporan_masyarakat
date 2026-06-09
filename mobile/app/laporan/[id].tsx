import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  Platform,
  Alert,
  Linking,
  KeyboardAvoidingView,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { getLaporanById, deleteLaporan, updateLaporan } from "../../services/laporan";
import { getProfile } from "../../services/auth";
import { createComment, deleteComment } from "../../services/comment";
import { SafeAreaView } from "react-native-safe-area-context";


const SEVERITY_OPTIONS = [
  { value: "low", label: "Rendah", color: "#16a34a", bg: "#f0fdf4" },
  { value: "medium", label: "Sedang", color: "#d97706", bg: "#fffbeb" },
  { value: "high", label: "Tinggi", color: "#dc2626", bg: "#fef2f2" },
];

const CATEGORY_OPTIONS = [
  { id: 1, name: "Infrastruktur" },
  { id: 2, name: "Lingkungan" },
  { id: 3, name: "Keamanan" },
  { id: 4, name: "Sosial" },
  { id: 5, name: "Lainnya" },
];

export default function LaporanDetail() {
  const { id } = useLocalSearchParams();
  const laporanId = Number(id);

  const [laporan, setLaporan] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // EDIT REPORT STATES
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("1");
  const [editSeverity, setEditSeverity] = useState("low");
  const [editLatitude, setEditLatitude] = useState("");
  const [editLongitude, setEditLongitude] = useState("");
  const [editImageUri, setEditImageUri] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [updatingReport, setUpdatingReport] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const fetchDetailData = async () => {
    try {
      const [laporanData, userData] = await Promise.all([
        getLaporanById(laporanId),
        getProfile().catch(() => null),
      ]);
      setLaporan(laporanData);
      if (userData) {
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error("Gagal memuat detail laporan:", error);
      Alert.alert("Error", "Gagal mengambil detail laporan dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailData();
  }, [id]);

  const handleStartEdit = () => {
    setEditTitle(laporan.title || "");
    setEditDescription(laporan.description || "");
    setEditCategoryId(String(laporan.categoryId || "1"));
    setEditSeverity(laporan.severity || "low");
    setEditLatitude(String(laporan.latitude || ""));
    setEditLongitude(String(laporan.longitude || ""));
    setEditImageUri(getReportImageUrl(laporan.image));
    setImageChanged(false);
    setIsEditingReport(true);
  };

  const handlePickEditImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Izin Ditolak", "Butuh izin galeri untuk mengganti foto.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setEditImageUri(result.assets[0].uri);
        setImageChanged(true);
      }
    } catch (error) {
      console.error("Gagal memilih gambar edit:", error);
    }
  };

  const handleRemoveEditImage = () => {
    setEditImageUri(null);
    setImageChanged(true);
  };

  const handleGetEditLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Izin Ditolak", "Butuh izin lokasi untuk mendeteksi koordinat.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setEditLatitude(location.coords.latitude.toFixed(6));
      setEditLongitude(location.coords.longitude.toFixed(6));
    } catch (error) {
      console.error("Gagal mendapatkan lokasi edit:", error);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      Alert.alert("Peringatan", "Judul dan deskripsi tidak boleh kosong.");
      return;
    }

    setUpdatingReport(true);
    try {
      const formData = new FormData();
      formData.append("title", editTitle.trim());
      formData.append("description", editDescription.trim());
      formData.append("latitude", editLatitude.trim() || "0");
      formData.append("longitude", editLongitude.trim() || "0");
      formData.append("severity", editSeverity);
      formData.append("categoryId", editCategoryId);

      if (imageChanged) {
        if (editImageUri) {
          const localUri = editImageUri;
          const filename = localUri.split("/").pop() || "image.jpg";

          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image/jpeg`;

          formData.append("image", {
            uri: Platform.OS === "android" ? localUri : localUri.replace("file://", ""),
            name: filename,
            type: type,
          } as any);
        } else {
          // Send indication to remove image if possible, or leave blank
          formData.append("image", "");
        }
      }

      await updateLaporan(laporanId, formData);
      Alert.alert("Sukses", "Laporan berhasil diperbarui!");
      setIsEditingReport(false);
      await fetchDetailData();
    } catch (error: any) {
      console.error("Gagal memperbarui laporan:", error);
      Alert.alert(
        "Gagal Menyimpan",
        error.response?.data?.message || "Terjadi kesalahan saat menghubungi server."
      );
    } finally {
      setUpdatingReport(false);
    }
  };

  const handleOpenMap = () => {
    if (!laporan?.latitude || !laporan?.longitude) {
      Alert.alert("Informasi", "Koordinat lokasi tidak diset untuk laporan ini.");
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${laporan.latitude},${laporan.longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Gagal membuka Google Maps.");
    });
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await createComment(commentText.trim(), laporanId);
      await fetchDetailData();
      setCommentText("");
    } catch (error) {
      console.error("Gagal mengirim komentar:", error);
      Alert.alert("Error", "Gagal mengirim komentar Anda.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = (commentId: number) => {
    Alert.alert(
      "Hapus Komentar",
      "Apakah Anda yakin ingin menghapus komentar ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteComment(commentId);
              setLaporan((prev: any) => ({
                ...prev,
                comments: prev.comments.filter((c: any) => c.id !== commentId),
              }));
              Alert.alert("Sukses", "Komentar berhasil dihapus!");
            } catch (error) {
              console.error("Gagal menghapus komentar:", error);
              Alert.alert("Error", "Gagal menghapus komentar.");
            }
          },
        },
      ]
    );
  };

  const handleDeleteReport = () => {
    Alert.alert(
      "Hapus Laporan",
      "Apakah Anda yakin ingin menghapus laporan Anda sendiri? Tindakan ini akan menghapus semua komentar di dalamnya secara permanen.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus Permanen",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteLaporan(laporanId);
              Alert.alert("Sukses", "Laporan Anda berhasil dihapus!", [
                { text: "OK", onPress: () => router.replace("/dashboard") },
              ]);
            } catch (error) {
              console.error("Gagal menghapus laporan:", error);
              Alert.alert("Error", "Gagal menghapus laporan Anda.");
            }
          },
        },
      ]
    );
  };

  const getReportImageUrl = (image: string | null) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return `http://192.168.137.1:3000/uploads/${image}`;
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
        <Text style={styles.loadingText}>Memuat detail laporan...</Text>
      </View>
    );
  }

  if (!laporan) {
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
          <Text style={styles.headerTitle}>Detail Laporan</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#94A3B8" />
          <Text style={styles.errorTitle}>Laporan Tidak Ditemukan</Text>
          <Text style={styles.errorDesc}>
            Laporan mungkin telah dihapus oleh pembuat atau administrator.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isHigh = laporan.severity?.toLowerCase() === "tinggi";
  const isMedium = laporan.severity?.toLowerCase() === "sedang";
  const sevBg = isHigh ? "#fef2f2" : isMedium ? "#fffbeb" : "#f0fdf4";
  const sevText = isHigh ? "#dc2626" : isMedium ? "#b45309" : "#16a34a";

  const isAppr = laporan.status === "approved";
  const isRej = laporan.status === "rejected";
  const statBg = isAppr ? "#dcfce7" : isRej ? "#fef2f2" : "#eff6ff";
  const statText = isAppr ? "#16a34a" : isRej ? "#dc2626" : "#2563eb";
  const statLabel = isAppr ? "Disetujui" : isRej ? "Ditolak" : "Pending";

  const isOwner = currentUser && laporan.userId === currentUser.id;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => (isEditingReport ? setIsEditingReport(false) : router.back())}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isEditingReport ? "Edit Laporan" : "Detail Laporan"}
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {isEditingReport ? (
            <View style={styles.detailCard}>
              <View style={styles.editFormHeader}>
                <Ionicons name="create-outline" size={20} color="#5B9CF6" />
                <Text style={styles.editFormTitle}>Edit Informasi Laporan</Text>
              </View>

              <Text style={styles.label}>Judul Laporan</Text>
              <TextInput
                style={styles.input}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Masukkan judul laporan"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.label}>Deskripsi Kejadian</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editDescription}
                onChangeText={setEditDescription}
                placeholder="Jelaskan masalah secara detail..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <Text style={styles.label}>Kategori Masalah</Text>
              <View style={styles.categoryContainer}>
                {CATEGORY_OPTIONS.map((c) => {
                  const isActive = editCategoryId === String(c.id);
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={[
                        styles.categoryPill,
                        isActive && styles.categoryPillActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setEditCategoryId(String(c.id))}
                    >
                      <Text
                        style={[
                          styles.editCategoryText,
                          isActive && styles.categoryTextActive,
                        ]}
                      >
                        {c.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.label, { marginTop: 12 }]}>Tingkat Urgensi</Text>
              <View style={styles.severityContainer}>
                {SEVERITY_OPTIONS.map((s) => {
                  const isActive = editSeverity === s.value;
                  return (
                    <TouchableOpacity
                      key={s.value}
                      style={[
                        styles.severityCard,
                        { borderColor: s.color },
                        isActive && { backgroundColor: s.bg },
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setEditSeverity(s.value)}
                    >
                      <Ionicons
                        name={isActive ? "alert-circle" : "alert-circle-outline"}
                        size={18}
                        color={s.color}
                      />
                      <Text
                        style={[
                          styles.editSeverityText,
                          { color: s.color, fontWeight: isActive ? "800" : "600" },
                        ]}
                      >
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.label, { marginTop: 12 }]}>Koordinat Lokasi</Text>
              <View style={styles.locationGrid}>
                <View style={styles.locationCol}>
                  <Text style={styles.subLabel}>Latitude</Text>
                  <TextInput
                    style={styles.input}
                    value={editLatitude}
                    onChangeText={setEditLatitude}
                    placeholder="-6.200000"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.locationCol}>
                  <Text style={styles.subLabel}>Longitude</Text>
                  <TextInput
                    style={styles.input}
                    value={editLongitude}
                    onChangeText={setEditLongitude}
                    placeholder="106.816666"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.locationButton}
                activeOpacity={0.8}
                onPress={handleGetEditLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator size="small" color="#5B9CF6" />
                ) : (
                  <>
                    <Ionicons name="location-outline" size={18} color="#5B9CF6" />
                    <Text style={styles.locationButtonText}>Gunakan GPS Saat Ini</Text>
                  </>
                )}
              </TouchableOpacity>

              <Text style={[styles.label, { marginTop: 12 }]}>Foto Pendukung</Text>
              {editImageUri ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: editImageUri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    activeOpacity={0.7}
                    onPress={handleRemoveEditImage}
                  >
                    <Ionicons name="close-circle" size={26} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadCard}
                  activeOpacity={0.7}
                  onPress={handlePickEditImage}
                >
                  <Ionicons name="cloud-upload-outline" size={28} color="#94A3B8" />
                  <Text style={styles.uploadTitle}>Ketuk untuk Memilih Foto</Text>
                </TouchableOpacity>
              )}

              <View style={styles.editActionContainer}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.cancelBtn]}
                  activeOpacity={0.8}
                  onPress={() => setIsEditingReport(false)}
                  disabled={updatingReport}
                >
                  <Text style={styles.cancelBtnText}>Batal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.submitBtn]}
                  activeOpacity={0.8}
                  onPress={handleSaveEdit}
                  disabled={updatingReport}
                >
                  {updatingReport ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                      <Text style={styles.submitBtnText}>Simpan</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.detailCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.userAvatarText}>
                        {getInitials(laporan.user?.name || "A")}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.userName}>{laporan.user?.name || "Anonim"}</Text>
                      <Text style={styles.date}>{formatDate(laporan.createdAt)}</Text>
                    </View>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: statBg }]}>
                    <Text style={[styles.statusText, { color: statText }]}>{statLabel}</Text>
                  </View>
                </View>

                <View style={styles.badgesRow}>
                  <View style={[styles.severityBadge, { backgroundColor: sevBg }]}>
                    <Text style={[styles.severityText, { color: sevText }]}>
                      Tingkat: {laporan.severity || "rendah"}
                    </Text>
                  </View>
                  {laporan.category?.name && (
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{laporan.category.name}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.reportTitle}>{laporan.title}</Text>
                <Text style={styles.reportDesc}>{laporan.description}</Text>

                {laporan.image && (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: getReportImageUrl(laporan.image) || "" }}
                      style={styles.attachmentImage}
                      resizeMode="cover"
                    />
                  </View>
                )}

                {(laporan.latitude || laporan.longitude) && (
                  <View style={styles.locationSection}>
                    <View style={styles.locationMeta}>
                      <Ionicons name="map-outline" size={20} color="#5B9CF6" />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.locationTitle}>Koordinat Lokasi</Text>
                        <Text style={styles.coordinates}>
                          Lat: {laporan.latitude || "0"} | Lng: {laporan.longitude || "0"}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.mapButton}
                      activeOpacity={0.8}
                      onPress={handleOpenMap}
                    >
                      <Ionicons name="navigate-circle-outline" size={20} color="#FFFFFF" />
                      <Text style={styles.mapButtonText}>Buka di Google Maps</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {isOwner && (
                <View style={styles.ownerActionsRow}>
                  <TouchableOpacity
                    style={[styles.ownerActionBtn, styles.editReportBtn]}
                    activeOpacity={0.8}
                    onPress={handleStartEdit}
                  >
                    <Ionicons name="create-outline" size={18} color="#5B9CF6" />
                    <Text style={styles.editReportText}>Edit Laporan</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.ownerActionBtn, styles.deleteReportCardBtn]}
                    activeOpacity={0.8}
                    onPress={handleDeleteReport}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    <Text style={styles.deleteReportText}>Hapus Laporan</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          <View style={styles.commentsCard}>
            <View style={styles.commentsHeader}>
              <Ionicons name="chatbubbles-outline" size={20} color="#5B9CF6" />
              <Text style={styles.commentsTitle}>
                Komentar Warga ({laporan.comments?.length || 0})
              </Text>
            </View>

            <View style={styles.commentsThread}>
              {laporan.comments && laporan.comments.length > 0 ? (
                laporan.comments.map((comment: any) => {
                  const isCommentOwner = currentUser && comment.userId === currentUser.id;
                  return (
                    <View key={comment.id} style={styles.commentItem}>
                      <View style={styles.commentAvatar}>
                        <Text style={styles.commentAvatarText}>
                          {getInitials(comment.user?.name || "A")}
                        </Text>
                      </View>
                      
                      <View style={styles.commentBubble}>
                        <View style={styles.commentHeaderRow}>
                          <Text style={styles.commentAuthor}>
                            {comment.user?.name || "Anonim"}
                          </Text>
                          {isCommentOwner && (
                            <TouchableOpacity
                              style={styles.deleteCommentBtn}
                              activeOpacity={0.7}
                              onPress={() => handleDeleteComment(comment.id)}
                            >
                              <Ionicons name="trash-outline" size={16} color="#EF4444" />
                            </TouchableOpacity>
                          )}
                        </View>
                        <Text style={styles.commentText}>{comment.comment}</Text>
                        <Text style={styles.commentTime}>{formatDate(comment.createdAt)}</Text>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={styles.emptyComments}>
                  <Ionicons name="chatbubble-ellipses-outline" size={32} color="#94A3B8" />
                  <Text style={styles.emptyCommentsTitle}>Belum Ada Komentar</Text>
                  <Text style={styles.emptyCommentsDesc}>
                    Jadilah yang pertama memberikan masukan tentang masalah ini.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.commentInputWrapper}>
          <TextInput
            style={styles.commentInput}
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Tulis tanggapan Anda..."
            placeholderTextColor="#94A3B8"
            maxLength={250}
          />
          <TouchableOpacity
            style={[
              styles.commentSendBtn,
              !commentText.trim() && styles.commentSendBtnDisabled,
            ]}
            activeOpacity={0.8}
            onPress={handlePostComment}
            disabled={!commentText.trim() || submittingComment}
          >
            {submittingComment ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 14,
    marginBottom: 14,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  userAvatarText: {
    color: "#5B9CF6",
    fontSize: 16,
    fontWeight: "800",
  },

  userName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },

  date: {
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

  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
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

  reportTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    lineHeight: 24,
    marginBottom: 10,
  },

  reportDesc: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    fontWeight: "500",
    marginBottom: 16,
  },

  imageContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },

  attachmentImage: {
    width: "100%",
    height: 200,
  },

  locationSection: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
  },

  locationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  locationTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#475569",
  },

  coordinates: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 3,
    fontWeight: "600",
  },

  mapButton: {
    marginTop: 12,
    height: 44,
    backgroundColor: "#5B9CF6",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },

  mapButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  ownerActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  ownerActionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },

  editReportBtn: {
    borderColor: "#bfdbfe",
  },

  deleteReportCardBtn: {
    borderColor: "#FEE2E2",
  },

  editReportText: {
    color: "#5B9CF6",
    fontWeight: "800",
    fontSize: 13,
  },

  deleteReportText: {
    color: "#EF4444",
    fontWeight: "800",
    fontSize: 13,
  },

  commentsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },

  commentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 12,
    marginBottom: 16,
  },

  commentsTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  commentsThread: {
    gap: 14,
  },

  commentItem: {
    flexDirection: "row",
    gap: 10,
  },

  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },

  commentAvatarText: {
    color: "#5B9CF6",
    fontSize: 13,
    fontWeight: "800",
  },

  commentBubble: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 12,
  },

  commentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  commentAuthor: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },

  deleteCommentBtn: {
    padding: 2,
  },

  commentText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    marginTop: 4,
    fontWeight: "500",
  },

  commentTime: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 6,
    fontWeight: "600",
  },

  emptyComments: {
    alignItems: "center",
    paddingVertical: 24,
  },

  emptyCommentsTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 10,
  },

  emptyCommentsDesc: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 4,
    fontWeight: "500",
    maxWidth: 220,
    lineHeight: 16,
  },

  commentInputWrapper: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    gap: 12,
  },

  commentInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 24,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "600",
  },

  commentSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#5B9CF6",
    justifyContent: "center",
    alignItems: "center",
  },

  commentSendBtnDisabled: {
    backgroundColor: "#CBD5E1",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 14,
  },

  errorDesc: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
    fontWeight: "500",
  },

  editFormHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 12,
    marginBottom: 16,
  },

  editFormTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 8,
    marginTop: 10,
  },

  subLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 6,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "600",
  },

  textArea: {
    height: 120,
    paddingTop: 14,
    paddingBottom: 14,
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },

  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  categoryPillActive: {
    backgroundColor: "#5B9CF6",
    borderColor: "#5B9CF6",
  },

  editCategoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  severityContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  severityCard: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
  },

  editSeverityText: {
    fontSize: 13,
  },

  locationGrid: {
    flexDirection: "row",
    gap: 12,
  },

  locationCol: {
    flex: 1,
  },

  locationButton: {
    height: 48,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
  },

  locationButtonText: {
    color: "#5B9CF6",
    fontSize: 13,
    fontWeight: "700",
  },

  imagePreviewContainer: {
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 6,
  },

  imagePreview: {
    width: "100%",
    height: 180,
  },

  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
  },

  uploadCard: {
    height: 120,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginTop: 6,
  },

  uploadTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },

  editActionContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  actionBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  cancelBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  cancelBtnText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "700",
  },

  submitBtn: {
    backgroundColor: "#5B9CF6",
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },

  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
