import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAPI } from "../services/api";
import { useAuth } from "@/contexts/AuthProvider";

export function useFetchQuery(key: string, path: string, interval?: number) {
    return useQuery({
      queryKey: [key],
      queryFn: async () => {
        const token = await AsyncStorage.getItem("authToken").then((token) => {
            return token
        })
        return fetchAPI(path, "GET", token, undefined);
      },
      refetchInterval: interval || 10000,
    });
  }