import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Page d'accueil ( provisoire bien sûr  )</Text>
            <Link href={"/screens/register"}>Inscription</Link>
            <Link href={"/screens/login"}>Connexion</Link>
            <Link href={"/screens/event"}>Event</Link>
        </View>
    );
}

