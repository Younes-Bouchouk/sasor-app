import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../contexts/AuthProvider";
import { fetchAPI } from "../services/api";
import { useNavigation } from "@react-navigation/native";

const schema = yup.object({
  email: yup.string().email("Email invalide").required("Email obligatoire"),
  password: yup.string().min(6, "6 caractères min").required("Mot de passe requis"),
});

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: void | object | undefined) => {
    setLoginError("");
    setLoading(true);

    try {
      const result = await fetchAPI("/auth/login", "POST", null, data);

      if (!result.access_token) {
        setLoginError("Email ou mot de passe incorrect.");
        setLoading(false);
        return;
      }

      await login(result.access_token);
      navigation.navigate("index"); // Redirige vers la page d'accueil
    } catch (error) {
      console.error("Erreur de connexion :", error);
      setLoginError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>
            Connectez-vous pour accéder à votre compte.
          </Text>
        </View>

        <View style={styles.form}>
          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
              />
            )}
          />
          {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

          {/* Mot de passe */}
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
        </View>

        {/* Affichage des erreurs */}
        {loginError ? <Text style={styles.error}>{loginError}</Text> : null}

        {/* Bouton de connexion */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        {/* Lien vers l'inscription */}
        <TouchableOpacity onPress={() => navigation.navigate("register")}>
          <Text style={styles.link}>
            Vous n'avez pas de compte ? Inscrivez-vous
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  innerContainer: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: "#18709E",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
  },
  form: {
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#18709E",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    color: "#18709E",
    marginTop: 15,
    fontSize: 14,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});