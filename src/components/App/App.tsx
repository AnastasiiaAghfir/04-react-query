import { useState, useEffect } from 'react';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import type { Movie } from '../../types/movie';
import MovieModal from '../MovieModal/MovieModal';
import fetchMovies from '../../services/movieService';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from '../ReactPaginate/ReactPaginate';
import toast, { Toaster } from 'react-hot-toast';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
  if (isSuccess && data?.results.length === 0) {
    toast.error("No movies found for your request.");
  }
}, [isSuccess, data]);

  const handleSearch = async (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      {query && isLoading && <Loader />}
      {!isError && !isLoading && data?.results && (
        <MovieGrid onSelect={setSelectedMovie} movies={data.results} />
      )}
      {isError && <ErrorMessage />}

      {data && data?.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          forcePage={currentPage}
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
