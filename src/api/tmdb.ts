import axios from 'axios';

const API_KEY = 'c6b1d606ddd5763bd3764aee5c669476';
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'es-MX';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: LANGUAGE,
  },
});

export const getTrendingMovies = () => api.get('/trending/movie/week');
export const getActionMovies = () => api.get('/discover/movie?with_genres=28');
export const getHorrorMovies = () => api.get('/discover/movie?with_genres=27');

export const getTrendingTV = () => api.get('/trending/tv/week');
export const getAnimationTV = () => api.get('/discover/tv?with_genres=16');
export const getDramaTV = () => api.get('/discover/tv?with_genres=18');

export const getMediaDetails = (type: 'movie' | 'tv', id: string) => 
  api.get(`/${type}/${id}`, {
    params: {
      append_to_response: 'videos,credits,similar,external_ids',
    },
  });

export const getTvSeason = (tvId: string, seasonNumber: number) =>
  api.get(`/tv/${tvId}/season/${seasonNumber}`);

export const searchMulti = (query: string) => 
  api.get(`/search/multi`, {
    params: {
      query,
      include_adult: false,
      language: LANGUAGE,
    },
  });

export const getImageUrl = (path: string, size: 'original' | 'w500' = 'w500') => 
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '';
