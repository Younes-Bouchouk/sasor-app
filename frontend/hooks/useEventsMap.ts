// hooks/useEventsMap.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthProvider';
import { useFetchQuery } from './useFetchQuery';

export interface MapEvent {
  id: number;
  name: string;
  sport: string;
  location: string;
  latitude: number;
  longitude: number;
  maxParticipants: number;
  participation: any[];
  geocoded: boolean;
  distance?: number;
  image?: string; 
  visibility?: string; 
}

export function useEventsMap() {
  const { user } = useAuth();
  
  const {
    data: events,
    isLoading: loadingEvents,
    error: errorEvents,
    refetch: refetchEvents,
  } = useFetchQuery("eventsMap", "/events");

  const [mapEvents, setMapEvents] = useState<MapEvent[]>([]);
  const [loadingGeocode, setLoadingGeocode] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  // Géocoder une adresse
  const geocodeLocation = useCallback(async (location: string): Promise<{ lat: number; lon: number } | null> => {
    try {
      let address = location;
      
      if (!address.toLowerCase().includes('france')) {
        address = `${address}, France`;
      }

      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1&lang=fr`
      );

      const data = await response.json();
      
      if (data.features?.length > 0) {
        return {
          lat: data.features[0].geometry.coordinates[1],
          lon: data.features[0].geometry.coordinates[0],
        };
      }
      return null;
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      return null;
    }
  }, []);

  // Transformer  événements API en événements carte
  const transformEvents = useCallback(async () => {
    if (!events || events.length === 0) {
      setMapEvents([]);
      return;
    }

    setLoadingGeocode(true);
    setGeocodeError(null);

    const transformed: MapEvent[] = [];

    for (const event of events) {
      // Filtrer les événements publics seulement
      if (event.visibility !== 'PUBLIC') continue;
      
      // Filtrer les événements déjà rejoints
      if (event.participation?.some((p: any) => p.userId === user?.id)) continue;

      let latitude: number;
      let longitude: number;
      let geocoded = false;

      // Si l'événement a déjà des coordonnées
      if (event.latitude && event.longitude) {
        latitude = event.latitude;
        longitude = event.longitude;
      } else {
        // Géocoder l'adresse
        const coords = await geocodeLocation(event.location);
        if (coords) {
          latitude = coords.lat;
          longitude = coords.lon;
          geocoded = true;
        } else {
          continue; // Skip si  géocodage échoue
        }
      }

      transformed.push({
        id: event.id,
        name: event.name,
        sport: event.sport,
        location: event.location,
        latitude,
        longitude,
        maxParticipants: event.maxParticipants,
        participation: event.participation || [],
        geocoded,
        image: event.image, 
        visibility: event.visibility, 
      });

      // Limite pour éviter de surcharger
      if (transformed.length >= 20) break;
    }

    setMapEvents(transformed);
    setLoadingGeocode(false);
  }, [events, user, geocodeLocation]);

  useEffect(() => {
    if (events && !loadingEvents) {
      transformEvents();
    }
  }, [events, loadingEvents, transformEvents]);

  // Calculer les distances depuis une position
  const calculateEventsWithDistance = useCallback((userLat: number, userLon: number) => {
    return mapEvents.map(event => {
      const R = 6371;
      const dLat = (event.latitude - userLat) * Math.PI / 180;
      const dLon = (event.longitude - userLon) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(userLat * Math.PI / 180) * Math.cos(event.latitude * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;

      return {
        ...event,
        distance: parseFloat(distance.toFixed(1)),
      };
    }).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [mapEvents]);

  return {
    events: mapEvents,
    loading: loadingEvents || loadingGeocode,
    error: errorEvents || geocodeError,
    refetch: refetchEvents,
    calculateEventsWithDistance,
    reloadGeocoding: transformEvents,
  };
}