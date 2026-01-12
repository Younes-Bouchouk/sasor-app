import Container from "@/components/ui/container";
import React from "react";
import { Dimensions, Image, StyleSheet } from "react-native";

const {width, height} = Dimensions.get("window")

export default function MapScreen() {
  return (
    <Container withPadding={false}>
      {/* <ThemedText type="subtitle" style={{ textAlign: "center" }}>
        Map
      </ThemedText> */}
      <Image
        source={require("@/assets/images/capture_map.png")}
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
