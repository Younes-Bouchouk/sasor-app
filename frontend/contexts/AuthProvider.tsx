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
}

const AuthContext = createContext<AuthContextType | null>(null);
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
      }
    };
    loadAuthData();
  }, []);

  // Récupérer les infos de l'utilisateur connecté
  const fetchUserData = async (authToken: any) => {
    try {
      const userData = await fetchAPI("/users/me", "GET", token, authToken );
      setUserId(userData.id);
      setUser(userData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur", error);
    }
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

  return (
    <AuthContext.Provider value={{ userId, user, token, login, logout }}>
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
