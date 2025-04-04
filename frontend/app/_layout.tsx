import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider } from "../contexts/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Tabs
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ color, size }) => {
                let iconName: "calendar-outline" | "person-outline" | "person-add-outline" | undefined;
                if (route.name === "index") iconName = "calendar-outline";
                else if (route.name === "profile") iconName = "person-outline";
                else if (route.name === "follow") iconName = "person-add-outline";

                return iconName ? (
                  <Ionicons name={iconName} size={size} color={color} />
                ) : null; // Ajout d'une condition de sécurité
              },
              tabBarActiveTintColor: "#18709E",
              tabBarInactiveTintColor: "gray",
              tabBarStyle: {
                position: "absolute",
                bottom: 25,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "white",
                marginHorizontal: 20,
                paddingVertical: 15,
                borderRadius: 25,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 10 },
                shadowRadius: 10,
                shadowOpacity: 0.1,
              },
            })}
          >
            {/* Onglets visibles */}
            <Tabs.Screen name="index" options={{ title: "Événements" }} />
            <Tabs.Screen name="profile" options={{ title: "profil" }} />
            <Tabs.Screen name="follow" options={{ title: "abonnement" }} />

            {/* Onglets cachés */}
            <Tabs.Screen name="login" options={{ href: null }} />
            <Tabs.Screen name="register" options={{ href: null }} />
            <Tabs.Screen name="event/[id]" options={{ href: null }} />
            <Tabs.Screen name="event/createEvent" options={{ href: null }} />
          </Tabs>
        </QueryClientProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
