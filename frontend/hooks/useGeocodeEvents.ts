// hooks/useGeocodeEvents.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthProvider';

export interface GeocodedEvent {
  id: number;
  organizerId: number;
  name: string;
  sport: string;
  location: string;
  visibility: string;
  maxParticipants: number;
  latitude: number;
  longitude: number;
  participation: any[];
  geocoded: boolean;
  address: string;
}

interface UseGeocodeEventsProps {
  events: any[];
  enabled?: boolean;
}

export function useGeocodeEvents({ events, enabled = true }: UseGeocodeEventsProps) {
  const { user } = useAuth();
  const [geocodedEvents, setGeocodedEvents] = useState<GeocodedEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction de géocodage d'une adresse
  const geocodeAddress = useCallback(async (address: string): Promise<{ lat: number; lon: number } | null> => {
    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1&lang=fr`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        return {
          lat: feature.geometry.coordinates[1],
          lon: feature.geometry.coordinates[0],
        };
      }
      
      return null;
    } catch (err) {
      console.error(`Erreur de géocodage pour ${address}:`, err);
      return null;
    }
  }, []);

  // Fonction pour géocoder un événement
  const geocodeEvent = useCallback(async (event: any): Promise<GeocodedEvent | null> => {
    // Vérifier si l'événement est valide pour la carte
    if (event.visibility !== 'PUBLIC') {
      return null;
    }

    // Vérifier si l'utilisateur a déjà rejoint
    if (event.participation?.some((p: any) => p.userId === user?.id)) {
      return null;
    }

    let latitude: number;
    let longitude: number;
    let geocoded = false;
    let address = event.location;

    // 1. Vérifier si l'événement a déjà des coordonnées
    if (event.latitude && event.longitude) {
      latitude = event.latitude;
      longitude = event.longitude;
      geocoded = false;
    } 
    // 2. Sinon, essayer de géocoder l'adresse
    else {
      // Nettoyer l'adresse
      let addressToGeocode = event.location;
      
      // Ajouter "France" si ce n'est pas spécifié
      if (!addressToGeocode.toLowerCase().includes('france')) {
        addressToGeocode = `${addressToGeocode}, France`;
      }
      
      const coords = await geocodeAddress(addressToGeocode);
      
      if (coords) {
        latitude = coords.lat;
        longitude = coords.lon;
        geocoded = true;
      } else {
        // Si le géocodage échoue, on ne retourne pas l'événement
        return null;
      }
    }

    return {
      id: event.id,
      organizerId: event.organizerId,
      name: event.name,
      sport: event.sport,
      location: event.location,
      visibility: event.visibility,
      maxParticipants: event.maxParticipants,
      latitude,
      longitude,
      participation: event.participation || [],
      geocoded,
      address: event.location,
    };
  }, [user, geocodeAddress]);

  // Effet principal pour géocoder les événements
  useEffect(() => {
    const geocodeAllEvents = async () => {
      if (!enabled || !events || events.length === 0) {
        setGeocodedEvents([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results: GeocodedEvent[] = [];
        
        // Géocoder les événements par lots (pour ne pas surcharger l'API)
        const batchSize = 5;
        for (let i = 0; i < events.length; i += batchSize) {
          const batch = events.slice(i, i + batchSize);
          const batchPromises = batch.map(event => geocodeEvent(event));
          const batchResults = await Promise.all(batchPromises);
          
          // Filtrer les résultats null et ajouter aux résultats
          batchResults.forEach(result => {
            if (result) {
              results.push(result);
            }
          });

          // Petite pause entre les batches pour respecter les limites d'API
          if (i + batchSize < events.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        setGeocodedEvents(results.slice(0, 20)); // Limiter à 20 pour performance
      } catch (err) {
        setError('Erreur lors du géocodage des événements');
        console.error('Erreur de géocodage:', err);
      } finally {
        setLoading(false);
      }
    };

    // Utiliser un debounce pour éviter des géocodages trop fréquents
    const timeoutId = setTimeout(geocodeAllEvents, 500);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [events, enabled, geocodeEvent]);

  // Fonction pour recalculer les distances depuis une position
  const calculateDistances = useCallback((userLat: number, userLon: number) => {
    const eventsWithDistance = geocodedEvents.map(event => {
      const distance = calculateDistance(
        userLat,
        userLon,
        event.latitude,
        event.longitude
      );
      return {
        ...event,
        distance,
      };
    });

    // Trier par distance
    return eventsWithDistance.sort((a, b) => a.distance - b.distance);
  }, [geocodedEvents]);

  // Fonction utilitaire pour calculer les distances
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

  return {
    geocodedEvents,
    loading,
    error,
    calculateDistances,
    refetch: () => {
      // Force un recalcul en vidant le cache
      setGeocodedEvents([]);
    },
  };
}