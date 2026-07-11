import { useState } from 'react';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import type { Movie } from '../../types/movie';
import toast, { Toaster } from 'react-hot-toast';
import MovieModal from '../MovieModal/MovieModal';
import fetchMovies from '../../services/movieService';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const handleSearch = async (query: string) => {
    setMovies([]);
    setIsLoading(true);
    setIsError(false);
    try {
      const movies = await fetchMovies(query);
      if (movies.length > 0) {
        setMovies(movies);
        
      } else {
       toast.error('No movies found for your request.');
      }
      
      } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
      }
  };
  
  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      {(isLoading && <Loader />)}
      {(!isError && !isLoading && movies.length > 0) && <MovieGrid onSelect={setSelectedMovie} movies={movies} />}
      {(isError) && <ErrorMessage />}
      {(selectedMovie)&& <MovieModal onClose={() => {setSelectedMovie(null)}} movie={selectedMovie}/>}

    </div>
  )
}

