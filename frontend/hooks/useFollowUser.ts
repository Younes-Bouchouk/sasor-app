import { useMutation } from "@tanstack/react-query";
import { fetchAPI } from "../services/api";
import { useAuth } from "@/contexts/AuthProvider";

export function useFollowUser() {
    const { token } = useAuth();

  return useMutation({
    mutationFn: async (followingId: number ) => {
      return fetchAPI("/follows/me", "POST", token, { followingId });
    },
    onSuccess: () => {
      // Logique après la création, par exemple, rafraîchir la liste des abonnements
      console.log("Utilisateur plus suivi avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la tentative :", error);
    },
  });
}
