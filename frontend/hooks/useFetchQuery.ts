import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAPI } from "../services/api";

export function useFetchQuery(key: string, path: string) {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const token = await AsyncStorage.getItem("authToken");
      console.log(token)
      return fetchAPI(path, "GET", token ,undefined);
    },
  });
}
