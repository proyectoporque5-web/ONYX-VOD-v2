import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import { searchMulti, getTrendingMovies, getImageUrl } from '../api/tmdb';

export const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounce search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        try {
          const response = await searchMulti(query);
          // Filter out people, only show movies and tv
          const filteredResults = response.data.results.filter(
            (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
          );
          setResults(filteredResults);
        } catch (error) {
          console.error("Error searching:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // If query is empty, show trending suggestions
        fetchTrendingSuggestions();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchTrendingSuggestions = async () => {
    setLoading(true);
    try {
      const response = await getTrendingMovies();
      setResults(response.data.results);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load for suggestions
  useEffect(() => {
    fetchTrendingSuggestions();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 sticky top-0 bg-black z-20 py-2">
        <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar películas, series..."
            className="w-full bg-[#333333] text-white placeholder-gray-400 rounded-md py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-500"
            autoFocus
          />
        </div>
      </div>

      {/* Results Label */}
      <h2 className="text-xl font-bold mb-4 text-gray-200">
        {query ? 'Resultados' : 'Resultados sugeridos'}
      </h2>

      {/* Grid Results */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {results.map((item) => (
            <Link 
              key={item.id} 
              to={`/media/${item.media_type || 'movie'}/${item.id}`}
              className="relative aspect-[2/3] bg-[#141414] rounded-md overflow-hidden hover:scale-105 transition-transform duration-200"
            >
              {item.poster_path ? (
                <img
                  src={getImageUrl(item.poster_path)}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#222] text-gray-500 text-xs text-center p-2">
                  No Image
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          <p>No se encontraron resultados para "{query}"</p>
        </div>
      )}
    </div>
  );
};
