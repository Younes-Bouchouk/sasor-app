import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, Image, ActivityIndicator, 
  StyleSheet, FlatList, Dimensions, Modal 
} from "react-native";
import { useRouter } from "expo-router";
import { useFetchQuery } from "../hooks/useFetchQuery";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import CreateEvent from "@/app/event/createEvent";

const { width } = Dimensions.get("window");

export default function EventScreen() {
  const router = useRouter();
  const { data: events, isLoading, error, refetch } = useFetchQuery("events", "/events");
  const [modalVisible, setModalVisible] = useState(false);
  const viewableItems = useSharedValue([]);

  const getSportImage = (sport: string) => {
    const sportImages = {
      football: "https://i.ibb.co/rW4vqpn/Chat-GPT-Image-31-mars-2025-23-21-50.png",
      basketball: "https://i.ibb.co/Zpk7xJbh/Chat-GPT-Image-31-mars-2025-23-23-03.png",
      baseball: "https://i.ibb.co/sdz83t3q/Chat-GPT-Image-1-avr-2025-10-16-49.png",
      default: "https://i.ibb.co/SwQk3MHz/logo-white-mini.png",
    };
    return sportImages[sport.toLowerCase()] || sportImages.default;
  };

  if (isLoading) return <ActivityIndicator size="large" color="#18709E" style={styles.center} />;
  if (error) return <Text style={styles.errorText}>Erreur de chargement</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={({ viewableItems: vItems }) => {
          viewableItems.value = vItems;
        }}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 30 }} // Empêche les événements de passer sous la barre de nav

        renderItem={({ item }) => (
          <ListItem item={item} viewableItems={viewableItems} router={router} getSportImage={getSportImage} />
        )}
      />

      {/* Bouton flottant pour créer un événement */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.floatingButtonText}>＋</Text>
      </TouchableOpacity>

      {/* Modal pour la création d'événement */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
            <CreateEvent onClose={() => setModalVisible(false)} refetch={refetch} />
      </Modal>
    </View>
  );
}

// 📌 Composant animé pour chaque élément de la liste
const ListItem = React.memo(({ item, viewableItems, router, getSportImage }) => {
  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value
        .filter((i) => i.isViewable)
        .find((viewableItem) => viewableItem.item.id === item.id)
    );

    return {
      opacity: withTiming(isVisible ? 1 : 0.5),
      transform: [{ scale: withTiming(isVisible ? 1 : 0.8) }],
    };
  }, []);

  return (
    <Animated.View style={[styles.cardContainer, rStyle]}>
      <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: "/event/[id]", params: { id: item.id.toString() } })}>
        <Image source={{ uri: item.image || getSportImage(item.sport) }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.eventName}>{item.name}</Text>
          <Text style={styles.sportType}> {item.sport}</Text>
          <Text style={styles.location}> {item.location}</Text>
          <Text style={styles.participants}> {item.maxParticipants} Sasoriens max</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", paddingTop: 10 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16, textAlign: "center" },

  cardContainer: {
    width: width - 40,
    alignSelf: "center",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  cardContent: { flex: 1 },
  eventName: { fontSize: 18, fontWeight: "bold", color: "#18709E" },
  sportType: { fontSize: 14, color: "#555", marginTop: 5 },
  location: { fontSize: 14, color: "#18709E", fontWeight: "bold", marginTop: 5 },
  participants: { fontSize: 14, color: "#E74C3C", fontWeight: "bold", marginTop: 5 },

  // 🔘 Bouton flottant 
  floatingButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: "#18709E",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  floatingButtonText: { color: "#fff", fontSize: 30, fontWeight: "bold" },

  // 🎨 Modale
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 10,
  },
});

export default EventScreen;