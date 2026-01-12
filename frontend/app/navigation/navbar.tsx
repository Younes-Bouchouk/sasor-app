import { IconSymbol } from "@/components/ui/icon-symbol.ios";
import { BlurView } from "expo-blur";
import { SFSymbol } from "expo-symbols";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { ScreenType, ViewsType } from "./navigation.types";

const { width } = Dimensions.get("window");

type Props = {
  currentScreen: ScreenType;
  isMapView: boolean;
  navigateTo: (screen: ScreenType) => void;
  onToggleHomeMap: () => void;
  displayModal: (screen:ScreenType) => void;
  views: ViewsType
};

export default function Navbar({
  currentScreen,
  isMapView,
  navigateTo,
  onToggleHomeMap,
  displayModal,
  views
}: Props) {

  // Récupérer la date d'aujourd'hui
  const today = new Date();

  // Calculer la marge horizontale pour la navbar
  const horizontalMargin = Math.max(16, width * 0.06);

  return (
    <View
      style={[
        styles.navbar,
        {
          left: horizontalMargin,
          right: horizontalMargin,
          bottom: horizontalMargin,
        },
      ]}
    >
      <BlurView
        intensity={20}
        tint="dark"
        style={[styles.leftContainer]}
      >
        <NavButton 
          icon={isMapView ? views.main[1].icon : views.main[0].icon} 
          onPress={() => {
            if (currentScreen === views.main[1].name) {
              onToggleHomeMap();
            } else {
              navigateTo(views.main[1].name);
            }
          }}
        />
      </BlurView>

      <BlurView 
        tint="dark"
        intensity={20}
        style={[styles.rightContainer]}
      >
        {
          views.nav.map(view => (
            <NavButton 
              key={view.id}
              icon={view.icon} 
              onPress={()=>{
                if (view.mode === "page") navigateTo(view.name)
                else if (view.mode === "modal") displayModal(view.name)
              }}
            />
          ))
        }
      </BlurView>
    </View>
  );
}

function NavButton({ icon, onPress }: { icon: string, onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.button]}
      onPress={onPress}
    >
      <IconSymbol name={icon as SFSymbol} color="white" size={32} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    height: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  leftContainer: {
    // backgroundColor: "rgba(34, 34, 34, 0.5)",
    
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    overflow:"hidden"
  },
  rightContainer: {
    flex: 1,
    // backgroundColor: "#222",
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    overflow: "hidden"
  },
  button: {
    aspectRatio: "1/1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  testBorder: {
    borderWidth: 1,
    borderColor: "green",
  },
});
