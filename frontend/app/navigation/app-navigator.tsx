import Modal from "@/components/ui/modal";
import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import CreateEventScreen from "../(tabs)/create-event";
import HomeScreen from "../(tabs)/home";
import MapScreen from "../(tabs)/map";
import MyEventsScreen from "../(tabs)/my-events";
import SearchScreen from "../(tabs)/search";
import HorizontalNavigator from "./horizontal-navigator";
import Navbar from "./navbar";
import { ScreenType, ViewsType } from "./navigation.types";
import EventScreen from "../index";

const { width } = Dimensions.get("window");

// const today = new Date();

const views: ViewsType = {
  main : [
    { id: "1", name: "map", screen: <MapScreen/>, icon: "map" },
    { id: "2", name: "home", screen: <HomeScreen/>, icon: "house" },
  ],
  nav : [
    { id: "3", name: "create", screen: <CreateEventScreen/>, icon: "plus", mode: "modal" },
    { id: "4", name: "events", screen: <MyEventsScreen/> , icon: "calendar", mode: "page" },
    { id: "5", name: "search", screen: <SearchScreen/>, icon: "magnifyingglass", mode: "page" },
  ],
  other : []
}

export default function AppNavigator() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("home");
  const [currentModal, setCurrentModal] = useState<ScreenType | null>(null);
  const [currentMainViewIndex, setCurrentMainViewIndex] = useState<number>(0);

  // Calculer la marge horizontale pour la modal
  const horizontalMargin = Math.max(16, width * 0.06);

  const renderScreen = (type: "page" | "modal") => {
    switch (type === "page" ? currentScreen : currentModal) {
      case "home":
        return (
          <HorizontalNavigator
            currentViewIndex={currentMainViewIndex}
            onViewChange={setCurrentMainViewIndex}
            views={[
              { id: "1", screen: <EventScreen/> },
              { id: "2", screen: <HomeScreen /> },
            ]}
          />
        );
      case "create":
        return <CreateEventScreen />;
      case "events":
        return <MyEventsScreen />;
      case "search":
        return <SearchScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  const displayModal = (screen : ScreenType) => {
    setCurrentModal(screen)
  }

  const hideModal = () => {
    setCurrentModal(null)
  }

  const toggleHomeMap = () => {
    if (currentScreen === "home") {
      setCurrentMainViewIndex((prev) => (prev === 0 ? 1 : 0));
    } else {
      setCurrentScreen("home");
      setCurrentMainViewIndex(0);
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.content]}>{renderScreen("page")}</View>

      {currentModal && (
        <View style={[styles.modal]}>
          <Modal
            visible={true}
            horizontalMargin={horizontalMargin}
            hideModal={hideModal}
            
          >
            {renderScreen("modal")}
          </Modal>
        </View>
      )}

      <Navbar
        currentScreen={currentScreen}
        isMapView={currentMainViewIndex === 0}
        navigateTo={navigateTo}
        onToggleHomeMap={toggleHomeMap}
        displayModal={displayModal}
        views={views}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
  content: {
    flex: 1,
    width: "100%",
  },
  modal: {
    zIndex: 5,
    backgroundColor: "rgb(0,0,0,0.8)",
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
