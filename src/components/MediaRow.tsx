import React from 'react';
import { MediaCard } from './MediaCard';

interface MediaRowProps {
  title: string;
  items: any[];
  type?: 'movie' | 'tv';
}

export const MediaRow: React.FC<MediaRowProps> = ({ title, items, type }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8 pl-4 md:pl-12">
      <h2 className="text-white text-lg md:text-xl font-bold mb-3 hover:text-onyx-light-gray transition-colors cursor-pointer">
        {title}
      </h2>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 pr-4">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </div>
  );
};
