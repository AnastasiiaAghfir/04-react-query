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
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Pagination from '../Pagination/Pagination';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  const handleSearch = async (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      {isLoading && <Loader />}
      {!isError && !isLoading && data?.results && (
        <MovieGrid onSelect={setSelectedMovie} movies={data.results} />
      )}
      {isError && <ErrorMessage />}

      {data?.total_pages > 1 && (
        <Pagination
          totalPages={data.total_pages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      {selectedMovie && (
        <MovieModal
          onClose={() => {
            setSelectedMovie(null);
          }}
          movie={selectedMovie}
        />
      )}
    </div>
  );
}
