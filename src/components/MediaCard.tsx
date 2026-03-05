import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/tmdb';

interface MediaCardProps {
  item: any;
  type?: 'movie' | 'tv';
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, type }) => {
  const mediaType = item.media_type || type || 'movie';
  
  return (
    <Link 
      to={`/media/${mediaType}/${item.id}`}
      className="flex-none w-32 md:w-44 transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-onyx-dark-gray">
        <img 
          src={getImageUrl(item.poster_path)} 
          alt={item.title || item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </Link>
  );
};
