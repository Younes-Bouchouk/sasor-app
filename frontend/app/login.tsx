import { useForm, Controller } from "react-hook-form";
import { View, TextInput, Button, Text } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

const schema = yup.object({
  email: yup.string().email("Email invalide").required("Email obligatoire"),
  password: yup.string().min(6, "6 caractères min").required("Mot de passe requis"),
});

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Réponse du serveur:", result);

      if (!response.ok) {
        setErrorMessage(result.message || "Échec de la connexion");
      } else {
        setErrorMessage(""); // Réinitialiser l'erreur si tout va bien
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
      setErrorMessage("Erreur serveur, veuillez réessayer");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 10,
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Connexion</Text>
      
      <View style={{ width: "100%", gap: 10 }}>
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text>Email</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "black",
                  padding: 10,
                  borderRadius: 5,
                }}
                placeholder="Votre email"
                value={value}
                onChangeText={onChange}
              />
              {errors.email && (
                <Text style={{ color: "red" }}>{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text>Mot de passe</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "black",
                  padding: 10,
                  borderRadius: 5,
                }}
                placeholder="Votre mot de passe"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
              {errors.password && (
                <Text style={{ color: "red" }}>{errors.password.message}</Text>
              )}
            </View>
          )}
        />

        <Button title="Se connecter" onPress={handleSubmit(onSubmit)} />
      </View>

      {errorMessage ? <Text style={{ color: "red" }}>{errorMessage}</Text> : null}
    </View>
  );
}
