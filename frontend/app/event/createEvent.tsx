import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Animated } from "react-native"; 
import { useState, useRef } from "react";
import { useCreateEvent } from "@/hooks/useCreateEvents";
import { useFetchCities } from "@/hooks/useFetchCities";
import { useFetchSports } from "@/hooks/useFetchSport";

interface CreateEventProps {
  onClose: () => void;
  refetch: () => void;
}

export default function CreateEvent({ onClose, refetch }: CreateEventProps) {
  const { mutate, isPending, isError, error } = useCreateEvent();
  const [currentStep, setCurrentStep] = useState(1);
  const [sportQuery, setSportQuery] = useState("");  
  const [cityQuery, setCityQuery] = useState("");   
  const { cities, loading: loadingCities } = useFetchCities(cityQuery);
  const { sports, loading: loadingSports } = useFetchSports(sportQuery);
  const [eventData, setEventData] = useState({
    name: "",
    sport: "",
    location: "",
    plannedAt: "",
    maxParticipants: "",
    visibility: "PUBLIC",
    description: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const validateForm = () => {
    if (currentStep === 1 && !eventData.name) return "Le nom de l'événement est requis !";
    if (currentStep === 2 && !eventData.sport) return "Le sport est requis !";
    if (currentStep === 3 && !eventData.location) return "Le lieu est requis !";
    if (currentStep === 4 && !eventData.plannedAt) return "La date est requise !";
    if (currentStep === 5 && !eventData.visibility) return "Le statut de votre événement est requis !";
    if (currentStep === 6 && !eventData.description) return "La description est requise !";
    return "";
  };

  const transitionToNextStep = () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setErrorMessage("");
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep((prev) => prev + 1);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const submit = () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const formData = { ...eventData, maxParticipants: parseInt(eventData.maxParticipants, 10) };
    mutate(formData, {
      onSuccess: () => {
        refetch();
        onClose();
      },
      onError: (err: any) => {
        setErrorMessage(err.message || "Erreur lors de la création de l'événement.");
      },
    });
  };

  return (
    <View style={styles.modalContainer}>
      <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}> 
        <Text style={styles.modalTitle}>Créer un événement</Text>

        {/* Étape 1: Nom */}
        {currentStep === 1 && (
          <>
            <TextInput
              placeholder="Nom de l'événement"
              style={styles.input}
              value={eventData.name}
              onChangeText={(text) => setEventData({ ...eventData, name: text })}
            />
            <TouchableOpacity style={styles.button} onPress={transitionToNextStep}>
              <Text style={styles.buttonText}>Suivant</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Étape 2: Sélection du sport */}
        {currentStep === 2 && (
          <>
            <TextInput
              placeholder="Sport"
              style={styles.input}
              value={sportQuery}  
              onChangeText={setSportQuery}  
            />
            {loadingSports && <ActivityIndicator size="small" color="#007AFF" />}
            <FlatList
              data={sports}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  setEventData({ ...eventData, sport: item });
                  setSportQuery(item); 
                }}>
                  <Text style={styles.suggestion}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.button} onPress={transitionToNextStep}>
              <Text style={styles.buttonText}>Suivant</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Étape 3: Lieu */}
{currentStep === 3 && (
  <>
    <TextInput
      placeholder="Lieu"
      style={styles.input}
      value={eventData.location}
      onChangeText={(text) => {
        setCityQuery(text);  
        setEventData({ ...eventData, location: text });  
      }}
    />
    {loadingCities && <ActivityIndicator size="small" color="#007AFF" />}
    <FlatList
      data={cities}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            setEventData({ ...eventData, location: item });  
            setCityQuery(item);
          }}
        >
          <Text style={styles.suggestion}>{item}</Text>
        </TouchableOpacity>
      )}
    />
    <TouchableOpacity style={styles.button} onPress={transitionToNextStep}>
      <Text style={styles.buttonText}>Suivant</Text>
    </TouchableOpacity>
  </>
)}


        {/* Étape 4: Date */}
        {currentStep === 4 && (
          <>
            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              style={styles.input}
              value={eventData.plannedAt}
              onChangeText={(text) => setEventData({ ...eventData, plannedAt: text })}
            />
            <TouchableOpacity style={styles.button} onPress={transitionToNextStep}>
              <Text style={styles.buttonText}>Suivant</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Étape 5: Visibilité */}
        {currentStep === 5 && (
          <>
            <Text style={styles.modalTitle}>Choisissez la visibilité</Text>
            <View style={styles.visibilityOptions}>
              {["PUBLIC", "PRIVATE", "FRIENDS"].map((visibility) => (
                <TouchableOpacity
                  key={visibility}
                  style={[
                    styles.visibilityButton,
                    eventData.visibility === visibility && styles.selectedButton
                  ]}
                  onPress={() => setEventData({ ...eventData, visibility })}
                >
                  <Text style={styles.buttonText}>{visibility}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={transitionToNextStep}>
              <Text style={styles.buttonText}>Suivant</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Étape 6: Description */}
        {currentStep === 6 && (
          <>
            <TextInput
              placeholder="Description de l'événement"
              style={styles.input}
              value={eventData.description}
              onChangeText={(text) => setEventData({ ...eventData, description: text })}
            />
            <TouchableOpacity style={styles.button} onPress={submit}>
              <Text style={styles.buttonText}>Créer l'événement</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Affichage des messages */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        {isError ? <Text style={styles.errorText}>{error?.message}</Text> : null}
        {isPending && <ActivityIndicator size="small" color="#007AFF" />}
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 15, width: "85%", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8, fontSize: 16 },
  suggestion: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  button: { backgroundColor: "#007AFF", padding: 12, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cancelText: { marginTop: 10, textAlign: "center", color: "red", fontSize: 16 },
  errorText: { color: "red", fontSize: 14, textAlign: "center", marginTop: 10 },
  visibilityOptions: { marginVertical: 10 },
  visibilityButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  selectedButton: { backgroundColor: "#007AFF" },
});
