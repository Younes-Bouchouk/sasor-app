import Container from "@/components/ui/container";
import React from "react";
import { Dimensions, Image, StyleSheet } from "react-native";

const {width, height} = Dimensions.get("window")

export default function HomeScreen() {
  return (
    <Container withPadding={false}>
      {/* <ThemedText type="subtitle" style={{ textAlign: "center" }}>
        Accueil
      </ThemedText> */}
      <Image
        source={require("@/assets/images/capture_home.png")}
        resizeMode="cover"
        style={{
          width,
          height,
        }}
      />
    </Container>
  );
}

const styles = StyleSheet.create({});
