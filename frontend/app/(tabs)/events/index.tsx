import { router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

export default function EventsScreen() {
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
      <Text style={{ color: "white" }}>Page d&apos;event</Text>
      <Button 
        title="Event de Younès" 
        onPress={()=>router.navigate({
          pathname:"/events/[id]",
          params: { id: "Event de Younès"}
        })}/>
        <Button 
        title="Event de Lucas" 
        onPress={()=>router.navigate({
          pathname:"/events/[id]",
          params: { id: "Event de Lucas"}
        })}/>
        <Button 
        title="Event de Khalid" 
        onPress={()=>router.navigate({
          pathname:"/events/[id]",
          params: { id: "Event de Khalid"}
        })}/>
        <Button 
        title="Event de Larbi" 
        onPress={()=>router.navigate({
          pathname:"/events/[id]",
          params: { id: "Event de Larbi"}
        })}/>
    </View>
  );
}
