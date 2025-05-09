import { useState, useEffect } from "react";
import { sportsList } from "@/utils/sportsList"; 

export function useFetchSports(query: string) {
  const [sports, setSports] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSports([]);
      return;
    }

    setLoading(true);
    setError(null);

    // Filtrer les sports basés sur la requête
    const filteredSports = sportsList.filter((sport) =>
      sport.toLowerCase().includes(query.toLowerCase())
    );

    setSports(filteredSports);
    setLoading(false);
  }, [query]);

  return { sports, loading, error };
}
