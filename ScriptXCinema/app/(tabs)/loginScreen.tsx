import { Image, StyleSheet, Platform, Button, Text, Alert, TextInput } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CustomButton } from '@/components/CustomButton';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';


export default function loginScreen({}) {
  const [email, setEmail] = useState('Email');
  const [password, setPassword] = useState('Password');
  const router = useRouter();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/cinema.jpg')}
          style={styles.image}
        />
      }>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title"> Login</ThemedText>
        <ThemedText type="default"> This feature will be implemented at a later stage :)</ThemedText>
      </ThemedView>  
      <ThemedView style={styles.textFieldContainer}>
        <TextInput style={styles.textField} onChangeText={setEmail} />
        <TextInput style={styles.textField} onChangeText={setPassword} />
      </ThemedView>
      <ThemedView style={styles.buttonContainer}>
        <CustomButton title="Login" onPress={() => Alert.alert("pressed Login button, input text: "+ email + " and " +password)}/>
        <CustomButton title="Home" onPress={() => router.push("/")} />
        <CustomButton title="Browse" onPress={() => router.push("/(tabs)/browseScreen")} />
        <ThemedText type="default"> WHY IS GITHUB ON WSL ACTING UP HELLO PLZ</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    
  },
  textFieldContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    
    gap:5
  },
  image:{
    height: 250,
    width: 500,
    bottom: 0,
    left: 0,
    position: 'relative',
    alignSelf: 'center',
  },
  textField:{
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    margin: 5,
    borderRadius:12,
    backgroundColor: '#CCCCFF',
    textAlign: 'center',
  }
});
