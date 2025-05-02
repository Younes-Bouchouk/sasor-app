import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function Message() {
  const { id } = useLocalSearchParams();
  const {
    data: datamessage,
    isLoading,
    error,
  } = useFetchQuery("message", `/events/1/messages`);

  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (messageText.trim() === "") return;
    // 👇 À remplacer par une vraie requête d'envoi
    console.log("Message envoyé :", messageText);
    setMessageText(""); // Réinitialiser le champ
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Erreur : {error.message}</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
          Chat de l'événement
        </Text>
        <FlatList
          data={datamessage}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 8,
                marginBottom: 8,
                backgroundColor: "#eee",
                borderRadius: 5,
              }}
            >
              <Image
                source={{ uri: item.sender.image }}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  marginRight: 10,
                }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "bold" }}>{item.sender.pseudo}</Text>
                <Text>{item.message}</Text>
              </View>
            </View>
          )}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderTopWidth: 1,
            borderColor: "#ccc",
            paddingTop: 8,
          }}
        >
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Écrire un message..."
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginRight: 8,
              marginBottom: 100,
            }}
          />
          <View style={{ marginBottom: 100 }}>
            <Button title="Envoyer" onPress={handleSendMessage} />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
