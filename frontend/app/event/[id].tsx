import { View, Text, Image, StyleSheet, Button, FlatList, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFetchQuery } from "../../hooks/useFetchQuery";
import { useJoinEvent } from "../../hooks/useJoinEvent";
import { useExitEvent } from "../../hooks/useExitEvent"; 
import { useAuth } from "../../contexts/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth(); // Récupérer l'utilisateur connecté
  const queryClient = useQueryClient();

  if (!id) return <Text>Erreur : ID d'événement invalide</Text>;

  const { data: event, isLoading, error } = useFetchQuery(`event-${id}`, `/events/${id}`);
  const { data: participants, isLoading: loadingParticipants } = useFetchQuery(`participants-${id}`, `/events/${id}/participants`);

  const { mutate, isPending } = useJoinEvent();
  const { mutate: exitEvent } = useExitEvent(); 

  const handleJoinEvent = () => {
    mutate(event.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`participants-${id}`] }); // Rafraîchir la liste des participants
      },
    });
  };

  
  const handleExitEvent = () => {
    exitEvent(event.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [`participants-${id}`] }); // Rafraîchir la liste des participants
        },
      });
  };

  if (isLoading) return <ActivityIndicator size="large" color="#007AFF" />;
  if (error) return <Text style={styles.errorText}>Erreur lors du chargement de l'événement</Text>;
  if (!event) return <Text style={styles.errorText}>Aucun événement trouvé</Text>;
    

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: event.image || "https://i.ibb.co/SwQk3MHz/logo-white-mini.png" }}
        style={styles.image}
      />
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.sportType}>🏆 Sport : {event.sport}</Text>
      <Text style={styles.date}>📅 {format(new Date(event.plannedAt), "dd MMMM yyyy", { locale: fr })}</Text>
      <Text style={styles.location}>📍 Lieu : {event.location}</Text>
      <Text style={styles.participants}>👥 Participants max : {event.maxParticipants}</Text>
      <Text style={styles.description}>{event.description || "Aucune description disponible."}</Text>

      <Button title="Retour" onPress={() => router.push({ pathname: "/event/event" })} />

      {/* Bouton pour rejoindre l'événement */}
      <Button
        title={isPending ? "Inscription en cours..." : "Rejoindre cet événement"}
        onPress={handleJoinEvent}
        disabled={isPending}
      />
      

       {/* Bouton pour quitter l'événement */}
  
        <Button
          title="Quitter l'événement"
          onPress={handleExitEvent}
          color="red"
        />
      

      <Text style={styles.subtitle}>👥 Liste des Participants :</Text>

      {loadingParticipants ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : (
        <FlatList
          data={participants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.participantItem}>
              <Text style={styles.participantName}>{item.participant.pseudo}</Text>
              <Text style={styles.joinedAt}>🕒 {format(new Date(item.joinedAt), "dd MMMM yyyy à HH:mm", { locale: fr })}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", backgroundColor: "#fff" },
  image: { width: "100%", height: 250, borderRadius: 10, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  sportType: { fontSize: 18, color: "#555", marginTop: 5 },
  date: { fontSize: 16, color: "#777", marginTop: 5 },
  location: { fontSize: 16, color: "#007AFF", fontWeight: "bold", marginTop: 5 },
  participants: { fontSize: 16, color: "#E74C3C", fontWeight: "bold", marginTop: 5 },
  description: { fontSize: 14, color: "#666", marginTop: 10, textAlign: "center" },
  errorText: { color: "red", fontSize: 16, marginTop: 10 },
  subtitle: { fontSize: 20, fontWeight: "bold", marginTop: 20, color: "#007AFF" },
  participantItem: { backgroundColor: "#F3F3F3", padding: 10, marginVertical: 5, borderRadius: 10, width: "100%" },
  participantName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  joinedAt: { fontSize: 14, color: "#666" },
});
