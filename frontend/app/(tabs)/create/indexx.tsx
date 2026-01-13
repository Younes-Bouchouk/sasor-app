import React from "react";
import { Text, View } from "react-native";

export default function CreateScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#222",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white" }}>Page de création d&apos;évent</Text>
    </View>
  );
}
