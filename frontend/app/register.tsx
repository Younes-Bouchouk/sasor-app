import React from "react";
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
import { useRegisterMutation } from "../hooks/useRegisterMutations";
import { DatePicker } from "@/components/ui/DatePicker";
import { useNavigation } from "@react-navigation/native";

const schema = yup.object({
  pseudo: yup.string().required("Pseudo obligatoire"),
  email: yup.string().email("Email invalide").required("Email obligatoire"),
  password: yup
    .string()
    .min(8, "Minimum 8 caractères")
    .required("Mot de passe requis"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas")
    .required("Confirmation du mot de passe requise"),
  sexe: yup
    .string()
    .oneOf(["masculin", "féminin", "autre"], "Sexe invalide")
    .required("Le sexe est obligatoire"),
  birthday: yup
    .date()
    .required("La date de naissance est obligatoire")
    .typeError("Date de naissance invalide"),
});

export default function RegisterScreen() {
  const navigation = useNavigation(); // Déclarez useNavigation ici

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { mutate, status, error } = useRegisterMutation();
  const isLoading = status === "pending";

  const onSubmit = (formData: any) => {
    console.log("Données envoyées :", formData);
    mutate(formData, {
      onSuccess: (data) => {
        console.log("Inscription réussie :", data);
        navigation.navigate("login"); // Utilise navigation pour rediriger
      },
      onError: (err: any) => {
        console.error("Erreur lors de l'inscription :", err.message);
        alert("Erreur : " + err.message);
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>
            Inscrivez-vous pour explorer toutes les fonctionnalités.
          </Text>
        </View>

        <View style={styles.form}>
          {/* Pseudo */}
          <Controller
            name="pseudo"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Pseudo"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.pseudo && (
            <Text style={styles.error}>{errors.pseudo.message}</Text>
          )}

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
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}

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
          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}

          {/* Confirmation du mot de passe */}
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.error}>
              {errors.confirmPassword.message}
            </Text>
          )}

          {/* Date de naissance */}
          <Controller
            name="birthday"
            control={control}
            render={({ field: { onChange, value } }) => (
              <View>
                <Text>Date de naissance</Text>
                <DatePicker
                  value={value ? value.toISOString() : ""}
                  onChange={(dateString) => onChange(new Date(dateString))}
                />
                {errors.birthday && (
                  <Text style={styles.error}>{errors.birthday.message}</Text>
                )}
              </View>
            )}
          />

          {/* Sexe */}
          <Controller
            name="sexe"
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Sexe</Text>
                <View style={styles.picker}>
                  <TouchableOpacity
                    onPress={() => onChange("masculin")}
                    style={[
                      styles.pickerOption,
                      value === "masculin" && styles.pickerOptionSelected,
                    ]}
                  >
                    <Text>Masculin</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onChange("féminin")}
                    style={[
                      styles.pickerOption,
                      value === "féminin" && styles.pickerOptionSelected,
                    ]}
                  >
                    <Text>Féminin</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onChange("autre")}
                    style={[
                      styles.pickerOption,
                      value === "autre" && styles.pickerOptionSelected,
                    ]}
                  >
                    <Text>Autre</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          {errors.sexe && <Text style={styles.error}>{errors.sexe.message}</Text>}
        </View>

        {/* Bouton d'inscription */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>S'inscrire</Text>
          )}
        </TouchableOpacity>

        {/* Lien vers la connexion */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>
            Vous avez déjà un compte ? Connectez-vous
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
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pickerOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  pickerOptionSelected: {
    backgroundColor: "#18709E",
    borderColor: "#18709E",
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