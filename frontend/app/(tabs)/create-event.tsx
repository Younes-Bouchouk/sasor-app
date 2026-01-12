import { ThemedText } from "@/components/themed-text";
import Container from "@/components/ui/container";
import { StyleSheet } from "react-native";

export default function CreateEventScreen() {
  return (
    <Container withPaddingTop={false}>
      <ThemedText type="subtitle" style={{textAlign:"center"}}>
        Créer un event
      </ThemedText>
    </Container>
  );
}

const styles = StyleSheet.create({
  
});
