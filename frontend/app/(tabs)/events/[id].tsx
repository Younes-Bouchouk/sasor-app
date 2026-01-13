import { IconSymbol } from "@/components/ui/icon-symbol";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function EventScreen() {

  const { id } = useLocalSearchParams<{ id: string }>();

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
      <TouchableOpacity style={{
        position: "absolute",
        left: 20,
      }}
        onPress={()=>router.back()}
      >
        <IconSymbol
          name="xmark"
          color="white"
          size={32}
        />
      </TouchableOpacity>
      <Text style={{ color: "white" }}>{id}</Text>
    </View>
  );
}
