import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Text, Button, ScrollView, Alert} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect, useNavigation } from 'expo-router';
import { TMDB_API_KEY, TMDB_ACCESS } from '@env'; // vs code typescript funnzies, says it cant find, but it reads all well :)
import { ThemedText } from '@/components/ThemedText';
import { CustomButton } from '@/components/CustomButton';

export default function movieDetailsScreen(){
  const router  = useRouter();
  const { movieId } = useLocalSearchParams();
  const [ movie, setMovie] = useState(null);
  const [ relatedMovies, setRelatedMovies] = useState([]);
  const [ loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try{
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=genres`
        );
        const movieData = await response.json();
        setMovie(movieData);
        
        // Fetch related movies
        if(movieData.genres.length>0){
          const genreId = movieData.genres[0].id;
          const relatedResponse = await fetch(
             `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=release_date.desc`
          );
          const relatedData= await relatedResponse.json();
          setRelatedMovies(relatedData.results);
        }
      }
      catch(error){
        console.error('Couldnt fetch movie details: ', error);
      }
      finally{
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  useFocusEffect(
    useCallback(() => {
      if(movie){
        navigation.setOptions({ title: movie.title, headerBackTitle: 'Back' 

        });
      }
    }, [movie]
  ));
  
  if(loading){
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator}/>
  }
  
  console.log(movie.video);
  if(!movie){
    return <ThemedText type="title">Movie not found</ThemedText>
  }
  return(
    <ScrollView style={styles.container}>
      
      <Image 
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} 
        style={styles.movieImage} 
      />

      <ThemedText type="title"> Release date: {movie.release_date}</ThemedText>
      <ThemedText type="subtitle"style={styles.description}>{movie.overview || "There is no description at this time"}</ThemedText>
      <CustomButton title="Play Movie"
        onPress={() => Alert.alert("Play Movie feature will come at a later date")}
        disabled={!movie.video}
      />
      <CustomButton title="Add to library" 
        onPress={() => Alert.alert("Addition to library feature will come at a later date")}
      />
  
      <Text style={styles.sectionTitle}>Movies that might interest you:</Text>
      <FlatList data={relatedMovies}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push({ pathname: '/movieDetailsScreen', params: { movieId: item.id } })}>
            <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.relatedMovieImage} />
            <Text style={styles.relatedTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 20 
  },
  loadingIndicator: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  errorText: { 
    textAlign: 'center', 
    fontSize: 18, 
    color: 'red' 
  },
  movieImage: { 
    width: '100%', 
    height: 300, 
    borderRadius: 10,
    paddingBottom: 10

  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 10 
  },
  description: { 
    fontSize: 16, 
    marginVertical: 10 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginTop: 20 
  },
  relatedMovieImage: { 
    width: 100, 
    height: 150, 
    borderRadius: 10, 
    marginRight: 10 
  },
  relatedTitle: { 
    fontSize: 14, 
    textAlign: 'center', 
    marginTop: 5 }
    ,  
});