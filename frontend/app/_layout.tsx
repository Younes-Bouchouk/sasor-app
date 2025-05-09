import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider } from "@/contexts/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import Header from "../components/ui/header"; // Import du Header

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {/* Ajout du Header */}
          <Header />
          <Tabs
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ color, size }) => {
                let iconName: "calendar-outline" | "person-outline" | "person-add-outline" | "search-outline" | "mail-open-outline" | undefined;
                if (route.name === "index") iconName = "calendar-outline";
                else if (route.name === "search") iconName = "search-outline";
                else if (route.name === "event/eventsList") iconName = "mail-open-outline";
                return iconName ? (
                  <Ionicons name={iconName} size={size} color={color} />
                ) : null;
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
            <Tabs.Screen name="index" options={{ title: "Événements" }} />
            <Tabs.Screen name="search" options={{ title: "Recherche" }} />
            <Tabs.Screen name="profile" options={{ href:null }} />
            <Tabs.Screen name="follower" options={{ href: null  }} />
            <Tabs.Screen name="following" options={{ href: null  }} />
            <Tabs.Screen name="settings" options={{ href:null }} />
            <Tabs.Screen name="login" options={{ href: null }} />
            <Tabs.Screen name="register" options={{ href: null }} />
            <Tabs.Screen name="event/[id]" options={{ href: null }} />
            <Tabs.Screen name="event/createEvent" options={{ href: null }} />
            <Tabs.Screen name="profile/[id]" options={{href:null  }} />
            <Tabs.Screen name="event/message/[id]" options={{href:null  }} />
            <Tabs.Screen name="event/eventsList" options={{title:"eventsList"  }} />
          </Tabs>
        </QueryClientProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}