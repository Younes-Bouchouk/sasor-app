import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Platform, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthProvider"; // Importer le contexte AuthProvider

export default function Header() {
  const router = useRouter();
  const { user } = useAuth(); // Récupérer les informations utilisateur depuis le contexte

  // Définir l'image de profil ou une image par défaut
  const profileImage = user?.image || "https://i.ibb.co/SwQk3MHz/logo-white-mini.png";

  console.log("Image de profil utilisée :", profileImage); // Vérifiez l'URL de l'image

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Image
            source={{ uri: profileImage }} // Utiliser l'image de profil ou l'image par défaut
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "pink",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Ombre pour Android
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "android" || Platform.OS === "ios" ? StatusBar.currentHeight || 38 : 38,
    paddingBottom: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
});