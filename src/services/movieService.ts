import axios from "axios";
import type {Movie} from '../types/movie'

interface MovieResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export default async function fetchMovies(query: string, currentPage: number): Promise<MovieResponse> {
    const response = await axios.get<MovieResponse>('https://api.themoviedb.org/3/search/movie', {
        params: {
            query,
            page: currentPage,
        },
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        }
    })
    console.log(response.data);

    return response.data;
}