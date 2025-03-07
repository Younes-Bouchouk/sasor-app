import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { View, TextInput, Button, Text } from "react-native";
import { useRouter } from "expo-router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email("Email invalide").required("Email obligatoire"),
  password: yup.string().min(6, "6 caractères min").required("Mot de passe requis"),
});

interface FormData {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const router = useRouter(); // Hook pour la navigation 🚀
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("http://10.49.33.130:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setLoginError(result.message || "Email ou mot de passe incorrect.");
        return;
      }

      console.log("Connexion réussie:", result);
      setLoginError("");

      // ✅ Redirection après connexion réussie
      router.push("/event"); 
      
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
      setLoginError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10, gap: 5 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Connexion</Text>

      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            style={{
              borderWidth: 1,
              borderColor: "black",
              padding: 10,
              borderRadius: 5,
              width: 250,
              marginBottom: 10,
            }}
          />
        )}
      />
      {errors.email && <Text style={{ color: "red" }}>{errors.email.message}</Text>}

      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <TextInput
              placeholder="Mot de passe"
              value={value}
              onChangeText={onChange}
              secureTextEntry={!showPassword}
              style={{
                borderWidth: 1,
                borderColor: "black",
                padding: 10,
                borderRadius: 5,
                width: 250,
              }}
            />
            <Button title={showPassword ? "👁" : "👁‍🗨"} onPress={() => setShowPassword(!showPassword)} />
          </View>
        )}
      />
      {errors.password && <Text style={{ color: "red" }}>{errors.password.message}</Text>}

      {loginError ? <Text style={{ color: "red", marginBottom: 10 }}>{loginError}</Text> : null}

      <Button title="Se connecter" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default LoginScreen;
