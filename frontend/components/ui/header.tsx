import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Platform, StatusBar } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "@/contexts/AuthProvider";

export default function Header() {
  const router = useRouter();
  const segments = useSegments(); // Récupère les segments de la route actuelle
  const { user } = useAuth();

  // Définir l'image de profil ou une image par défaut
  const profileImage = user?.image || "https://i.ibb.co/SwQk3MHz/logo-white-mini.png";

  // Cacher le header sur certaines routes
  const hiddenRoutes = ["event", "settings","profile"];
  const isHidden = hiddenRoutes.some((route) => segments.includes(route));

  if (isHidden) {
    return null; // Ne pas afficher le Header
  }

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // headerContainer: {
  //   overflow: "hidden",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 10,
        
  // },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: Platform.OS === "android" || Platform.OS === "ios" ? StatusBar.currentHeight || 38 : 38,
    position: "fixed",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "white",
    position: "fixed",
  },
});