import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Animated, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useFetchQuery } from "../../hooks/useFetchQuery";
import { useEffect, useRef, useState } from "react";
import { useCreateEvent } from "@/hooks/useCreateEvents";

export default function EventScreen() {
  const router = useRouter();
  const { data: events, isLoading, error, refetch } = useFetchQuery("events", "/events");
  const { mutate, isPending, isError, error: mutationError } = useCreateEvent();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [eventData, setEventData] = useState({
    name: "",
    sport: "",
    maxParticipants: "",
    location: "",
    plannedAt: "",
    visibility: "PUBLIC",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    if (!eventData.name || !eventData.sport || !eventData.maxParticipants || !eventData.location || !eventData.plannedAt) {
      setErrorMessage("Tous les champs sont requis !");
      return false;
    }
    setErrorMessage(""); // Clear previous errors
    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;
  
    const formData = { ...eventData, maxParticipants: parseInt(eventData.maxParticipants, 10) };
  
    mutate(formData, {
      onSuccess: (data) => {
        setSuccessMessage("Événement créé avec succès !");
        setModalVisible(false);
  
        // Mettre à jour la liste des événements
        refetch();  // Recharger la liste des événements
  
        // Optionnellement, tu peux aussi ajouter une animation ou un message pour montrer que le nouvel événement est bien créé
      },
      onError: (err: any) => {
        setErrorMessage(err.message || "Erreur lors de la création de l'événement.");
      },
    });
  };
  

  if (isLoading) return <ActivityIndicator size="large" color="#007AFF" style={styles.center} />;
  if (error) return <Text style={styles.errorText}>Erreur de chargement</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: "/event/[id]", params: { id: item.id.toString() } })}
            >
              <Image
                source={{ uri: item.image || getSportImage(item.sport) }}
                style={styles.image}
              />
              <View style={styles.cardContent}>
                <Text style={styles.eventName}>{item.name}</Text>
                <Text style={styles.sportType}>🏆 {item.sport}</Text>
                <Text style={styles.location}>📍 {item.location}</Text>
                <Text style={styles.participants}>👥 {item.maxParticipants} max</Text>
               
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      />

      {/* Bouton flottant pour créer un événement */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.floatingButtonText}>＋</Text>
      </TouchableOpacity>

      {/* Modal de création d'événement */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Créer un événement</Text>
            <TextInput placeholder="Nom" style={styles.input} onChangeText={(text) => setEventData({ ...eventData, name: text })} />
            <TextInput placeholder="Sport" style={styles.input} onChangeText={(text) => setEventData({ ...eventData, sport: text })} />
            <TextInput placeholder="Max Participants" keyboardType="numeric" style={styles.input} onChangeText={(text) => setEventData({ ...eventData, maxParticipants: text })} />
            <TextInput placeholder="Lieu" style={styles.input} onChangeText={(text) => setEventData({ ...eventData, location: text })} />
            <TextInput placeholder="Date (YYYY-MM-DD)" style={styles.input} onChangeText={(text) => setEventData({ ...eventData, plannedAt: text })} />
            <TextInput placeholder="Visibilité" style={styles.input} onChangeText={(text) => setEventData({ ...eventData, visibility: text })} />
            
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
            
            <TouchableOpacity style={styles.createButton} onPress={submit}>
              <Text style={styles.createButtonText}>Créer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getSportImage = (sport: string) => {
  const sportImages = {
    football: "https://i.ibb.co/rW4vqpn/Chat-GPT-Image-31-mars-2025-23-21-50.png",
    basketball: "https://i.ibb.co/Zpk7xJbh/Chat-GPT-Image-31-mars-2025-23-23-03.png",
    baseball: "https://i.ibb.co/zVGWrJNj/splash-icon-white.png",
    default: "https://i.ibb.co/zVGWrJNj/splash-icon-white.png",
  };
  return sportImages[sport.toLowerCase()] || sportImages.default ;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16, textAlign: "center" },
  successText: { color: "green", fontSize: 16, textAlign: "center" },
  cardContainer: { flex: 1, padding: 8 },
  card: { backgroundColor: "#fff", borderRadius: 12, overflow: "hidden", elevation: 3 },
  image: { width: "100%", height: 150 },
  cardContent: { padding: 10 },
  eventName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  sportType: { fontSize: 14, color: "#555", marginTop: 5 },
  location: { fontSize: 14, color: "#007AFF", fontWeight: "bold", marginTop: 5 },
  participants: { fontSize: 14, color: "#E74C3C", fontWeight: "bold", marginTop: 5 },
  floatingButton: { position: "absolute", bottom: 120, right: 20, backgroundColor: "#007AFF", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  floatingButtonText: { color: "#fff", fontSize: 30, fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 },
  createButton: { backgroundColor: "#007AFF", padding: 10, borderRadius: 5, alignItems: "center" },
  createButtonText: { color: "#fff", fontWeight: "bold" },
  cancelText: { marginTop: 10, textAlign: "center", color: "red" },
});
