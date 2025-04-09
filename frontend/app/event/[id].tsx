
import { 
  View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Modal, Alert 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFetchQuery } from "../../hooks/useFetchQuery";
import { useJoinEvent } from "../../hooks/useJoinEvent";
import { useExitEvent } from "../../hooks/useExitEvent";
import { useAuth } from "../../contexts/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { getSportImage } from "@/utils/imageMapper";
import { ScrollView } from "react-native-gesture-handler";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { fetchAPI } from "@/services/api";
import { useImageUploader } from "@/hooks/useImageUploader";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const isValidDate = (d: any) => {
    return d instanceof Date && !isNaN(d.getTime());
  };

  
  const { uploadImageToImgBB, updateImage } = useImageUploader();

  const updateEventImage = async (eventId: number) => {
    const imageUrl = await uploadImageToImgBB();
    if (imageUrl) {
      await updateImage(imageUrl, `/events/${eventId}`, token);
      queryClient.invalidateQueries({ queryKey: [`event-${eventId}`] }); // Rafraîchir les données
    }
  };
  
  if (!id) return <Text style={styles.errorText}>Erreur : ID d'événement invalide</Text>;

  if (!id)
    return (
      <Text style={styles.errorText}>Erreur : ID d'événement invalide</Text>
    );

  const {
    data: event,
    isLoading,
    error,
  } = useFetchQuery(`event-${id}`, `/events/${id}`);
  const { data: participants, isLoading: loadingParticipants } = useFetchQuery(
    `participants-${id}`,
    `/events/${id}/participants`
  ); 
  const { mutate, isPending } = useJoinEvent();
  const { mutate: exitEvent } = useExitEvent();

  const handleJoinEvent = () => {
    mutate(event.id, {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: [`participants-${id}`] }),
    });
  };

  const handleExitEvent = () => {
    exitEvent(event.id, {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: [`participants-${id}`] }),
    });
  };

  if (isLoading) return <ActivityIndicator size="large" color="#0ABDE3" />;
  if (error)
    return (
      <Text style={styles.errorText}>
        Erreur lors du chargement de l'événement
      </Text>
    );
  if (!event)
    return <Text style={styles.errorText}>Aucun événement trouvé</Text>;

  console.log("Token :", user.token);
  console.log("Event ID :", event.id);

  return (
    <View style={styles.container}>

    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
    <TouchableOpacity onPress={() => updateEventImage(event.id)}>
  <Image
    source={{ uri: event.image || getSportImage(event.sport) }}
    style={styles.image}
  />
</TouchableOpacity>
      {/* Contenu de l'événement */}
      <ScrollView style={styles.detailsContainer}>
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.sportType}>Sport : {event.sport}</Text>
        <Text style={styles.date}>
        {isValidDate(new Date(event.plannedAt))
          ? format(new Date(event.plannedAt), "dd MMMM yyyy", { locale: fr })
          : "Date inconnue"}
      </Text>

          <Text style={styles.location}>Lieu : {event.location}</Text>
          <Text style={styles.participants}>
            Participants max : {event.maxParticipants}
          </Text>
          <Text style={styles.description}>
            {event.description || "Aucune description disponible."}
          </Text>

          {/* Boutons d'action */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoinEvent}
              disabled={isPending}
            >
              <Text style={styles.buttonText}>
                {isPending ? "Inscription..." : "Rejoindre l'événement"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exitButton}
              onPress={handleExitEvent}
            >
              <Text style={styles.buttonText}>Quitter l'événement</Text>
            </TouchableOpacity>
          </View>

          {/* Liste des participants (Modale) */}
          <TouchableOpacity
            style={styles.participantButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Voir les participants</Text>
          </TouchableOpacity>

          <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Participants</Text>
                {loadingParticipants ? (
                  <ActivityIndicator size="small" color="#0ABDE3" />
                ) : (
                  <FlatList
                    data={participants}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => 
                          router.push({
                            pathname: "/profile/[id]",
                            params: { id: item.participantId.toString() },
                          })
                        }
                      >
                        <View style={styles.participantItem}>
                          {/* Image du participant */}
                          <Image
                            source={{
                              uri:
                                item.participant?.image ||
                                "https://via.placeholder.com/150",
                            }}
                            style={styles.participantImage}
                            onError={(error) =>
                              console.error(
                                "Erreur de chargement de l'image :",
                                error.nativeEvent
                              )
                            }
                          />
                          {/* Informations du participant */}
                          <View style={styles.participantInfo}>
                            <Text style={styles.participantName}>
                              {item.participant?.pseudo || "Inconnu"}
                            </Text>
                            <Text style={styles.joinedAt}>
                              {isValidDate(new Date(event.plannedAt))
                                ? format(
                                    new Date(event.plannedAt),
                                    "dd MMMM yyyy",
                                    { locale: fr }
                                  )
                                : "Date inconnue"}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Fermer</Text>
                </TouchableOpacity>
              </View>

            </View>
          </Modal>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: "100%", height: 350, resizeMode: "cover" },
  detailsContainer: { padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  sportType: { fontSize: 18, color: "#18709E", marginBottom: 5 },
  date: { fontSize: 16, color: "#EEEEEE", marginBottom: 5 },
  location: { fontSize: 16, marginBottom: 5 },
  participants: { fontSize: 16, color: "#E74C3C", marginBottom: 10 },
  scrollContainer: { paddingBottom: 100 },
  description: { fontSize: 14, textAlign: "center" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  joinButton: {
    backgroundColor: "#18709E",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  exitButton: {
    backgroundColor: "#E74C3C",
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  participantButton: {
    backgroundColor: "#575757",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontWeight: "bold", textAlign: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  participantItem: {
    flexDirection: "row", // Organise les éléments horizontalement
    alignItems: "center", // Aligne verticalement au centre
    backgroundColor: "#2A2A2A",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  participantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10, // Espace entre l'image et les informations
    backgroundColor: "#ccc", // Couleur de fond pour vérifier si l'image est chargée
  },
  participantInfo: {
    flex: 1, // Prend tout l'espace restant
    justifyContent: "center", // Centre verticalement les textes
  },
  participantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  joinedAt: {
    fontSize: 14,
    color: "#BBBBBB",
    marginTop: 4, // Espace entre le pseudo et la date
  },

  closeButton: {
    backgroundColor: "#FF5252",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  errorText: {
    color: "#E74C3C",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
});
