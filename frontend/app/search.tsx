import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useUnfollowUser } from "@/hooks/useUnfollowUser";
import { useFollowUser } from "@/hooks/useFollowUser";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { User } from "@/types/userType";

export default function SearchPage() {
    const [inputValue, setInputValue] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const {
        data: users,
        isLoading: loadingUsers,
        error: errorUsers,
        refetch,
    } = useFetchQuery("users", `/users?search=${inputValue}`, 500);

    const { mutate: unfollow } = useUnfollowUser();
    const { mutate: follow } = useFollowUser();

    const handleUnfollow = (userId: number) => {
        unfollow(userId, {
            onSuccess: () => {
                refetch(); // <- refresh les données après l'action
            },
        });
    };

    const handleFollow = (userId: number) => {
        follow(userId, {
            onSuccess: () => {
                refetch(); // <- idem ici
            },
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Rechercher"
                    placeholderTextColor="grey"
                    style={styles.searchBar}
                    value={inputValue}
                    onChangeText={(text) => setInputValue(text)}
                />
                <TouchableOpacity
                    onPress={() => {
                        setHasSearched(true);
                        refetch();
                    }}
                >
                    <Ionicons name="search-outline" size={25} color="black" />
                </TouchableOpacity>
            </View>

            {hasSearched && !loadingUsers && users?.length === 0 ? (
                <Text style={styles.emptyMessage}>Aucun utilisateur trouvé</Text>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <UserItem
                            user={item}
                            followUser={handleFollow}
                            unfollowUser={handleUnfollow}
                        />
                    )}
                />
            )}
        </View>
    );
}

const UserItem = ({
    user,
    followUser,
    unfollowUser,
}: {
    user: User;
    followUser: (userId: number) => void;
    unfollowUser: (userId: number) => void;
}) => {
    return (
        <View style={styles.userItem}>
            <View style={styles.userInfo}>
                <Image
                    source={{
                        uri:
                            user.image ||
                            "https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
                    }}
                    style={styles.avatar}
                />
                <Text style={styles.username}>{user.pseudo}</Text>
            </View>

            <View style={styles.actions}>
                {user.isFollowing && (
                    <Text style={styles.followingText}>Vous suit</Text>
                )}
                {user.isFollower ? (
                    <TouchableOpacity onPress={() => unfollowUser(user.id)}>
                        <Text style={styles.unfollowBtn}>Ne plus suivre</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => followUser(user.id)}>
                        <Text style={styles.followBtn}>Suivre</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        paddingBottom: 8,
    },
    searchBar: {
        textAlign: "center",
        height: 40,
        paddingLeft: 10,
        borderRadius: 3,
        width: "90%",
    },
    emptyMessage: {
        marginTop: 20,
        textAlign: "center",
        color: "grey",
    },
    userItem: {
        marginTop: 10,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    username: {
        fontSize: 15,
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    followingText: {
        fontSize: 10,
    },
    unfollowBtn: {
        color: "darkblue",
        borderWidth: 1,
        borderColor: "darkblue",
        padding: 5,
        borderRadius: 5,
    },
    followBtn: {
        color: "white",
        backgroundColor: "darkblue",
        padding: 5,
        borderRadius: 5,
    },
});
