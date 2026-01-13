// PremiumPaymentPage.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStripe } from "@stripe/stripe-react-native";
import { useAuth } from "@/contexts/AuthProvider";
import { fetchAPI } from "@/services/api";
import { useFocusEffect } from "expo-router";

export default function PremiumPaymentPage() {
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  /**
   * 🔹 Initialiser la PaymentSheet
   */
  const initializePaymentSheet = async () => {
    try {
      setLoading(true);
      setReady(false);

      const token = await AsyncStorage.getItem("authToken");
      
      if (!user?.email) {
        throw new Error("Email utilisateur manquant");
      }

      const response = await fetchAPI(
        "/payments/sheet",
        "POST",
        token,
        { email: user.email }
      );

      if (!response?.paymentIntent) {
        throw new Error("Réponse invalide du serveur");
      }

      const { paymentIntent, ephemeralKey, customer, publishableKey } = response;

      // Initialisation Stripe
      const { error } = await initPaymentSheet({
        merchantDisplayName: "SportEvent Premium",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: false, // Plus sécurisé
        defaultBillingDetails: {
          email: user.email,
        },
      });

      if (error) {
        console.error("Erreur initPaymentSheet:", error);
        throw new Error(error.message);
      }

      setReady(true);
    } catch (err) {
      console.error("Erreur Stripe:", err);
      Alert.alert(
        "Erreur", 
        err.message || "Impossible d'initialiser le paiement"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔹 Ouvrir la PaymentSheet
   */
  const openPaymentSheet = async () => {
    if (!ready) return;

    try {
      const { error } = await presentPaymentSheet();

      if (error) {
        if (error.code !== 'Canceled') {
          Alert.alert("Erreur de paiement", error.message);
        }
      } else {
        Alert.alert(
          "🎉 Succès", 
          "Votre abonnement Premium est activé !",
          [{ text: "OK", onPress: () => console.log("Paiement réussi") }]
        );
        // Réinitialiser pour un prochain paiement
        setReady(false);
      }
    } catch (err) {
      Alert.alert("Erreur", "Une erreur inattendue est survenue");
    }
  };

  // Réinitialiser à chaque focus
  useFocusEffect(
    useCallback(() => {
      initializePaymentSheet();
      
      // Cleanup
      return () => setReady(false);
    }, [user?.email])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deviens Premium ⭐</Text>

      <Text style={styles.description}>
        🔸 Supprime les publicités{"\n"}
        🔸 Mets en avant tes événements{"\n"}
        🔸 Sois prioritaire sur les événements
      </Text>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>4,99 €</Text>
        <Text style={styles.period}>/ mois</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Préparation du paiement...</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.button, !ready && styles.buttonDisabled]}
          disabled={!ready}
          onPress={openPaymentSheet}
        >
          <Text style={styles.buttonText}>
            {ready ? "S'abonner maintenant" : "Chargement..."}
          </Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.securityText}>
        🔒 Paiement sécurisé par Stripe
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    color: "#666",
    marginBottom: 32,
    fontSize: 16,
    lineHeight: 24,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 32,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
  },
  period: {
    fontSize: 16,
    color: "#666",
    marginLeft: 4,
  },
  loadingContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  securityText: {
    marginTop: 20,
    color: "#888",
    fontSize: 12,
  },
});