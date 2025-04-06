import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Animated } from "react-native"; 
import { useState, useRef } from "react";
import { useCreateEvent } from "@/hooks/useCreateEvents";
import { useFetchCities } from "@/hooks/useFetchCities";
import { useFetchSports } from "@/hooks/useFetchSport";
import { RefetchOptions } from "@tanstack/react-query";
import React from "react";
import { DatePicker } from "@/components/ui/DatePicker";
import Icon, { Ionicons } from '@expo/vector-icons';

// Définir un type pour les données de l'événement
interface EventData {
  name: string;
  sport: string;
  location: string;
  plannedAt: string;
  maxParticipants: number | string;
  visibility: string;
  description: string;
}

interface CreateEventProps {
  onClose: () => void;
  refetch: (options?: RefetchOptions) => Promise<any>;
  refetchMyEvents: (options?: RefetchOptions) => Promise<any>;
}

export default function CreateEvent({ onClose, refetch }: CreateEventProps) {
  const { mutate, isPending, isError, error } = useCreateEvent();
  const [currentStep, setCurrentStep] = useState(1);
  const [sportQuery, setSportQuery] = useState("");  
  const [cityQuery, setCityQuery] = useState("");   
  const { cities, loading: loadingCities } = useFetchCities(cityQuery);
  const { sports, loading: loadingSports } = useFetchSports(sportQuery);
  
  // Initialisation des données de l'événement avec le bon type
  const [eventData, setEventData] = useState<EventData>({
    name: "",
    sport: "",
    location: "",
    plannedAt: "",
    maxParticipants: 0,
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
    if (currentStep === 5 && !eventData.maxParticipants) return "Le nombre de participoant maximum est requis pour continuez !";
    if (currentStep === 6 && !eventData.visibility) return "La visibilmité de l'événement est requise !";
    if (currentStep === 7 && !eventData.description) return "La déscription de l'événement est requise !";

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

    // Créer un objet formData avec les données de l'événement
    const formData: EventData = { 
      ...eventData, 
      maxParticipants: parseInt(eventData.maxParticipants.toString(), 10) 
    };

    // Désactiver le bouton pendant la soumission
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
            <DatePicker
                value={eventData.plannedAt}
                onChange={(text) => setEventData({...eventData, plannedAt: text})}
            />
            
          </>
        )}

        {/* Étape 5: max participant */}
        {currentStep === 5 && (
          <>
            <TextInput
              placeholder="nomvre maximum de participant"
              style={styles.input}
              value={eventData.maxParticipants}
              onChangeText={(text) => setEventData({ ...eventData, maxParticipants: text })}
            />
           
          </>
        )}
         {/* Étape 6: Visibilité */}
         {currentStep === 6 && (
          <>
            <Text style={styles.modalTitle}>Choisissez la visibilité</Text>
            <View style={styles.visibilityOptions}>
              {["PUBLIC", "PRIVATE", "FRIENDS"].map((visibility) => (
                <TouchableOpacity
                  key={visibility}
                  style={[styles.visibilityButton, eventData.visibility === visibility && styles.selectedButton]}
                  onPress={() => setEventData({ ...eventData, visibility })}
                >
                  <Text style={styles.buttonText}>{visibility}</Text>
                </TouchableOpacity>
              ))}
            </View>
        
          </>
        )}

        {/* Étape 7: Description */}
        {currentStep === 7 && (
          <>
            <TextInput
              placeholder="Description de l'événement"
              style={styles.input}
              value={eventData.description}
              onChangeText={(text) => setEventData({ ...eventData, description: text })}
            />
           
          </>
        )}

       {/* Bouton précédent + suivant ou soumettre */}
    <View style={styles.navigationButtons}>
      {currentStep > 1 && (
       <TouchableOpacity
       style={[styles.button, styles.backButton]}
       onPress={() => setCurrentStep((prev) => prev - 1)}
     >
       <Text style={styles.buttonText}> Précédent</Text>
       <Ionicons name="arrow-back" size={18} color="#fff" />
     </TouchableOpacity>
     
      )}

      {currentStep < 7 ? (
        <TouchableOpacity
        style={styles.button}
        onPress={transitionToNextStep}
        disabled={isPending}
      >
        <Text style={styles.buttonText}>Suivant </Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>
      
      ) : (
        <TouchableOpacity
        style={styles.button}
        onPress={submit}
        disabled={isPending}
      >
        <Text style={styles.buttonText}> Créer l'événement</Text>
        <Ionicons name="checkmark-circle" size={18} color="#fff" />

      </TouchableOpacity>

      )}
    </View>

   
      <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, { width: `${(currentStep / 7) * 100}%` }]} />
  </View>

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
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#1c1c1e",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f5f5f7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d1d1d6",
  },
  suggestion: {
    padding: 12,
    fontSize: 16,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  button: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  backButton: {
    backgroundColor: "#d1d1d6",
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flexDirection: "row"
  },
  cancelText: {
    marginTop: 15,
    textAlign: "center",
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },
  visibilityOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  visibilityButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#e5e5ea",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  stepper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 10,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#f5f5f5",
  },
  activeStep: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF",
  },
  completedStep: {
    borderColor: "#4cd964",
    backgroundColor: "#4cd964",
  },
  stepText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "bold",
  },
  activeStepText: {
    color: "#fff",
  },
});


