import { useQuery } from "@tanstack/react-query";

const endpoint = "http://localhost:4000"; 

export function useFetchQuery(path: string, token: string) {
  return useQuery({
    queryKey: [path],
    queryFn: async () => {
      try {
        console.log("Requête vers :", `${endpoint}${path}`);

        const response = await fetch(`${endpoint}${path}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("Données reçues :", data);
        return data;
      } catch (error) {
        console.error("Erreur lors de la requête :", error);
        throw error;
      }
    },
  });
}
