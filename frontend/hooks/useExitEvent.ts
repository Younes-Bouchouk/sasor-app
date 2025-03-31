import { useMutation } from "@tanstack/react-query";
import { fetchAPI } from "../services/api";
import { useAuth } from "../contexts/AuthProvider";

export function useExitEvent() {
  const { token } = useAuth();

  const exitEvent = async (eventId: number) => {
    console.log(`Tentative de quitter l'événement ${eventId}...`);
    
    try {
      const response = await fetchAPI(`/events/${eventId}/exit`, "DELETE", {}, token || undefined);
      console.log("Réponse de l'API :", response);
      return response;
    } catch (error) {
      console.error("Erreur lors de l'exclusion:", error);
    }
  };

  return useMutation({
    mutationFn: exitEvent,  
    onSuccess: (data) => {
      console.log("Succès !", data);
    },
    onError: (error) => {
      console.error("Erreur lors de la requête :", error);
    },
  });
  
}
