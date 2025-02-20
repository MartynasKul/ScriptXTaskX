import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TMDB_API_KEY, TMDB_ACCESS } from '@env'; // vscode typescript funnzies, says it cant find, but it reads all well :)

export default function browseScreen(){
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [movies, setMovies] = useState<{ [key: number]: any[] }>({});
  const [leastPopularMovies, setLeastPopularMovies] = useState<any[]>([]);
  const [latestMovies, setLatestMovies] = useState<any[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<any[]>([]);
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
    const fetchSpecialLists = async () => {
      try {
        const leastPopularResponse = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.asc&vote_count.gte=10`
        );
        const leastPopularData = await leastPopularResponse.json();
        setLeastPopularMovies(leastPopularData.results);

        const latestMoviesResponse = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=release_date.desc`
        );
        const latestMoviesData = await latestMoviesResponse.json();
        setLatestMovies(latestMoviesData.results);

        const upcomingMoviesResponse = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const upcomingMoviesData = await upcomingMoviesResponse.json();
        setUpcomingMovies(upcomingMoviesData.results);
      } catch (error) {
        console.error('Could not fetch special movie lists: ', error);
      }
    };

    fetchSpecialLists();
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
    
    <FlatList
    data={[{ title: 'Least Popular Movies', data: leastPopularMovies }, { title: 'Latest Movies', data: latestMovies }, { title: 'Upcoming Movies', data: upcomingMovies }, ...genres]}
    keyExtractor={(item, index) => index.toString()}
    showsVerticalScrollIndicator={false}
    renderItem={({ item }) => (
      <View style={styles.genreContainer}>
        <ThemedText style={styles.genreTitle} type="subtitle">{item.title || item.name}</ThemedText>
        <FlatList
          data={item.data || movies[item.id]}
          keyExtractor={(movie) => movie.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: movie }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/movieDetailsScreen', params: { movieId: movie.id } })}
              style={styles.movieContainer}
            >
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                style={styles.movieImage}
                defaultSource={require('@/assets/images/cinema.jpg')}
              />
              <ThemedText type="default" style={styles.movieTitle}>{movie.title}</ThemedText>
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