import React, { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthProvider";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { token, logout } = useAuth();

  // 🔁 Redirection automatique si on est déconnecté
  useEffect(() => {
    if (!token) {
      navigation.reset({
        index: 0,
        routes: [{ name: "login" }],
      });
    }
  }, [token]);

  const handleLogout = async () => {
    await logout();
  };

  const settingsOptions = [
    {
      title: "Profil",
      icon: "person-circle-outline",
      onPress: () => navigation.navigate("profile"),
    },
    {
      title: "Notifications",
      icon: "notifications-outline",
      onPress: () => Alert.alert("Notifications", "Paramètres de notifications à venir."),
    },
    {
      title: "Confidentialité",
      icon: "lock-closed-outline",
      onPress: () => Alert.alert("Confidentialité", "Paramètres de confidentialité à venir."),
    },
    {
      title: "Langue",
      icon: "language-outline",
      onPress: () => Alert.alert("Langue", "Changer la langue de l'application."),
    },
    {
      title: "À propos",
      icon: "information-circle-outline",
      onPress: () => Alert.alert("À propos", "Informations sur l'application."),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Réglages</Text>

        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={option.onPress}
          >
            <Ionicons name={option.icon} size={24} color="#18709E" />
            <Text style={styles.optionText}>{option.title}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#18709E",
    textAlign: "center",
    marginVertical: 30,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E74C3C",
    paddingVertical: 14,
    marginTop: 30,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});
