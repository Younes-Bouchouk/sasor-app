import { useMutation } from "@tanstack/react-query";
import { fetchAPI } from "../services/api";
import { useAuth } from "../contexts/AuthProvider";

export function useJoinEvent() {
  const { token } = useAuth();

  const joinEvent = async (eventId: number) => {
    console.log(`Tentative de rejoindre l'événement ${eventId}...`);
    
    try {
      const response = await fetchAPI(`/events/${eventId}/join`, "POST",  token,{} );
      console.log("Réponse de l'API :", response);
      return response;
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      throw new Error("Erreur lors de l'inscription à l'événement");
    }
  };

  return useMutation({
    mutationFn: joinEvent,  
    onSuccess: (data) => {
      console.log("Succès !", data);
    },
    onError: (error) => {
      console.error("Erreur lors de la requête :", error);
    },
  });
  
}
