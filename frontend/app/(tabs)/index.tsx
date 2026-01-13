// app/index.tsx
import { useNavigationContext } from '@/contexts/navigation-context';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import HomeScreen from './home';
import MapScreen from './map';
import React from 'react';

const { width } = Dimensions.get('window');
const screens = ['map', 'home'];

export default function IndexScreen() {
  const { screenIndex } = useLocalSearchParams<{ screenIndex?: string }>();
  const { currentScreenIndex, setCurrentScreenIndex } = useNavigationContext();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (screenIndex !== undefined) {
      const newIndex = Number(screenIndex);
      if (!isNaN(newIndex) && newIndex >= 0 && newIndex < screens.length) {
        setCurrentScreenIndex(newIndex);
        flatListRef.current?.scrollToIndex({
          index: newIndex,
          animated: true
        });
      }
    }
  }, [screenIndex, setCurrentScreenIndex]);

  useEffect(() => {
    if (screenIndex !== undefined) {
      const initialIndex = Number(screenIndex);
      if (!isNaN(initialIndex) && initialIndex >= 0 && initialIndex < screens.length) {
        setCurrentScreenIndex(initialIndex);
      }
    }
  }, []);

  const renderItem = ({ item }: { item: string }) => {
    switch (item) {
      case 'map':
        return <MapScreen />;
      case 'home':
        return <HomeScreen />;
      default:
        return null;
    }
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index !== currentScreenIndex) {
      setCurrentScreenIndex(index);
    }
  };

  const handleScrollToIndexFailed = (info: any) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({
        index: info.index,
        animated: true
      });
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={screens}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        initialScrollIndex={currentScreenIndex}
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});