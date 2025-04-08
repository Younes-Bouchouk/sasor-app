import { useAuth } from "@/contexts/AuthProvider";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { fetchAPI } from "@/services/api";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";

export default function FollowPage() {
  const { data: followers, isLoading: loadingFollowers, error: errorFollowers,refetch } = useFetchQuery(
    "follows",
    "/follows/me/following"
  );
  // Réexécuter la requête quand l'utilisateur change (utile après connexion/déconnexion)
    const { token, logout } = useAuth();
    useEffect(() => {
      refetch(); 
    }, [token]);

  // Fonction pour récupérer le message d'erreur lisible
  const getErrorMessage = (error: any) => {
    if (error instanceof Error) {
      return error.message;
    }
    return "Une erreur est survenue.";
  };

  return (
    <View style={styles.container}>

      {/* Liste des abonnés */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>mes abonnements</Text>
        {loadingFollowers ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : errorFollowers ? (
            <Text style={styles.errorText}>{getErrorMessage(errorFollowers)}</Text>
          ) : (
            <FlatList
            data={followers}
            keyExtractor={(item) => item.id.toString()
              
            }
            renderItem={({ item }) => {
              const formattedDate = new Date(item.followedAt).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              });
              return (
              <View style={styles.listItem}>
                <Text>{item.following.pseudo}</Text>
                <Text>{formattedDate}</Text>
                
                    <TouchableOpacity
                    onPress={async () => {  
                      try {
                                    // pour arreter de suivre l'utilisateur
                                    const body = { followingId: item.following.id };
                                    await fetchAPI(`/follows/me`, "DELETE", token, body);
                                    console.log(body)
                                    await refetch(); 
                                  } catch (error) {
                                    console.error("Erreur lors de la suppression de l'événement:", error);
                                    Alert.alert("Erreur", "Une erreur s'est produite lors de la suppression.");
                                  }} }
                    style={styles.button}
                    >
                    <Text style={styles.buttonText}>Ne plus suivre</Text>
                    </TouchableOpacity>
              </View>
              );
            }}
            />
          )}
              
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    flex: 1,
    backgroundColor: "#fff",
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
