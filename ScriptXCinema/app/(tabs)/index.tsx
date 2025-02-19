import { Image, StyleSheet, Platform, Button, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CustomButton } from '@/components/CustomButton';

export default function HomeScreen({ navigation }) {
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
        <ThemedText type="title"> ScriptX Cinema app</ThemedText>
      </ThemedView>  

      <ThemedView style={styles.buttonContainer}>
        <CustomButton title="Browse" onPress={() => navigation.navigate("Browse")} />
        <CustomButton title="Login" onPress={() => navigation.navigate("Search")} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  buttonContainer: {
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
});
