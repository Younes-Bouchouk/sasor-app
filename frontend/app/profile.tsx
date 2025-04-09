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
  ScrollView,
  Platform,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useMutation } from "@tanstack/react-query";
import { fetchAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthProvider";
import * as Haptics from "expo-haptics";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { useImageUploader } from "@/hooks/useImageUploader";

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
  const { uploadImageToImgBB, updateImage } = useImageUploader();

  useEffect(() => {
    if (profile) {
      setEmail(profile.email || "");
      setPseudo(profile.pseudo || "");
      setBirthday(profile.birthday || "");
      setProfileImage(profile.image || "");
    }
  }, [profile]);

  const updateField = useMutation({
    mutationFn: async (formData) => {
      return fetchAPI("/users/me", "PATCH", token, formData);
    },
    onSuccess: () => {
      Alert.alert("Succès", "Votre profil a été mis à jour !");
      refetch();
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour :", error);
      Alert.alert("Erreur", "Impossible de mettre à jour votre profil.");
    },
  });

  const handleUpdateField = (field: string, value: string) => {
    const formData = { [field]: value };
    updateField.mutate(formData);
  };

  const handlePickImage = async () => {
    const imageUrl = await uploadImageToImgBB();
    if (imageUrl) {
      updateImage(imageUrl, "/users/me", token);
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
    <View style={styles.container}>
      <View style={styles.headerBackground}>
      <Svg height="120" width="300%" viewBox="30 -19 1550 310">
                <Defs>
    <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <Stop offset="0" stopColor="#18709E" stopOpacity="1" />
      <Stop offset="1" stopColor="#ffffff" stopOpacity="1" />
    </LinearGradient>
  </Defs>
          <Path
            fill="url(#grad)"
           d="M0,96L48,122.7C96,149,192,203,288,213.3C384,224,480,192,576,170.7C672,149,768,139,864,144C960,149,1056,171,1152,192C1248,213,1344,235,1392,245.3L1440,256V0H0Z"
    fillOpacity="1"
          />
        </Svg>
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
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <InputField
          label="Pseudo"
          
          value={pseudo}
          onChangeText={(text) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setPseudo(text);
          }}
          onSave={() => handleUpdateField("pseudo", pseudo)}
        />
        <InputField
          label="Email"
          value={email}
          onChangeText={(text) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setEmail(text);
          }}
          onSave={() => handleUpdateField("email", email)}
        />
        <InputField
          label="Mot de passe"
          value={password}
          onChangeText={(text) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setPassword(text);
          }}
          onSave={() => handleUpdateField("password", password)}
          secure
        />
      </ScrollView>
    </View>
  );
}

function InputField({ label, value, onChangeText, onSave, secure }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure}
        />
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>✔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBackground: {
    backgroundColor: "#18709E",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 90,
    alignItems: "center",
  },
  profileSection: {
    marginTop: -50,
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: "#fff",
  },
  changePhotoText: {
    marginTop: 8,
    color: "#fff",
    fontWeight: "500",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
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
    backgroundColor: "#f0f0f0",
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