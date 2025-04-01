import { Link, router } from "expo-router";
import { Text, View, Button, StyleSheet, Image } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Image de bienvenue */}
      <Image
        source={{ uri: "https://i.ibb.co/SwQk3MHz/logo-white-mini.png" }}
        style={styles.welcomeImage}
      />
      <Text style={styles.title}>Rejoindre des événements sportifs</Text>
      <Text style={styles.description}>
        Découvrez des événements sportifs près de chez vous et rejoignez une communauté dynamique.
      </Text>

      <View style={styles.buttonsContainer}>
       
       

        {/* Liens vers l'inscription et la connexion */}
        <Link href="/register" style={styles.link}>
          <Text style={styles.linkText}>S'inscrire</Text>
        </Link>
        <Link href="/login" style={styles.link}>
          <Text style={styles.linkText}>Se connecter</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5", 
    padding: 20,
  },
  welcomeImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover", 
    borderRadius: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#18709E",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    fontSize: 16,
    color: "#18709E",
    textDecorationLine: "underline",
  },
});
