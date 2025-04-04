import { useMutation } from "@tanstack/react-query";
import { fetchAPI } from "../services/api";

export function useUnfollowUser() {
  return useMutation({
    mutationFn: async (followingId: number ) => {
      return fetchAPI("/follows/me", "DELETE", null,{ followingId });
    },
    onSuccess: () => {
      // Logique après la suppression, par exemple, rafraîchir la liste des abonnements
      console.log("Utilisateur ne plus suivi avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la désinscription :", error);
    },
  });
}
