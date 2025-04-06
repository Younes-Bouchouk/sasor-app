import { useState, useEffect } from "react";

export function useFetchCities(query: string) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!query || query.length < 2) {
        setCities([]);
        return;
      }

      setLoading(true);
      setError(null);

      fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=fr&limit=10`)
        .then((res) => res.json())
        .then((data) => {
          const postalCodeInQuery = query.match(/\b\d{4,5}\b/)?.[0];

          const formatted = data.features
            .filter((item: any) => {
              if (!postalCodeInQuery) return true;
              return item.properties.postcode?.includes(postalCodeInQuery);
            })
            .map((item: any) => {
              const props = item.properties;

              const name = props.name || "";
              const street = props.street || "";
              const city = props.city || props.locality || "";
              const postcode = props.postcode || "";
              const country = props.country || "";

              const parts = [
                name,
                street,
                postcode && city ? `${postcode} ${city}` : city,
                country,
              ].filter(Boolean);

              return parts.join(", ");
            });

          const unique = [...new Set(formatted)];
          setCities(unique);
          setLoading(false);
        })
        .catch(() => {
          setError("Erreur lors de la récupération des données.");
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return { cities, loading, error };
}
