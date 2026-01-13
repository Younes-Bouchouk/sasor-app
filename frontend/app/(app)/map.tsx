import React from 'react';
import { View, StyleSheet } from 'react-native';
import EventMap from '../../components/EventMap';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <EventMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});