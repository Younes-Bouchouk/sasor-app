import React from "react";
import { Text, View, ActivityIndicator, FlatList } from "react-native";
import { useFetchQuery } from "../hooks/useFetchQuery"; 

export default function EventScreen() {
  const { data, isLoading, error } = useFetchQuery(
    "/events", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHNldWRvIjoia2hhbGlkIiwiaWF0IjoxNzQxMTgxODk4LCJleHAiOjE3NDM3NzM4OTh9.Ucten3UhlPda7ZSAAhw7cqvCyXbm_3a2kavLD4HEKWw"
  );

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Erreur de chargement des événements</Text>;
  }


  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Liste des événements :</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 16 }}>{item.name}</Text>
            <Text style={{ color: "gray" }}>{item.sport}</Text>
            <Text style={{ color: "gray" }}>maxParticipants: {item.maxParticipants} </Text>
            <Text style={{ color: "gray" }}> A {item.location}</Text>
            <Text   style={{ color: "gray" }}>créer le :{item.plannedAt} </Text>
          </View>
        )}
      />
    </View>
  );
}
