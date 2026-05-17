import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { createLaporan } from "../../services/laporan";

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

export default function CreateLaporan() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [severity, setSeverity] = useState("low");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Izin Ditolak",
          "Aplikasi membutuhkan izin galeri untuk mengunggah foto pendukung."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Gagal memilih gambar:", error);
      Alert.alert("Error", "Gagal membuka galeri foto.");
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
  };

  const handleGetLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Izin Ditolak",
          "Aplikasi membutuhkan izin lokasi untuk mendeteksi koordinat secara otomatis."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLatitude(location.coords.latitude.toFixed(6));
      setLongitude(location.coords.longitude.toFixed(6));
    } catch (error) {
      console.error("Gagal mendapatkan lokasi:", error);
      Alert.alert("Error", "Gagal mendapatkan lokasi GPS Anda.");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Peringatan", "Judul laporan dan deskripsi wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("latitude", latitude.trim() || "0");
      formData.append("longitude", longitude.trim() || "0");
      formData.append("severity", severity);
      formData.append("categoryId", categoryId);

      if (imageUri) {
        const localUri = imageUri;
        const filename = localUri.split("/").pop() || "image.jpg";

        // Infer file type
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append("image", {
          uri: Platform.OS === "android" ? localUri : localUri.replace("file://", ""),
          name: filename,
          type: type,
        } as any);
      }

      await createLaporan(formData);
      Alert.alert("Sukses", "Laporan berhasil dikirim!", [
        { text: "OK", onPress: () => router.replace("/dashboard") },
      ]);
    } catch (error: any) {
      console.error("Gagal mengirim laporan:", error);
      Alert.alert(
        "Gagal Mengirim",
        error.response?.data?.message || "Terjadi kesalahan saat menghubungi server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Buat Laporan</Text>
          <Text style={styles.headerSubtitle}>Laporkan masalah di sekitar Anda</Text>
        </View>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
        
        {/* INFORMASI LAPORAN SECTION */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="document-text-outline" size={20} color="#5B9CF6" />
            <Text style={styles.sectionTitle}>Informasi Masalah</Text>
          </View>

          {/* Judul Laporan */}
          <Text style={styles.label}>Judul Laporan</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Contoh: Jalan berlubang di RT 05"
            placeholderTextColor="#94A3B8"
          />

          {/* Deskripsi */}
          <Text style={styles.label}>Deskripsi Kejadian</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Jelaskan masalah secara detail agar segera ditindaklanjuti..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Kategori Selector */}
          <Text style={styles.label}>Kategori Masalah</Text>
          <View style={styles.categoryContainer}>
            {CATEGORY_OPTIONS.map((c) => {
              const isActive = categoryId === String(c.id);
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.categoryPill,
                    isActive && styles.categoryPillActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setCategoryId(String(c.id))}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isActive && styles.categoryTextActive,
                    ]}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Severity Selector */}
          <Text style={[styles.label, { marginTop: 8 }]}>Tingkat Urgensi</Text>
          <View style={styles.severityContainer}>
            {SEVERITY_OPTIONS.map((s) => {
              const isActive = severity === s.value;
              return (
                <TouchableOpacity
                  key={s.value}
                  style={[
                    styles.severityCard,
                    { borderColor: s.color },
                    isActive && { backgroundColor: s.bg },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSeverity(s.value)}
                >
                  <Ionicons
                    name={isActive ? "alert-circle" : "alert-circle-outline"}
                    size={18}
                    color={s.color}
                  />
                  <Text
                    style={[
                      styles.severityText,
                      { color: s.color, fontWeight: isActive ? "800" : "600" },
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* LOKASI SECTION */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="map-outline" size={20} color="#5B9CF6" />
            <Text style={styles.sectionTitle}>Lokasi Masalah</Text>
          </View>

          <View style={styles.locationGrid}>
            <View style={styles.locationCol}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput
                style={styles.input}
                value={latitude}
                onChangeText={setLatitude}
                placeholder="-6.200000"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.locationCol}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput
                style={styles.input}
                value={longitude}
                onChangeText={setLongitude}
                placeholder="106.816666"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.locationButton}
            activeOpacity={0.8}
            onPress={handleGetLocation}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <ActivityIndicator size="small" color="#5B9CF6" />
            ) : (
              <>
                <Ionicons name="location-outline" size={18} color="#5B9CF6" />
                <Text style={styles.locationButtonText}>Dapatkan Lokasi GPS Saat Ini</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* FOTO PENDUKUNG SECTION */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="image-outline" size={20} color="#5B9CF6" />
            <Text style={styles.sectionTitle}>Foto Pendukung</Text>
          </View>

          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageButton}
                activeOpacity={0.7}
                onPress={handleRemoveImage}
              >
                <Ionicons name="close-circle" size={26} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadCard}
              activeOpacity={0.7}
              onPress={handlePickImage}
            >
              <Ionicons name="cloud-upload-outline" size={32} color="#94A3B8" />
              <Text style={styles.uploadTitle}>Ketuk untuk Memilih Foto</Text>
              <Text style={styles.uploadDesc}>Maksimal ukuran foto 5 MB (JPG, PNG)</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ACTIONS ROW */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.cancelBtn]}
            activeOpacity={0.8}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelBtnText}>Batal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.submitBtn]}
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
                <Text style={styles.submitBtnText}>Kirim Laporan</Text>
              </>
            )}
          </TouchableOpacity>
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
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },

  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#5B9CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 12,
    marginBottom: 16,
  },

  sectionTitle: {
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

  categoryText: {
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

  severityText: {
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
    marginTop: 16,
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
    height: 140,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  uploadTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
    marginTop: 10,
  },

  uploadDesc: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
    fontWeight: "500",
  },

  actionContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },

  actionBtn: {
    flex: 1,
    height: 52,
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
    fontSize: 15,
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
    fontSize: 15,
    fontWeight: "700",
  },
});
