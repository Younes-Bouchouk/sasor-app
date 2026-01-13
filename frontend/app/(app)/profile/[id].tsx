import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useLocalSearchParams } from "expo-router";

const ProfileScreen = () => {
  const [tiltX, setTiltX] = useState(new Animated.Value(0));
  const [tiltY, setTiltY] = useState(new Animated.Value(0));
  const [opacity, setOpacity] = useState(new Animated.Value(0)); // Pour l'animation de l'opacité
  const { id } = useLocalSearchParams();
  const {
    data: userdata,
    isLoading: loadingUser,
    error: errorUser,
    refetch,
  } = useFetchQuery(`user-${id}`,`/users/${id}`);
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: tiltX, translationY: tiltY } }],
    { useNativeDriver: false }
  );

  const tiltXInterpolation = tiltX.interpolate({
    inputRange: [-150, 150],
    outputRange: ["-10deg", "10deg"],
  });

  const tiltYInterpolation = tiltY.interpolate({
    inputRange: [-150, 150],
    outputRange: ["10deg", "-10deg"],
  });

  const scaleInterpolation = tiltX.interpolate({
    inputRange: [-150, 150],
    outputRange: [1, 1.05],
  });

  const resetTilt = () => {
    Animated.spring(tiltX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    Animated.spring(tiltY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  // Utilisation de useEffect pour animer l'opacité
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1, // La cible d'opacité (visible)
      duration: 500, // Durée de l'animation
      useNativeDriver: true, // Utilisation du moteur natif pour les animations
    }).start();
  }, []);

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={resetTilt}
    > 
    <View style={{ flex: 1 }}>
      {userdata && (
        <Animated.View
          style={[
            styles.box,
            {
              transform: [
                { rotateX: tiltYInterpolation },
                { rotateY: tiltXInterpolation },
                { scale: scaleInterpolation },
              ],
            },
          ]}
        >
          <Image
            source={{
              uri:
                userdata.image ||
                "https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.rang}>{userdata.createdAt}</Text>
          <Animated.Text style={[styles.name, { opacity }]}>
            {userdata.pseudo}
          </Animated.Text>
          <Text style={styles.sexe}>{userdata.sexe}</Text>
          <Text style={styles.Text}>{userdata.birthday}</Text>

          <Text style={styles.description}>{userdata.description}</Text>
        </Animated.View>
      )}
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Prendre toute la hauteur de l'écran
    justifyContent: "center", // Centrer le contenu verticalement
    alignItems: "center", // Centrer le contenu horizontalement
    backgroundColor: "#fff",
  },
  box: {
    width: 300,
    height: 400,
    backgroundColor: "rgba(19,55,159, 0.1)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
    margin: 60,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 19,
  },
  name: {
    position: "relative",
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    zIndex: 9,
  },
  sexe: {
    color: "gray",
    fontSize: 16,
  },

  Text: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },

  rang: {
    color: "#483d8b",
    fontWeight: "600",
    textAlign: "center",
  },

  description: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 10, // Pour ne pas avoir le texte collé aux bords
  },
});

export default ProfileScreen;
