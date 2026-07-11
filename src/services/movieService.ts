import axios from "axios";
import type {Movie} from '../types/movie'

interface MovieResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export default async function fetchMovies(query: string): Promise<Movie[]> {
    const response = await axios.get<MovieResponse>('https://api.themoviedb.org/3/search/movie', {
        params: {
            query,
        },
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        }
    })
    return response.data.results;
}