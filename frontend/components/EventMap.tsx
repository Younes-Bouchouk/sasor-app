// components/EventMap.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Image,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthProvider';
import { useEventsMap } from '../hooks/useEventsMap'; 
import { getSportImage } from '../utils/imageMapper';

const { width, height } = Dimensions.get('window');

const EventMap = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Utilisation du hook personnalisé
  const {
    events: mapEvents,
    loading: loadingEvents,
    error: errorEvents,
    refetch,
    calculateEventsWithDistance, 
  } = useEventsMap();

  // Récupération de la position
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      setLoadingLocation(true);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'La localisation est nécessaire pour afficher la carte.');
        setLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Erreur de localisation:', error);
      // Position par défaut
      setUserLocation({
        latitude: 48.8566,
        longitude: 2.3522,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } finally {
      setLoadingLocation(false);
    }
  };

  // Fonction pour obtenir l'URL de l'image avec fallback
  const getEventImageUrl = (event: any) => {
    if (event.image && isValidUrl(event.image)) {
      return event.image;
    }
    // Fallback vers l'image par sport
    return getSportImage(event.sport);
  };

  // Vérifier si l'URL est valide
  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const handleMarkerPress = (event: any) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  // Fonction pour lancer la navigation GPS
  const handleNavigateToEvent = () => {
    if (!selectedEvent || !userLocation) return;
    
    const destination = `${selectedEvent.latitude},${selectedEvent.longitude}`;
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    
    // Choisir l'application de navigation
    Alert.alert(
      "Y aller",
      "Choisissez votre application de navigation :",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Google Maps",
          onPress: () => openNavigationApp('google', destination, origin)
        },
        {
          text: "Apple Plans",
          onPress: () => openNavigationApp('apple', destination, origin)
        },
        {
          text: "Waze",
          onPress: () => openNavigationApp('waze', destination)
        }
      ]
    );
  };

  // Ouvrir l'application de navigation
  const openNavigationApp = (app: 'google' | 'apple' | 'waze', destination: string, origin?: string) => {
    let url = '';
    
    switch (app) {
      case 'google':
        url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        break;
      case 'apple':
        url = `http://maps.apple.com/?daddr=${destination}&dirflg=d`;
        break;
      case 'waze':
        url = `https://waze.com/ul?ll=${destination}&navigate=yes`;
        break;
    }
    
    Linking.openURL(url).catch(err => {
      Alert.alert('Erreur', `Impossible d'ouvrir ${app}. Vérifiez que l'application est installée.`);
    });
  };

  // Calculer la distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Déterminer la visibilité
  const getVisibilityText = (visibility: string) => {
    if (!visibility) return 'Privé';
    
    const vis = visibility.toUpperCase();
    if (vis === 'PUBLIC') return 'Public';
    if (vis === 'PRIVATE') return 'Privé';
    return visibility;
  };

  // Style de la carte noir et blanc (gardé tel quel)
  const blackAndWhiteMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#000000" }]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "poi",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#000000" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#18FD9C" }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#000000" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#18FD9C" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#000000" }]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#000000" }]
    },
    {
      "featureType": "transit",
      "stylers": [{ "visibility": "on" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#c9c9c9" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    }
  ];

  if (loadingLocation || loadingEvents) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#18FD9C" />
        <Text style={styles.loadingText}>
          {loadingEvents ? 'Chargement des événements...' : 'Localisation...'}
        </Text>
      </View>
    );
  }

  if (errorEvents) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorEvents}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Carte */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={blackAndWhiteMapStyle}
        region={userLocation || undefined}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        toolbarEnabled={false}
        mapType="standard"
      >
        {/* Marqueurs des événements avec BULLE et image */}
        {mapEvents.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
            onPress={() => handleMarkerPress(event)}
          >
            {/* BULLE avec image (forme de bulle de BD) */}
            <View style={styles.bubbleContainer}>
              {/* La bulle principale */}
              <View style={styles.bubble}>
                {/* Image de l'événement dans la bulle */}
                <Image
                  source={{ uri: getEventImageUrl(event) }}
                  style={styles.bubbleImage}
                  onError={() => console.log(`Erreur image pour ${event.name}`)}
                />
                
                {/* Overlay semi-transparent pour contraste */}
                <View style={styles.bubbleOverlay} />
                
                {/* Badge participants */}
                <View style={[
                  styles.participantsBadge,
                  event.participation.length >= event.maxParticipants ? 
                    styles.fullEvent : null
                ]}>
                  <Text style={styles.participantsText}>
                    {event.participation.length}/{event.maxParticipants}
                  </Text>
                </View>
              </View>
              
              {/* Pointe de la bulle (triangle en bas) */}
              <View style={styles.bubblePointer} />
            </View>
            
            {/* Callout (bulle d'info au clic) */}
            <Callout tooltip onPress={() => handleMarkerPress(event)}>
              <View style={styles.calloutContainer}>
                <Image
                  source={{ uri: getEventImageUrl(event) }}
                  style={styles.calloutImage}
                />
                
                <View style={styles.calloutTextContainer}>
                  <Text style={styles.calloutTitle}>{event.name}</Text>
                  <Text style={styles.calloutSport}>{event.sport}</Text>
                  
                  {userLocation && (
                    <View style={styles.calloutDistanceRow}>
                      <Ionicons name="navigate" size={12} color="#18FD9C" />
                      <Text style={styles.calloutDistance}>
                        À {calculateDistance(
                          userLocation.latitude,
                          userLocation.longitude,
                          event.latitude,
                          event.longitude
                        ).toFixed(1)} km
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.calloutParticipantsRow}>
                    <Ionicons name="people" size={12} color="#18FD9C" />
                    <Text style={styles.calloutParticipants}>
                      {event.participation.length}/{event.maxParticipants} participants
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.calloutNavigateButton}
                    onPress={() => {
                      setSelectedEvent(event);
                      handleNavigateToEvent();
                    }}
                  >
                    <Ionicons name="navigate" size={16} color="#000" />
                    <Text style={styles.calloutNavigateText}>Y aller</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Bouton recentrer */}
      <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
        <Ionicons name="locate" size={24} color="#18FD9C" />
      </TouchableOpacity>

      {/* Modal de détail de l'événement */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedEvent && (
              <>
                {/* Image en tête du modal */}
                <Image
                  source={{ uri: getEventImageUrl(selectedEvent) }}
                  style={styles.modalImage}
                />
                
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedEvent.name}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#18FD9C" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalContent}>
                  <View style={styles.modalRow}>
                    <Ionicons name="basketball" size={20} color="#18FD9C" />
                    <Text style={styles.modalText}>{selectedEvent.sport}</Text>
                  </View>

                  <View style={styles.modalRow}>
                    <Ionicons name="location" size={20} color="#18FD9C" />
                    <Text style={styles.modalText}>{selectedEvent.location}</Text>
                  </View>

                  {userLocation && (
                    <View style={styles.modalRow}>
                      <Ionicons name="navigate" size={20} color="#18FD9C" />
                      <Text style={styles.modalText}>
                        À {calculateDistance(
                          userLocation.latitude,
                          userLocation.longitude,
                          selectedEvent.latitude,
                          selectedEvent.longitude
                        ).toFixed(1)} km de vous
                      </Text>
                    </View>
                  )}

                  <View style={styles.modalRow}>
                    <Ionicons name="people" size={20} color="#18FD9C" />
                    <Text style={styles.modalText}>
                      {selectedEvent.participation.length}/{selectedEvent.maxParticipants} participants
                    </Text>
                  </View>

                  <View style={styles.modalRow}>
                    <Ionicons name="eye" size={20} color="#18FD9C" />
                    <Text style={styles.modalText}>
                      {getVisibilityText(selectedEvent.visibility)}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.detailButton}
                    onPress={() => {
                      setModalVisible(false);
                      router.push({
                        pathname: "/event/[id]",
                        params: { id: selectedEvent.id.toString() },
                      });
                    }}
                  >
                    <Text style={styles.detailButtonText}>Plus d'infos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.navigateButton}
                    onPress={handleNavigateToEvent}
                  >
                    <Ionicons name="navigate" size={20} color="#000" />
                    <Text style={styles.navigateButtonText}>Y aller</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    width: '100%',
    height: height,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#18FD9C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // STYLES POUR LES BULLES
  
  bubbleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  bubble: {
    width: 55,
    height: 55,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#18FD9C',
    backgroundColor: '#000',
    position: 'relative',
    shadowColor: '#18FD9C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  
  bubbleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  bubbleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  
  participantsBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(24, 253, 156, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    minWidth: 25,
    alignItems: 'center',
  },
  
  fullEvent: {
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
  },
  
  participantsText: {
    color: '#000',
    fontSize: 9,
    fontWeight: 'bold',
  },
  
  bubblePointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#18FD9C',
    marginTop: -2,
  },
  
  // Styles pour le callout
  calloutContainer: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 12,
    width: 250,
    borderWidth: 1,
    borderColor: '#18FD9C',
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  calloutImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#18FD9C',
  },
  
  calloutTextContainer: {
    flex: 1,
  },
  
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#18FD9C',
    marginBottom: 4,
  },
  
  calloutSport: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 4,
  },
  
  calloutDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  calloutDistance: {
    fontSize: 11,
    color: '#18FD9C',
    marginLeft: 4,
  },
  
  calloutParticipantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  calloutParticipants: {
    fontSize: 11,
    color: '#fff',
    marginLeft: 4,
  },
  
  calloutNavigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18FD9C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  
  calloutNavigateText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  
  // Styles pour le modal
  modalImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#18FD9C',
  },
  
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  
  modalContainer: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
    borderWidth: 1,
    borderColor: '#18FD9C',
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#18FD9C',
    flex: 1,
    marginRight: 10,
  },
  
  modalContent: {
    marginBottom: 20,
  },
  
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  modalText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
    flex: 1,
  },
  
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  
  detailButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#18FD9C',
  },
  
  detailButtonText: {
    color: '#18FD9C',
    fontSize: 16,
    fontWeight: '600',
  },
  
  navigateButton: {
    flex: 1,
    backgroundColor: '#18FD9C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  
  navigateButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  locationButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: '#000',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18FD9C',
  },
});

export default EventMap;