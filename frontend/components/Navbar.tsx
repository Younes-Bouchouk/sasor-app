import { useNavigationContext } from "@/contexts/navigation-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { RelativePathString, router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Navbar({ state, navigation }: BottomTabBarProps) {
  const { currentScreenIndex, setCurrentScreenIndex } = useNavigationContext();
  
  const isOnIndexScreen = state.routes[state.index].name === "index";

  useEffect(()=>{
    console.log("- - - - - - - - - -")
    state.routes.map(route => {
      console.log(route)
    })
    console.log("- - - - - - - - - -")
  },[])

  const handleIndexToggle = () => {
    if (!isOnIndexScreen) {
      router.push({
        pathname: "/",
        params: { screenIndex: currentScreenIndex.toString() },
      });
    } else {
      const nextIndex = currentScreenIndex === 0 ? 1 : 0;
      setCurrentScreenIndex(nextIndex);
  
      router.push({
        pathname: "/",
        params: { screenIndex: nextIndex.toString() },
      });
    }
  };

  const navigate = (screen: string) => {
    if (screen === "index") {
      handleIndexToggle();
    } else {
      router.push({
        pathname: `/${screen}` as RelativePathString,
      });
    }
  };

  const getIconName = () => {
    return currentScreenIndex === 0 ? "map" : "house";
  };

  return (
    <View style={[styles.container]}>
      <BlurView
        intensity={20}
        tint="dark"
        style={{
          borderColor: "#555",
          borderWidth: 1,
          borderRadius: "100%",
          overflow: "hidden",
        }}
      >
        <TouchableOpacity
          onPress={handleIndexToggle}
          style={{
            height: 60,
            aspectRatio: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <IconSymbol
            name={getIconName()}
            color="white"
            size={32}
          /> */}
          <Ionicons name={currentScreenIndex === 0 ? "map" : "home"} size={32} color="white" />
        </TouchableOpacity>
      </BlurView>

      <BlurView
        style={{
          flex: 1,
          height: 60,
          borderColor: "#555",
          borderWidth: 1,
          borderRadius: 30,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {state.routes.map((route, index) => {
          // if (["index", "_sitemap", "+not-found"].includes(route.name)) return null;
          if (!["create", "events", "search"].includes(route.name)) return null;
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigate(route.name)}
              style={{
                borderWidth: 0,
                borderColor: "green",
                height: 60,
                flex: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              {route.name === "create" ? (
                <Ionicons name="add" size={32} color="white" />
                // <IconSymbol name="plus" color={"white"} size={32} />
              ) : route.name === "events" ? (
                <Ionicons name="calendar" size={32} color="white" />
              ) : route.name === "search" ? (
                <Ionicons name="search" size={32} color="white" />
                // <IconSymbol name="magnifyingglass" color={"white"} size={32} />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderWidth: 0,
    borderColor: "green",
    display: "flex",
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "rgb(0,0,0,0.5)",
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  indexButton: {},
});
