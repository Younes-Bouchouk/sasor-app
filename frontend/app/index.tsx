import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal,
  Alert,
  ViewToken,
} from "react-native";
import { useRouter } from "expo-router";
import { useFetchQuery } from "../hooks/useFetchQuery";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Swipeable } from "react-native-gesture-handler";
import CreateEvent from "@/app/event/createEvent";
import { getSportImage } from "@/utils/imageMapper";
import { fetchAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthProvider";

const { width } = Dimensions.get("window");

// 1. Définir les types pour les props de ListItem
interface EventItem {
  id: number;
  name: string;
  sport: string;
  location: string;
  maxParticipants: number;
  image?: string;
}

interface ListItemProps {
  item: EventItem;
  router: any; 
  getSportImage: (sport: string | undefined) => any;
  isOwner: boolean;
  refetch: () => Promise<any>;
  viewableItems: any;
}

export default function EventScreen() {
  const router = useRouter();
  const {
    data: events,
    isLoading,
    error,
    refetch,
  } = useFetchQuery("events", "/events");
  const { data: myEvents, refetch: refetchMyEvents } = useFetchQuery(
    "myEvents",
    "/events/me"
  );
  // Réexécuter la requête quand l'utilisateur change (utile après connexion/déconnexion)
  const { token, logout } = useAuth();
  useEffect(() => {
    refetch();
    refetchMyEvents();
  }, [token]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const viewableItems = useSharedValue<ViewToken<any>[]>([]);
  

  if (isLoading)
    return (
      <ActivityIndicator size="large" color="#18709E" style={styles.center} />
    );
  if (error) return <Text style={styles.errorText}>Erreur de chargement</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 30 }}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            router={router}
            getSportImage={getSportImage}
            isOwner={Array.isArray(myEvents) && myEvents.some((e) => e.id === item.id)}
            refetch={refetch}
            viewableItems={viewableItems}
          />
        )}
        onViewableItemsChanged={({ viewableItems: vItems }) => {
          viewableItems.value = vItems;
        }}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>＋</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <CreateEvent
          onClose={() => setModalVisible(false)}
          refetch={refetch}
          refetchMyEvents={refetchMyEvents}
        />
      </Modal>
    </View>
  );
}

// 2. Composant ListItem avec les types définis
const ListItem = React.memo(
  ({ item, router, getSportImage, isOwner, refetch, viewableItems }: ListItemProps) => {
    const { token } = useAuth(); // Utilisation du token pour la suppression

    const handleDelete = async () => {
      // Si l'utilisateur n'est pas le propriétaire, il ne peut pas supprimer l'événement
      if (!isOwner) {
        Alert.alert("Erreur", "Vous ne pouvez supprimer que vos propres événements.");
        return;
      }

      Alert.alert(
        "Supprimer l'événement",
        "Voulez-vous vraiment supprimer cet événement ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              try {
                // Suppression de l'événement via l'API avec vérification du token
                await fetchAPI(`/events/${item.id}`, "DELETE", token, {});
                await refetch(); 
              } catch (error) {
                console.error("Erreur lors de la suppression de l'événement:", error);
                Alert.alert("Erreur", "Une erreur s'est produite lors de la suppression.");
              }
            },
          },
        ]
      );
    };

    const rStyle = useAnimatedStyle(() => {
      const isVisible = viewableItems.value.some(
        (viewableItem: { item: { id: any; }; }) => viewableItem.item.id === item.id
      );
      return {
        opacity: withTiming(isVisible ? 1 : 0.5),
        transform: [{ scale: withTiming(isVisible ? 1 : 0.8) }],
      };
    });

    return (
      <Swipeable
        enabled={isOwner} // Swipeable n'est activé que si l'utilisateur est le propriétaire
        renderRightActions={() => (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash" size={24} color="white" />
          </TouchableOpacity>
        )}
      >
        <Animated.View style={[styles.cardContainer, rStyle]}>
          <TouchableOpacity
            style={styles.card}
            onLongPress={isOwner ? handleDelete : null}
            onPress={() =>
              router.push({
                pathname: "/event/[id]",
                params: { id: item.id.toString() },
              })
            }
          >
            <Image
              source={{ uri: item.image || getSportImage(item.sport) }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.sportType}> {item.sport}</Text>
              <Text style={styles.location}> {item.location}</Text>
              <Text style={styles.participants}>
                {item.maxParticipants} Sasoriens max
              </Text>
            </View>
            {isOwner && (
              <View style={styles.ownerBadge}>
                <Ionicons name="star" size={20} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Swipeable>
    );
  }
);


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingTop: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16, textAlign: "center" },
  cardContainer: { width: width - 40, alignSelf: "center", marginVertical: 10 },
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
  location: {
    fontSize: 14,
    color: "#18709E",
    fontWeight: "bold",
    marginTop: 5,
  },
  participants: {
    fontSize: 14,
    color: "#E74C3C",
    fontWeight: "bold",
    marginTop: 5,
  },

  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
    borderRadius: 15,
    marginRight: 10,
  },
  ownerBadge: {
    backgroundColor: "#FFD700",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    right: 10,
  },
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
  },
  floatingButtonText: { color: "#fff", fontSize: 30, fontWeight: "bold" },
});

export { ListItem }; // exportation nommée de ListItem
