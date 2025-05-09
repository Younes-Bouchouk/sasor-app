import { useAuth } from "@/contexts/AuthProvider";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { fetchAPI } from "@/services/api";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";

export default function FollowingPage() {
    const [following, setFollowing] = useState([]);
    const { token } = useAuth(); 
    const {
        data: followingData,
        isLoading: loadingFollowing,
        error: errorFollowing,
        refetch,
    } = useFetchQuery("following", "/follows/me/following");

    useEffect(() => {
        if (followingData) {
            setFollowing(followingData);
        }
    }, [followingData]);

    useFocusEffect(
        useCallback(() => {
            refetch(); // Rafraîchit les données à chaque fois que la page est affichée
        }, [refetch])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Mes abonnements</Text>
            {loadingFollowing ? (
                <ActivityIndicator size="small" color="#007AFF" />
            ) : errorFollowing ? (
                <Text style={styles.errorText}>Erreur : {errorFollowing.message}</Text>
            ) : (
                <FlatList
                    data={following}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Image
                                source={{
                                    uri:
                                        item.following?.image ||
                                        "https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
                                }}
                                style={styles.image}
                            />
                            <Text>{item.following?.pseudo || "Utilisateur inconnu"}</Text>
                            <TouchableOpacity
                                        onPress={async () => {
                                            const removedUser = item; // Sauvegardez l'utilisateur supprimé localement
                                            try {
                                                // Supprimez l'utilisateur localement
                                                setFollowing((prevFollowers) =>
                                                    prevFollowers.filter(
                                                        (f) =>
                                                            f.following.id !==
                                                            item.following.id
                                                    )
                                                );

                                                // Envoyez la requête DELETE à l'API
                                                const body = {
                                                    followingId:
                                                        item.following.id,
                                                };
                                                const response = await fetchAPI(
                                                    `/follows/me`,
                                                    "DELETE",
                                                    token,
                                                    body
                                                );
                                                console.log(
                                                    "Réponse de l'API :",
                                                    response
                                                );

                                                // Rechargez les données depuis l'API pour garantir la cohérence
                                                await refetch();
                                            } catch (error) {
                                                console.error(
                                                    "Erreur lors de la suppression de l'abonnement :",
                                                    error
                                                );
                                                Alert.alert(
                                                    "Erreur",
                                                    "Une erreur s'est produite lors de la suppression."
                                                );

                                                // Restaurez l'utilisateur supprimé en cas d'erreur
                                                setFollowing(
                                                    (prevFollowers) => [
                                                        ...prevFollowers,
                                                        removedUser,
                                                    ]
                                                );
                                            }
                                        }}
                                        style={styles.button}
                                    >
                                        <Text style={styles.buttonText}>
                                            Ne plus suivre
                                        </Text>
                                    </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        flex: 1,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        fontSize: 14,
        textAlign: "center",
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },
});
