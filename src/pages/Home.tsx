import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { 
  getTrendingMovies, 
  getActionMovies, 
  getHorrorMovies, 
  getTrendingTV, 
  getAnimationTV, 
  getDramaTV 
} from '../api/tmdb';
import { HeroBanner } from '../components/HeroBanner';
import { MediaRow } from '../components/MediaRow';

export const Home = () => {
  const [heroItem, setHeroItem] = useState<any>(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [animationTV, setAnimationTV] = useState([]);
  const [dramaTV, setDramaTV] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          tMovies, 
          aMovies, 
          hMovies, 
          tTV, 
          animTV, 
          dTV
        ] = await Promise.all([
          getTrendingMovies(),
          getActionMovies(),
          getHorrorMovies(),
          getTrendingTV(),
          getAnimationTV(),
          getDramaTV()
        ]);

        setTrendingMovies(tMovies.data.results);
        setActionMovies(aMovies.data.results);
        setHorrorMovies(hMovies.data.results);
        setTrendingTV(tTV.data.results);
        setAnimationTV(animTV.data.results);
        setDramaTV(dTV.data.results);

        // Set random hero item from trending
        const allTrending = [...tMovies.data.results, ...tTV.data.results];
        setHeroItem(allTrending[Math.floor(Math.random() * allTrending.length)]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-onyx-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-onyx-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-onyx-black pb-20 relative">
      {/* Search Icon Overlay */}
      <div className="absolute top-4 right-4 z-50">
        <Link 
          to="/search" 
          className="p-3 bg-black/50 rounded-full backdrop-blur-md hover:bg-black/70 transition-colors flex items-center justify-center"
        >
          <Search className="w-6 h-6 text-white" />
        </Link>
      </div>

      <HeroBanner item={heroItem} />
      
      <div className="-mt-20 relative z-10">
        <MediaRow title="Tendencias" items={trendingMovies} type="movie" />
        <MediaRow title="Series Populares" items={trendingTV} type="tv" />
        <MediaRow title="Acción" items={actionMovies} type="movie" />
        <MediaRow title="Terror" items={horrorMovies} type="movie" />
        <MediaRow title="Animación" items={animationTV} type="tv" />
        <MediaRow title="Dramas" items={dramaTV} type="tv" />
      </div>
    </div>
  );
};
