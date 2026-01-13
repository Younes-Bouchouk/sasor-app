import { Tabs } from "expo-router";
import React from "react";

import Navbar from "@/components/Navbar";
// import { HapticTab } from "@/components/haptic-tab";
// import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <Navbar {...props}/>}
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        // own: false,
        // tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Accueil" }} />
      <Tabs.Screen name="create" options={{ title: "Créer" }}/>
      <Tabs.Screen name="events" options={{ title: "Events" }}/>
      <Tabs.Screen name="search" options={{ title: "Recherche" }}/>
    </Tabs>
  );
}
