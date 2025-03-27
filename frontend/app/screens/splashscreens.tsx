import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const [fadeAnim] = useState(new Animated.Value(0)); // Animation de fondu
  const router = useRouter();

  useEffect(() => {
    // Animation de fondu
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500, // 1.5s
      useNativeDriver: true,
    }).start();

    // Redirige vers l'app après 2.5s
    setTimeout(() => {
      router.replace("/screens/register"); // Remplace par ton écran principal
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/splash.png")} // Mets ton image ici
        style={[styles.logo, { opacity: fadeAnim }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Change la couleur de fond selon ton design
  },
  logo: {
    width: 200, // Ajuste la taille selon ton image
    height: 200,
  },
});
