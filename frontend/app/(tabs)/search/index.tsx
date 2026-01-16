import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { getSportImage } from "@/utils/imageMapper";

type SearchTab = "events" | "users";

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("events");

  const searchEndpoint = searchQuery.trim()
    ? `/${activeTab}?search=${encodeURIComponent(searchQuery)}`
    : `/${activeTab}?limit=10`;

  const {
    data: items,
    isLoading,
    error,
    refetch,
  } = useFetchQuery(
    ["search", activeTab, searchQuery],
    searchEndpoint,
    500 
  );

  const renderEvent = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/event/${item.id}`)}
    >
      <Image
        source={{ uri: item.image || getSportImage(item.sport) }}
        style={styles.eventImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>
          <Ionicons name="basketball" size={14} color="#18FD9C" /> {item.sport}
        </Text>
        <Text style={styles.location}>
          <Ionicons name="location" size={12} color="#666" /> {item.location}
        </Text>
        <Text style={styles.participants}>
          <Ionicons name="people" size={12} color="#18FD9C" />{" "}
          {item.participation?.length || 0}/{item.maxParticipants}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderUser = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/profile/${item.id}`)}
    >
      <Image
        source={{
          uri:
            item.image ||
            `https://ui-avatars.com/api/?name=${item.username}&background=18FD9C&color=000`,
        }}
        style={styles.userImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.subtitle}>@{item.pseudo}</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileButtonText}>Voir profil</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Rechercher des ${activeTab === "events" ? "événements..." : "utilisateurs..."}`}
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Onglets */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "events" && styles.activeTab]}
          onPress={() => setActiveTab("events")}
        >
          <Text style={[styles.tabText, activeTab === "events" && styles.activeTabText]}>
            Événements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "users" && styles.activeTab]}
          onPress={() => setActiveTab("users")}
        >
          <Text style={[styles.tabText, activeTab === "users" && styles.activeTabText]}>
            Utilisateurs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#18FD9C" style={styles.loader} />
        ) : error ? (
          <Text style={styles.error}>Erreur de chargement</Text>
        ) : !items || items.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name={activeTab === "events" ? "calendar-outline" : "people-outline"}
              size={60}
              color="#333"
            />
            <Text style={styles.emptyText}>
              {searchQuery
                ? `Aucun ${activeTab === "events" ? "événement" : "utilisateur"} trouvé`
                : `Aucun ${activeTab === "events" ? "événement" : "utilisateur"} disponible`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={activeTab === "events" ? renderEvent : renderUser}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        )}
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 50,
    
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#18FD9C",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#18FD9C",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#000",
  },
  content: {
    flex: 1,
  },
  loader: {
    marginTop: 50,
  },
  error: {
    color: "#ff4444",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  eventImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: "#222",
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#18FD9C",
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#18FD9C",
    marginBottom: 5,
  },
  location: {
    fontSize: 13,
    color: "#666",
    marginBottom: 5,
  },
  participants: {
    fontSize: 13,
    color: "#18FD9C",
    fontWeight: "600",
  },
  profileButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#18FD9C",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  profileButtonText: {
    color: "#18FD9C",
    fontSize: 12,
    fontWeight: "600",
  },
});