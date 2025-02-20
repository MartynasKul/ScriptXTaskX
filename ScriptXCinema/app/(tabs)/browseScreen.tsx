import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TMDB_API_KEY, TMDB_ACCESS } from '@env'; // vs code typescript funnzies, says it cant find, but it reads all well :)

export default function browseScreen(){
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [movies, setMovies] = useState<{ [key: number]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const genreData = await genreResponse.json();
        setGenres(genreData.genres);
      } 
      catch (error) {
        console.error('Couldnt fetch genres: ', error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    if(genres.length > 0) {
      setLoading(true);
      genres.forEach(async (genre) => {
        try { 
          const movieResponse = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genre.id}`
          );
          const movieData = await movieResponse.json();

          setMovies((prev) => ({ ...prev, [genre.id]: movieData.results }));
        } 
        catch(error) {
          console.error('Couldnt fetch movies: ', error);
        }
      });
      setLoading(false);
    }
  }, [genres]);

  if(loading){
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator}/>
  }

  return (
    
    <FlatList data={genres} keyExtractor={(item) => item.id.toString()}
    showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        
        <View style={styles.genreContainer}>
          <ThemedText style={styles.genreTitle}type='subtitle'>{item.name}</ThemedText>
          <FlatList data={movies[item.id]} keyExtractor={(item) => item.id.toString()}
            horizontal showsHorizontalScrollIndicator={false}
            renderItem={({ item: movie }) => (
              <TouchableOpacity 
                onPress={()=> router.push({pathname: '/movieDetailsScreen', params: {movieId: movie.id}})}
                style={styles.movieContainer}>
                <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`}}
                  style={styles.movieImage}
                  defaultSource={require('@/assets/images/cinema.jpg')} // android version of onError, to be used in case image is not found for some reason
                  // // ios but it dont work for some reason, have to investigate further
                  // onError={(e) => {
                  //   e.nativeEvent.target.setNativeProps({ source: require('@/assets/images/cinema.jpg')}); 
                  // }}
                />
                <ThemedText type='default' style={styles.movieTitle}>{movie.title}</ThemedText>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreContainer: {
    marginTop: 40,
    paddingHorizontal: 10,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  genreTitle: {
    padding:15,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  movieContainer: {
    marginLeft: 10,
    marginRight: 10,
    width: 120,
  },
  movieImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
  },
  movieTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 5,
  },
});