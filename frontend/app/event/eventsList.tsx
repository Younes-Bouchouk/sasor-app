import { useFetchQuery } from "@/hooks/useFetchQuery";
import React from "react";
import { View, Text, FlatList, ViewToken } from "react-native";
import { ListItem } from "..";
import { useRouter } from "expo-router";
import EventCard from "@/components/EventCard";
import { getSportImage } from "@/utils/imageMapper";
import { useSharedValue } from "react-native-reanimated";
import { useAuth } from "@/contexts/AuthProvider";

export default function EventsList() {
  const router = useRouter();
  const { token, user } = useAuth();
  const viewableItems = useSharedValue<ViewToken<any>[]>([]);

  const {
    data: eventsJoined,
    isLoading: loadingEventsJoined,
    error: errorEventsJoined,
    refetch: refetchEventsJoined,
  } = useFetchQuery("eventsJoined", "/events/me");

  return (
    <View
      style={{
        paddingTop: 50,
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <Text style={{ textAlign: "center" }}>
        Accéder aux discussion des évènements rejoints
      </Text>
      <FlatList
        data={eventsJoined}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
        renderItem={({ item }) => (
          <EventCard
            item={item}
            router={router}
            getSportImage={getSportImage}
            isOwner={item.organizerId === user?.id}
            refetch={async () => refetchEventsJoined}
            viewableItems={viewableItems}
            onPress={() =>
              router.push({
                pathname: "/event/message/[id]",
                params: { id: item.id.toString() },
              })
            }
          />
        )}
        onViewableItemsChanged={({ viewableItems: vItems }) => {
          viewableItems.value = vItems;
        }}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
    </View>
  );
}
