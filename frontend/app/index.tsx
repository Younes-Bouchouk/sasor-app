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
import { ref } from "yup";

const { width } = Dimensions.get("window");

interface EventItem {
  id: number;
  organizerId: number;
  name: string;
  sport: string;
  location: string;
  visibility: string;
  maxParticipants: number;
  image?: string;
  participation: any[];
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
  const [selectedSource, setSelectedSource] = useState<"all" | "friends" | "joined">("all");
  const { token, user } = useAuth();
  const {
    data: events,
    isLoading: loadingAll,
    error: errorAll,
    refetch: refetchAll,
  } = useFetchQuery("events", "/events");

  const {
    data: eventsFollowers,
    isLoading: loadingEventsFollowers,
    error: errorEventsFollowers,
    refetch: refetchEventsFollowers,
  } = useFetchQuery("eventsFollowers", "/events/followers");

  const {
    data: eventsJoined,
    isLoading: loadingEventsJoined,
    error: errorEventsJoined,
    refetch: refetchEventsJoined,
  } = useFetchQuery("eventsJoined", "/events/me");

  useEffect(() => {
    refetchAll();
    refetchEventsFollowers();
  }, [token]);

  const [modalVisible, setModalVisible] = useState(false);
  const viewableItems = useSharedValue<ViewToken<any>[]>([]);

  const getFilteredEvents = () => {
    if (selectedSource === "all") {
      return events.filter((event: EventItem) => !event.participation.length && event.visibility === "PUBLIC")
    } else if (selectedSource === "friends") {
      return eventsFollowers.filter((event: EventItem) => !event.participation.length)
    } else if (selectedSource === "joined") {
      return eventsJoined.map((event: EventItem) => event)
    } else {
      return events
    }
  }

  const getAllEventsRefetch = async () => {
    await refetchAll();
    await refetchEventsFollowers();
  }

  const getCurrentLoading = () =>
    selectedSource === "friends" ? loadingEventsFollowers : loadingAll;
  const getCurrentError = () =>
    selectedSource === "friends" ? errorEventsFollowers : errorAll;


  if (getCurrentLoading()) {
    return (
      <ActivityIndicator size="large" color="#18709E" style={styles.center} />
    );
  }

  if (getCurrentError()) {
    return <Text style={styles.errorText}>Erreur de chargement</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Boutons de filtrage */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedSource === "all" && styles.selectedButton,
          ]}
          onPress={() => setSelectedSource("all")}
        >
          <Text
            style={[
              styles.toggleButtonText,
              selectedSource === "all" && styles.selectedText,
            ]}
          >
            Tous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedSource === "friends" && styles.selectedButton,
          ]}
          onPress={() => setSelectedSource("friends")}
        >
          <Text
            style={[
              styles.toggleButtonText,
              selectedSource === "friends" && styles.selectedText,
            ]}
          >
            Mes abonnements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedSource === "joined" && styles.selectedButton,
          ]}
          onPress={() => setSelectedSource("joined")}
        >
          <Text
            style={[
              styles.toggleButtonText,
              selectedSource === "joined" && styles.selectedText,
            ]}
          >
            Rejoint
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getFilteredEvents()}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            router={router}
            getSportImage={getSportImage}
            isOwner={
                item.organizerId === user?.id
            }
            refetch={async () => getAllEventsRefetch()}
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
          refetch={refetchAll}
          refetchMyEvents={refetchEventsFollowers}
        />
      </Modal>
    </View>
  );
}

const ListItem = React.memo(
  ({
    item,
    router,
    getSportImage,
    isOwner,
    refetch,
    viewableItems,
  }: ListItemProps) => {
    const { token } = useAuth();

    const handleDelete = async () => {
      if (!isOwner) {
        Alert.alert("Erreur", "Vous ne pouvez supprimer que vos propres événements.");
        return;
      }

      Alert.alert("Supprimer", "Confirmez la suppression ?", [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await fetchAPI(`/events/${item.id}`, "DELETE", token, {});
              await refetch();
            } catch (error) {
              Alert.alert("Erreur", "Échec de la suppression.");
            }
          },
        },
      ]);
    };

    const rStyle = useAnimatedStyle(() => {
      const isVisible = viewableItems.value.some(
        (viewableItem) => viewableItem.item.id === item.id
      );
      return {
        opacity: withTiming(isVisible ? 1 : 0.5),
        transform: [{ scale: withTiming(isVisible ? 1 : 0.9) }],
      };
    });

    return (
      <Swipeable
        enabled={isOwner}
        renderRightActions={() => (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash" size={24} color="white" />
          </TouchableOpacity>
        )}
      >
        <Animated.View style={[styles.cardContainer, rStyle]}>
          <TouchableOpacity
            style={styles.card}
            onLongPress={isOwner ? handleDelete : undefined}
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
              <Text style={styles.sportType}>{item.sport}</Text>
              <Text style={styles.location}>{item.location}</Text>
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

  // Boutons toggle (voir tous / mes événements)
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
  },
  toggleButtonText: {
    color: "#18709E",
    fontWeight: "bold",
  },
  selectedButton: {
    backgroundColor: "#18709E",
  },
  selectedText: {
    color: "white",
  },
});

export { ListItem };
