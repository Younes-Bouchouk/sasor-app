import React from "react";
import { Text, View, ActivityIndicator, FlatList } from "react-native";
import { useFetchQuery } from "../hooks/useFetchQuery";

export default function EventScreen() {
  const { data, isLoading, error } = useFetchQuery(
    "/events",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHNldWRvIjoia2hhbGlkIiwiaWF0IjoxNzQxMTgxODk4LCJleHAiOjE3NDM3NzM4OTh9.Ucten3UhlPda7ZSAAhw7cqvCyXbm_3a2kavLD4HEKWw"
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des événements...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", fontSize: 16 }}>Erreur de chargement des événements</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Liste des événements
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "white",
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3, // Pour Android
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
              {item.name}
            </Text>
            <Text style={{ color: "#555" }}>🏆 Sport : {item.sport}</Text>
            <Text style={{ color: "#555" }}>👥 Participants max : {item.maxParticipants}</Text>
            <Text style={{ color: "#555" }}>📍 Lieu : {item.location}</Text>
            <Text style={{ color: "#888", fontSize: 12 }}>📅 Créé le : {item.plannedAt}</Text>
          </View>
        )}
      />
    </View>
  );
}
