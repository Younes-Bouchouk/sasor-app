import { useState, useEffect } from "react";

export function useFetchCities(query: string) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setCities([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&featureClass=P&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setCities(data.map((city: any) => city.display_name));
        } else {
          setCities([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors de la récupération des villes.");
        setLoading(false);
      });
  }, [query]);

  return { cities, loading, error };
}
