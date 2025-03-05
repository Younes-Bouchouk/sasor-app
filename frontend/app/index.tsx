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
            <Text>Page d'accueil ( provisoir bien sûr )</Text>
            {/* <Link href={""}>Inscription</Link>
            <Link href={""}>Connexion</Link> */}
            <Link href={"/event"}>Event</Link>
        </View>
    );
}