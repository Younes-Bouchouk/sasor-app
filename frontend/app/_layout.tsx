import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider } from "../contexts/AuthProvider";

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "index") iconName = "home-outline";
            else if (route.name === "event") iconName = "calendar-outline";

            return <Ionicons name={iconName} size={size} color={color}  />;
          },
          tabBarActiveTintColor: "#18709E",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            position: "absolute",
            bottom: 25,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            marginHorizontal: 20,
            paddingVertical: 15,
            borderRadius:25,
            borderCurve: 'continuous',
            shadowColor: 'black',
            shadowOffset: {width: 0, height:10},
            shadowRadius:10,
            shadowOpacity: 0.1,

          },
        })}
      >
        <Tabs.Screen name="index" options={{ title: "Accueil" }} />
        <Tabs.Screen name="event" options={{ title: "Événements" }} />
        <Tabs.Screen name="login" options={{ href: null }} />
        <Tabs.Screen name="register" options={{ href: null }} />


      </Tabs>
    </QueryClientProvider>
    </AuthProvider>
  );
}
