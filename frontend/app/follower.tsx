import { useAuth } from "@/contexts/AuthProvider";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { fetchAPI } from "@/services/api";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";

export default function FollowerPage() {
  const [followers, setFollowers] = useState([]);
  const {
    data: followersData,
    isLoading: loadingFollowers,
    error: errorFollowers,
    refetch,
  } = useFetchQuery("followers", "/follows/me/followers");

  useEffect(() => {
    if (followersData) {
      setFollowers(followersData);
    }
  }, [followersData]);

  useFocusEffect(
    useCallback(() => {
      refetch(); // Rafraîchit les données à chaque fois que la page est affichée
    }, [refetch])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mes abonnés</Text>
      {loadingFollowers ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : errorFollowers ? (
        <Text style={styles.errorText}>Erreur : {errorFollowers.message}</Text>
      ) : (
        <FlatList
  data={followers}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => {
    const formattedDate = new Date(item.followedAt).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    console.log("Image URL:", item.follower?.image);

    return (
      <View style={styles.listItem}>
        <Image
          source={{
            uri:
              item.follower?.image ||
              "https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
          }}
          style={styles.image}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name}>{item.follower?.pseudo || "Utilisateur inconnu"}</Text>
          <Text style={styles.date}>Suivi depuis : {formattedDate}</Text>
        </View>
      </View>
    );
  }}
/>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25, // Pour un effet circulaire
    backgroundColor: "#ccc", // Ajoutez une couleur de fond pour vérifier si l'image est bien chargée
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
  },
});