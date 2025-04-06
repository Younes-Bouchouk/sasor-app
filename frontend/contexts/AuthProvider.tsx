import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAPI } from "@/services/api"; // Assure-toi d'avoir une fonction générique fetchAPI
import { router } from "expo-router";
import { QueryClient } from "@tanstack/react-query";

interface AuthContextType {
  userId: number | null;
  user: any | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  updateUserImage: (imageUrl: string) => void;
}

export const AuthContext = createContext({
  user: null,
  token: null,
  login: async (token: string) => {},
  logout: async () => {},
  refetchUser: async () => {},
  updateUserImage: (imageUrl: string) => {}, // Ajout de cette méthode
});

const queryClient = new QueryClient();
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Charger le token et l'utilisateur connecté
  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = await AsyncStorage.getItem("authToken");
      if (storedToken) {
        setToken(storedToken);
        await fetchUserData(storedToken);
      } else {
        console.log("Aucun token trouvé dans AsyncStorage");
      }
    };
    loadAuthData();
  }, []);

  // Restaurer l'image depuis AsyncStorage au démarrage
  useEffect(() => {
    const loadUserImage = async () => {
      const storedImage = await AsyncStorage.getItem("userImage");
      if (storedImage) {
        setUser((prevUser: any) => ({
          ...prevUser,
          image: storedImage,
        }));
      }
    };
    loadUserImage();
  }, []);

  // Récupérer les infos de l'utilisateur connecté
  const fetchUserData = async (authToken: string) => {
    try {
      const userData = await fetchAPI("/users/me", "GET", authToken);
      console.log("Données utilisateur restaurées :", userData); // Vérifiez que `image` est présent
      setUserId(userData.id);
      setUser(userData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur :", error);
    }
  };

  const updateUserImage = async (imageUrl: string) => {
    setUser((prevUser: any) => ({
      ...prevUser,
      image: imageUrl,
    }));
    await AsyncStorage.setItem("userImage", imageUrl); // Sauvegarder l'image localement
  };

  // Sauvegarder le token et récupérer l'utilisateur
  const login = async (newToken: string) => {
    await AsyncStorage.setItem("authToken", newToken);
    setToken(newToken);
    await fetchUserData(newToken);
  };

  // Déconnexion
  const logout = async () => {
    await AsyncStorage.removeItem("authToken");
    setToken(null);
    setUserId(null);
    setUser(null);
    queryClient.clear(); 
    router.replace("/login");
  };

  const refetchUser = async () => {
    if (token) {
      await fetchUserData(token);
    }
  };

  return (
    <AuthContext.Provider value={{ userId, user, token, login, logout, refetchUser, updateUserImage }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour accéder aux infos d'auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
