import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { useFetchQuery } from "@/hooks/useFetchQuery";

export default function Profile() {
  const { token, logout } = useAuth();
  const navigation = useNavigation();
  const { data: profile, isLoading, error, refetch } = useFetchQuery("profile", "/users/me");

  // Réexécuter la requête quand l'utilisateur change (utile après connexion/déconnexion)
  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token]);

  const handleLogout = async () => {
    await logout();
  };

  if (!token) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Vous n'êtes pas connecté.</Text>
        <Button title="veuillez vous connecter" onPress={() => navigation.navigate("login")} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Erreur de chargement des données.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <View style={styles.card}>
        <Text style={styles.label}>📧 Email:</Text>
        <Text style={styles.value}>{profile.email}</Text>

        <Text style={styles.label}>👤 Pseudo:</Text>
        <Text style={styles.value}>{profile.pseudo}</Text>

        <Text style={styles.label}>🎂 Anniversaire:</Text>
        <Text style={styles.value}>
            {new Date(profile.birthday).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })}
        </Text>

        <Text style={styles.label}>📅 Créé le:</Text>
        <Text style={styles.value}>
            {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })}
        </Text>
      </View>

      <Button title="Se Déconnecter" onPress={handleLogout} color="#E74C3C" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 10, elevation: 2, width: "100%" },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, marginBottom: 10 },
});
