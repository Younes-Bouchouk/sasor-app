import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { View, TextInput, Button, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../contexts/AuthProvider";
import { fetchAPI } from "../services/api";
import { useNavigation } from "@react-navigation/native";

//  Schéma de validation avec Yup
const schema = yup.object({
  email: yup.string().email("Email invalide").required("Email obligatoire"),
  password: yup.string().min(6, "6 caractères min").required("Mot de passe requis"),
});

//  Définition de l'interface des données du formulaire
interface FormData {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth(); // Récupération de la fonction login
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  
  
  //  Fonction de soumission du formulaire
  const onSubmit = async (data: FormData) => {
    setLoginError(""); // Reset des erreurs
    setLoading(true);

    try {
      //  Appel API propre avec la fonction centralisée `fetchAPI`
      const result = await fetchAPI("/auth/login", "POST",null ,data );

      if (!result.access_token) {
        setLoginError("Email ou mot de passe incorrect.");
        setLoading(false);
        return;
      }

      //  Stockage du token et redirection
      await login(result.access_token);
      router.push("/"); 
      
    } catch (error) {
      console.error("Erreur de connexion :", error);
      setLoginError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10, gap: 5 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Connexion</Text>

      {/* Champ Email */}
      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
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

      {/* Champ Mot de passe */}
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
                width: 210,
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={{ marginLeft: 10 }}>{showPassword ? "👁" : "👁‍🗨"}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {errors.password && <Text style={{ color: "red" }}>{errors.password.message}</Text>}

      {/* Affichage des erreurs */}
      {loginError ? <Text style={{ color: "red", marginBottom: 10 }}>{loginError}</Text> : null}

      {/* Bouton de connexion */}
      <Button title={loading ? "Connexion..." : "Se connecter"} onPress={handleSubmit(onSubmit)} disabled={loading} />

      <Button title="s'inscrire" onPress={() => router.push("/register")} />
      
    </View>
  );
};

export default LoginScreen;
