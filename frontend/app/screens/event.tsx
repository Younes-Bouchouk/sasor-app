import React from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Image } from "react-native";
import { useFetchQuery } from "../../hooks/useFetchQuery"; 
import { useAuth } from "../../contexts/AuthProvider";

export default function EventScreen() {
  const { token } = useAuth();
  const { data, isLoading, error } = useFetchQuery("event","/events");


  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erreur de chargement des événements</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Événements </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Image de l'événement (image par défaut si aucune image n'est dispo) */}
            <Image 
              source={{ uri: item.image || "https://media.discordapp.net/attachments/1171507476168978523/1337375709793882112/logo_white_mini.png?ex=67cb78f0&is=67ca2770&hm=1f960710a4beade9be6922c0fb8d6cf92c549d497e22fb0eab34f3f9146e3620&=&format=webp&quality=lossless&width=625&height=625" }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.sportType}>🏆 {item.sport}</Text>
              <Text style={styles.date}>📅 {item.plannedAt}</Text>
              <Text style={styles.date}>{item.maxParticipants}</Text>
              <Text style={styles.date}>{item.location}</Text>


            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#18709E",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 200,
  },
  cardContent: {
    padding: 15,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sportType: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
