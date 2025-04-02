import { useState } from "react";
import { View, TextInput, Button, Text, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { router } from "expo-router";
import { useRegisterMutation } from "../hooks/useRegisterMutations";

const schema = yup.object({
  pseudo: yup.string().required("Pseudo obligatoire"),
  email: yup.string().email("Email invalide").required("Email obligatoire"),
  password: yup.string().min(8, "Minimum 8 caractères").required("Mot de passe requis"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas")
    .required("Confirmation du mot de passe requise"),
  birthday: yup.string().required("Date de naissance obligatoire"),
});

interface FormData {
  pseudo: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthday: string;
}

export default function Register() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const { mutate, isPending, error } = useRegisterMutation();
  const [successMessage, setSuccessMessage] = useState("");

  const submit = async (formData: FormData) => {
    mutate(formData, {
      onSuccess: (data) => {
        setSuccessMessage("Inscription réussie !");
        router.push("/login");
      },
      onError: (err: any) => {
        console.error("Erreur :", err.message);
      },
    });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10, gap: 5 }}>
      <Text>Page d'inscription</Text>
      <View style={{ gap: 10 }}>
        {/* Pseudo */}
        <Controller
          name="pseudo"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text>Pseudo</Text>
              <TextInput style={styles.input} value={value} onChangeText={onChange} />
              {errors.pseudo && <Text style={styles.error}>{errors.pseudo.message}</Text>}
            </View>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text>Email</Text>
              <TextInput style={styles.input} value={value} onChangeText={onChange} keyboardType="email-address" />
              {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
            </View>
          )}
        />

        {/* Mot de passe */}
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text>Mot de passe</Text>
              <TextInput style={styles.input} value={value} onChangeText={onChange} secureTextEntry />
              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
            </View>
          )}
        />

        {/* Confirmation du mot de passe */}
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text>Confirmer le mot de passe</Text>
              <TextInput style={styles.input} value={value} onChangeText={onChange} secureTextEntry />
              {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}
            </View>
          )}
        />

        {/* Date de naissance */}
        <Controller
          name="birthday"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text>Date de naissance</Text>
              <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="YYYY-MM-DD" />
              {errors.birthday && <Text style={styles.error}>{errors.birthday.message}</Text>}
            </View>
          )}
        />

        {/* Bouton de soumission */}
        {isPending ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <Button title="S'inscrire" onPress={handleSubmit(submit)} />
        )}
      </View>

      {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
      {error ? <Text style={styles.error}>{error.message}</Text> : null}
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 5,
    width: 250,
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  success: {
    color: "green",
    fontSize: 12,
  },
};
