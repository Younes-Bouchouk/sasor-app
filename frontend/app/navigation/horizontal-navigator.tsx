import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, View, ViewToken } from "react-native";

const { width, height } = Dimensions.get('window');

type ViewItem = {
  id: string;
  screen: React.ReactElement;
}

type Props = {
  currentViewIndex: number;
  onViewChange: (value:number)=>void;
  views: ViewItem[];
}

export default function HorizontalNavigator({ currentViewIndex, onViewChange, views}: Props) {
  
  const flatListRef = useRef<FlatList>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const lastProgrammaticIndex = useRef(currentViewIndex);

  // Synchroniser le scroll avec l'index courant SEULEMENT pour les changements programmatiques
  useEffect(() => {
    // Ne pas interférer si l'utilisateur est en train de scroll
    if (!isUserScrolling && currentViewIndex !== lastProgrammaticIndex.current) {
      lastProgrammaticIndex.current = currentViewIndex;
      
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: currentViewIndex,
          animated: true,
        });
      }
    }
  }, [currentViewIndex, isUserScrolling]);

  // Fonction qui met à jour l'index lorsque l'utilisateur change de vue en scrollant
  const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      const newIndex = viewableItems[0].index;
      if (newIndex !== currentViewIndex) {
        onViewChange(newIndex);
        lastProgrammaticIndex.current = newIndex;
      }
    }
  }).current;

  // Gérer le début et la fin du scroll utilisateur
  const handleScrollBegin = () => {
    setIsUserScrolling(true);
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Calculer l'index basé sur la position finale
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    
    // S'assurer que l'index est valide
    if (newIndex >= 0 && newIndex < views.length && newIndex !== currentViewIndex) {
      onViewChange(newIndex);
      lastProgrammaticIndex.current = newIndex;
    }
    
    setIsUserScrolling(false);
  };

  // Configuration visuelle
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Change la vue lorsque l'item est visible à 50%
  }).current;
  
  // Fonction qui retourne le rendu d'un item
  const renderItem = ({ item }: { item: any }) => (
    <View style={{ width }}>{item.screen}</View>
  );

  return (
    <FlatList 
      ref={flatListRef}
      data={views}
      renderItem={renderItem}
      keyExtractor={(item)=>item.id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onViewableItemsChanged={handleViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      onScrollBeginDrag={handleScrollBegin}
      onMomentumScrollEnd={handleScrollEnd}
      onScrollEndDrag={handleScrollEnd}
      scrollEventThrottle={16}
      onScrollToIndexFailed={(info) => {
        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
              index: info.index,
              animated: true,
            })
          }
        }, 100);
      }}
      getItemLayout={(data, index) => ({
        length: width,
        offset: width * index,
        index,
      })}
      initialScrollIndex={currentViewIndex}
    />
  )
    
  
}
