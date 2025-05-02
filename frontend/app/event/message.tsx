import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View, Image, ActivityIndicator, FlatList } from "react-native";

export default function Message() {
  const { id } = useLocalSearchParams();
  const {
    data: datamessage,
    isLoading,
    error,
  } = useFetchQuery("message", `/events/1/messages`);
  console.log(datamessage);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Erreur : {error.message}</Text>;
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Chat de l'événement
      </Text>
      <FlatList
        data={datamessage}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 8,
              marginBottom: 8,
              backgroundColor: "#eee",
              borderRadius: 5,
            }}
          >
            <Image
              source={{
                uri: item.sender.image,
              }}
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
              }}
            />
            <Text style={{ fontWeight: "bold" }}>{item.sender.pseudo}</Text>
            <Text>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}
