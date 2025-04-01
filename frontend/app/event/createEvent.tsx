import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { useState } from "react";
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
  const [query, setQuery] = useState("");
  const { cities, loading } = useFetchCities(query);
  const { sports } = useFetchSports(query);
  const [eventData, setEventData] = useState({
    name: "",
    sport: "",
    location: "",
    plannedAt: "",
    maxParticipants: "",
    visibility: "PUBLIC",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = () => {
    if (currentStep === 1 && !eventData.name) return "Le nom de l'événement est requis !";
    if (currentStep === 2 && !eventData.sport) return "Le sport est requis !";
    if (currentStep === 3 && !eventData.location) return "Le lieu est requis !";
    if (currentStep === 4 && !eventData.plannedAt) return "La date est requise !";
    return "";
  };

  const nextStep = () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setErrorMessage("");
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setErrorMessage("");
    setCurrentStep((prev) => prev - 1);
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
      <View style={styles.modalContent}>
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
            <TouchableOpacity style={styles.button} onPress={nextStep}>
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
              value={eventData.sport}
              onChangeText={(text) => {
                setQuery(text); // Mettre à jour la requête pour l'autocomplétion
                setEventData({ ...eventData, sport: text });
              }}
            />

            {/* Affichage des suggestions */}
            {loading && <ActivityIndicator size="small" color="#007AFF" />}
            <FlatList
              data={sports}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setEventData({ ...eventData, sport: item })}>
                  <Text style={styles.suggestion}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.button} onPress={() => setCurrentStep(3)}>
              <Text style={styles.buttonText}>Suivant</Text>
            </TouchableOpacity>
          </>

        )}          
          {currentStep === 3 && (
            <>
              <TextInput
                placeholder="Lieu"
                style={styles.input}
                value={eventData.location}
                onChangeText={(text) => {
                  setQuery(text);
                  setEventData({ ...eventData, location: text });
                }}
              />

              {/* Affichage des suggestions */}
              {loading && <ActivityIndicator size="small" color="#007AFF" />}
              <FlatList
                data={cities}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => setEventData({ ...eventData, location: item })}>
                    <Text style={styles.suggestion}>{item}</Text>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity style={styles.button} onPress={() => setCurrentStep(4)}>
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
            <TouchableOpacity style={styles.button} onPress={prevStep}>
              <Text style={styles.buttonText}>Retour</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={submit}>
              <Text style={styles.buttonText}>Créer</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Affichage des messages */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        {isError ? <Text style={styles.errorText}>{error?.message}</Text> : null}

        {/* Affichage du chargement */}
        {isPending && <ActivityIndicator size="small" color="#007AFF" />}

        {/* Annuler */}
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%" },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 },
  suggestion: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  button: { backgroundColor: "#007AFF", padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  cancelText: { marginTop: 10, textAlign: "center", color: "red" },
  errorText: { color: "red", fontSize: 14, textAlign: "center", marginTop: 10 },
});