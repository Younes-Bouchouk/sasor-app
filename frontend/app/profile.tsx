import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useMutation } from "@tanstack/react-query";
import { fetchAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthProvider";

export default function ProfileScreen() {
  const { data: profile, isLoading, error, refetch } = useFetchQuery(
    "profile",
    "/users/me"
  );

  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { token } = useAuth();

  // Mettre à jour les champs avec les données récupérées
  useEffect(() => {
    if (profile) {
      setEmail(profile.email || "");
      setPseudo(profile.pseudo || "");
      setBirthday(profile.birthday || "");
      setProfileImage(profile.image || "");
    }
  }, [profile]);

  const updateField = useMutation({
    mutationFn: async (formData: any) => {
      return fetchAPI("/users/me", "PATCH", token, formData);
    },
    onSuccess: () => {
      Alert.alert("Succès", "Votre profil a été mis à jour !");
      refetch(); // Recharger les données utilisateur
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour :", error);
      Alert.alert("Erreur", "Impossible de mettre à jour votre profil.");
    },
  });

  const handleUpdateField = (field: string, value: string) => {
    const formData: any = { [field]: value };
    console.log(`Mise à jour du champ ${field} avec la valeur :`, value);
    updateField.mutate(formData);
  };

  const handlePickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission requise",
          "Vous devez autoriser l'accès à la bibliothèque pour sélectionner une image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        uploadImageToImgBB(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image :", error);
      Alert.alert("Erreur", "Impossible de sélectionner l'image.");
    }
  };

  const uploadImageToImgBB = async (imageUri: string) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "profile.jpg",
      });

      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=913f18e85c55e3abe3618f0928cbec14",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        const imageUrl = data.data.url; // URL de l'image récupérée
        setProfileImage(imageUrl); // Mettre à jour l'état local
        console.log("Image téléchargée avec succès :", imageUrl);

        // Envoyer l'URL de l'image au backend immédiatement
        updateField.mutate({ image: imageUrl });
      } else {
        Alert.alert("Erreur", "Impossible de télécharger l'image.");
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image :", error);
      Alert.alert("Erreur", "Une erreur est survenue lors du téléchargement.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#18709E" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Erreur lors du chargement des données.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon Profil</Text>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity onPress={handlePickImage}>
          <Image
            source={{
              uri: profileImage || "https://i.ibb.co/SwQk3MHz/logo-white-mini.png",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.changePhotoText}>Changer la photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Pseudo</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={pseudo}
            onChangeText={setPseudo}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleUpdateField("pseudo", pseudo)}
          >
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleUpdateField("email", email)}
          >
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Mot de passe</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Laissez vide pour ne pas changer"
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleUpdateField("password", password)}
          >
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

       
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#18709E",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#18709E",
  },
  changePhotoText: {
    marginTop: 10,
    color: "#18709E",
    fontSize: 14,
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#18709E",
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});