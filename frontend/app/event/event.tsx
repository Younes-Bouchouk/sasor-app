import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useFetchQuery } from "../../hooks/useFetchQuery";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function EventScreen() {
  const router = useRouter();
  const { data: events, isLoading, error } = useFetchQuery("events", "/events");

  if (isLoading) return <ActivityIndicator size="large" color="#007AFF" style={styles.center} />;
  if (error) return <Text style={styles.errorText}>Erreur de chargement</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push({ pathname: "/event/[id]", params: { id: item.id.toString() } })}
            >
            <Image 
              source={{ uri: item.image || "https://i.ibb.co/SwQk3MHz/logo-white-mini.png" }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.sportType}>🏆 {item.sport}</Text>
              {/* <Text style={styles.date}>📅 {format(new Date(item.plannedAt), "dd MMMM yyyy", { locale: fr })}</Text> */}
              <Text style={styles.location}>📍 {item.location}</Text>
              <Text style={styles.participants}>👥 {item.maxParticipants} participants max</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 20 },
  
  card: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 15, elevation: 3 },
  image: { width: "100%", height: 200 },
  cardContent: { padding: 15 },
  eventName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  sportType: { fontSize: 16, color: "#555", marginTop: 5 },
  date: { fontSize: 14, color: "#777", marginTop: 5 },
  location: { fontSize: 14, color: "#007AFF", fontWeight: "bold", marginTop: 5 },
  participants: { fontSize: 14, color: "#E74C3C", fontWeight: "bold", marginTop: 5 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16 },
});
