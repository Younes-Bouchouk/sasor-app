import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import EventMap from '@/components/EventMap';

const { width } = Dimensions.get("window")

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
    width,
    backgroundColor: '#fff',
  },
});


// import React from "react";
// import { Dimensions, Image, View } from "react-native";

// const {width, height} = Dimensions.get("window");

// export default function MapScreen() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         width,
//         backgroundColor: "#222",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       {/* <Text style={{ color: "white" }}>Page de Map</Text> */}
//       <Image
//         source={require("@/assets/images/capture_map.png")}
//         resizeMode="cover"
//         style={{
//           width,
//           height,
//         }}
//       />
//     </View>
//   );
// }
