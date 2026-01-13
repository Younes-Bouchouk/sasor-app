import { Stack } from 'expo-router';
import React from 'react';

export default function EventLayout() {

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
