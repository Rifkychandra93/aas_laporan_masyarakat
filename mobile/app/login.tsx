import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
} from "react-native";

import { router } from "expo-router";
import { loginUser } from "../services/auth";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser(email, password);

      router.replace("/dashboard");
    } catch (error) {
      console.log(error);

      Alert.alert("Error", "Login gagal");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topCircle} />

      <View style={styles.content}>
        <Image
          source={require("../assets/images/logo1.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Report <Text style={styles.blue}>in</Text>
        </Text>

        <Text style={styles.subtitle}>
          Laporkan, kami tindak lanjuti
        </Text>

        <View style={styles.form}>
          <Text style={styles.heading}>
            Selamat datang kembali
          </Text>

          <Text style={styles.description}>
            Masuk untuk melanjutkan
          </Text>

          <Text style={styles.label}>Email</Text>

          <TextInput
            placeholder="Masukkan email Anda"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>

          <TextInput
            placeholder="Masukkan password Anda"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Masuk</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push("/register")
            }
          >
            <Text style={styles.registerText}>
              Belum punya akun?{" "}
              <Text style={styles.registerBlue}>
                Daftar sekarang
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomCircle} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  topCircle: {
    position: "absolute",
    top: -120,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 200,
    backgroundColor: "#5B9CF6",
    opacity: 0.15,
  },

  bottomCircle: {
    position: "absolute",
    bottom: -150,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 200,
    backgroundColor: "#5B9CF6",
    opacity: 0.1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "flex-start",
    paddingTop: 60,
  },

  logo: {
    width: 110,
    height: 110,
    alignSelf: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 38,
    fontWeight: "800",
    textAlign: "center",
    color: "#111827",
  },

  blue: {
    color: "#5B9CF6",
  },

  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 40,
    fontSize: 15,
  },

  form: {
    width: "100%",
  },

  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  description: {
    color: "#6B7280",
    marginBottom: 25,
    fontSize: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 18,
    backgroundColor: "#F9FAFB",
    fontSize: 15,
    marginBottom: 15,
  },

  button: {
    height: 55,
    backgroundColor: "#5B9CF6",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#5B9CF6",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  registerText: {
    textAlign: "center",
    marginTop: 24,
    color: "#6B7280",
  },

  registerBlue: {
    color: "#5B9CF6",
    fontWeight: "700",
  },
});