import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAPI } from "../services/api";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (formData: any) => {
      const data = await fetchAPI("/auth/register", "POST", formData);

      // Stocker le token après l'inscription
      if (data.access_token) {
        await AsyncStorage.setItem("authToken", data.access_token);
      }

      return data;
    },
  });
}
