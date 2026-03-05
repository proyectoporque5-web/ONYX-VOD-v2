import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { getImageUrl } from '../api/tmdb';

interface HeroBannerProps {
  item: any;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ item }) => {
  if (!item) return null;

  const mediaType = item.media_type || 'movie';

  return (
    <div className="relative h-[70vh] w-full mb-8">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={getImageUrl(item.backdrop_path, 'original')} 
          alt={item.title || item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx-black via-onyx-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-onyx-black/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 pb-12 flex flex-col justify-end h-full">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg max-w-2xl">
          {item.title || item.name}
        </h1>
        
        <p className="text-white/90 text-sm md:text-lg mb-6 line-clamp-3 max-w-xl drop-shadow-md">
          {item.overview}
        </p>

        <div className="flex gap-4">
          <Link 
            to={`/media/${mediaType}/${item.id}`}
            className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded font-bold hover:bg-opacity-90 transition-colors"
          >
            <Play className="w-5 h-5 fill-black" />
            Reproducir
          </Link>
          <Link 
            to={`/media/${mediaType}/${item.id}`}
            className="flex items-center gap-2 bg-gray-500/70 text-white px-6 py-2 rounded font-bold hover:bg-gray-500/50 transition-colors backdrop-blur-sm"
          >
            <Info className="w-5 h-5" />
            Más información
          </Link>
        </div>
      </div>
    </div>
  );
};
