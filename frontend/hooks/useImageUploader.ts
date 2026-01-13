import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { fetchAPI } from "@/services/api";

export const useImageUploader = () => {
  const uploadImageToImgBB = async (): Promise<string | null> => {
    try {
      // Ouvrir le sélecteur d'images
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.canceled) {
        return null; // L'utilisateur a annulé la sélection
      }

      const imageUri = result.assets[0].uri;

      // Préparer les données pour ImgBB
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "uploaded-image.jpg",
      });

      // Envoyer la requête à ImgBB
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=913f18e85c55e3abe3618f0928cbec14",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data.url; // Retourner l'URL de l'image
      } else {
        Alert.alert("Erreur", "Impossible de télécharger l'image.");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image :", error);
      Alert.alert("Erreur", "Une erreur est survenue lors du téléchargement.");
      return null;
    }
  };

  const updateImage = async (url: string, endpoint: string, token: string | null) => {
    try {
      const body = { image: url };
      await fetchAPI(endpoint, "PATCH", token, body);
      Alert.alert("Succès", "L'image a été mise à jour !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'image :", error);
      Alert.alert("Erreur", "Impossible de mettre à jour l'image.");
    }
  };

  return { uploadImageToImgBB, updateImage };
};