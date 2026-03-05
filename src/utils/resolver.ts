export const resolveStream = async (imdbId: string, type: string = 'movie', season: number | null = null, episode: number | null = null) => {
  if (!imdbId) return [];

  // Returning the requested sources
  return [
    { name: 'Latino VIP (VidSrc)', url: `https://vidsrc.me/embed/movie?imdb=${imdbId}` },
    { name: 'Alternativo (SuperEmbed)', url: `https://multiembed.mov/directstream.php?video_id=${imdbId}&tmdb=1` },
    { name: 'Estreno Rápido', url: `https://vidsrc.to/embed/movie/${imdbId}` }
  ];
};
