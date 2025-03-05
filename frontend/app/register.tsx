import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
    pseudo: yup.string(),
    email: yup.string(),
    password: yup.string(),
    birthday: yup.string(),
});

interface FormData {
    pseudo: string,
    email: string,
    password: string,
    confirmPassword: string,
    birthday: string,
}

export default function Register() {
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({ resolver: yupResolver(schema) });

    const [errorMessage, setErrorMessage] = useState()

    const submit = async (formData) => {
        try {
            const response = await fetch('http://localhost:4000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json(); // ✅ Attendre que la réponse JSON soit parsée
            console.log(data); // ✅ Maintenant, on a bien les données
        } catch (error) {
            console.error("Erreur lors de la requête :", error);
        }
    };

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                padding: 10,
                gap: 5,
            }}
        >
            <Text>Page d'inscription</Text>
            <View style={{ gap: 5 }}>
                <Controller
                    name="pseudo"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text>Pseudo</Text>
                            <TextInput
                                style={{ border: "1px solid black" }}
                                value={value}
                                onChangeText={onChange}
                            />
                        </View>
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text>Email</Text>
                            <TextInput
                                style={{ border: "1px solid black" }}
                                value={value}
                                onChangeText={onChange}
                            />
                        </View>
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text>Mot de passe</Text>
                            <TextInput
                                style={{ border: "1px solid black" }}
                                value={value}
                                onChangeText={onChange}
                            />
                        </View>
                    )}
                />
                                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text>Mot de passe à confirmer</Text>
                            <TextInput
                                style={{ border: "1px solid black" }}
                                value={value}
                                onChangeText={onChange}
                            />
                        </View>
                    )}
                />
                <Controller
                    name="birthday"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Text>Date de naissance</Text>
                            <TextInput
                                style={{ border: "1px solid black" }}
                                value={value}
                                onChangeText={onChange}
                            />
                        </View>
                    )}
                />
                <Button
                    title="Continue"
                    onPress={handleSubmit(submit)}
                />
            </View>
            <Text>{errorMessage}</Text>
        </View>
    );
}
