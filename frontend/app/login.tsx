import { useForm, Controller } from 'react-hook-form';
import { View, TextInput, Button, Text } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useFetchQuery } from '@/hooks/useFetchQuery';

const schema = yup.object({
  email: yup.string().email("Email invalide").required("Email obligatoire"),
  password: yup.string().min(6, "6 caractères min").required("Mot de passe requis"),
});

interface FormData {
  email: string;
  password: string;
}

const Form = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Réponse du serveur:", result);
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
    }
  };

  return (
    <View>
      <Controller name="email" control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Email" value={value} onChangeText={onChange} />
        )}
      />
      {errors.email && <Text>{errors.email.message}</Text>}

      <Controller name="password" control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Password" value={value} onChangeText={onChange} secureTextEntry />
        )}
      />
      {errors.password && <Text>{errors.password.message}</Text>}

      <Button title="Login" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default Form;
