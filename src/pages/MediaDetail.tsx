import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Star, Calendar, Clock } from 'lucide-react';
import { getMediaDetails, getTvSeason, getImageUrl } from '../api/tmdb';
import { resolveStream } from '../utils/resolver';

export const MediaDetail = () => {
  const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [seasonData, setSeasonData] = useState<any>(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [playingTrailer, setPlayingTrailer] = useState(false);
  const [servers, setServers] = useState<any[]>([]);
  const [showServerList, setShowServerList] = useState(false);

  const fetchSeason = async (seasonNum: number) => {
    if (!id) return;
    setLoadingSeason(true);
    try {
      const response = await getTvSeason(id, seasonNum);
      setSeasonData(response.data);
      setSelectedSeason(seasonNum);
    } catch (error) {
      console.error("Error fetching season:", error);
    } finally {
      setLoadingSeason(false);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (!type || !id) return;
      setLoading(true);
      try {
        const response = await getMediaDetails(type, id);
        setMedia(response.data);
        
        // If it's a TV show, fetch season 1 by default
        if (type === 'tv') {
          fetchSeason(1);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [type, id]);

  const handlePlay = async (episodeId?: number) => {
    const imdbId = media?.external_ids?.imdb_id;
    if (!imdbId) {
      alert('No IMDB ID found');
      return;
    }

    // Always fetch servers using the new resolver logic
    const fetchedServers = await resolveStream(imdbId);
    
    if (fetchedServers && fetchedServers.length > 0) {
      setServers(fetchedServers);
      setShowServerList(true);
    } else {
      alert('No servers found for this title.');
    }
  };

  const handleServerSelect = (url: string) => {
    navigate(`/player/webview?url=${encodeURIComponent(url)}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-onyx-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-onyx-red"></div>
      </div>
    );
  }

  if (!media) return null;

  const isMovie = type === 'movie';
  const releaseDate = media.release_date || media.first_air_date;
  const runtime = media.runtime || (media.episode_run_time ? media.episode_run_time[0] : null);
  
  // Find trailer
  const trailer = media.videos?.results?.find((vid: any) => vid.site === 'YouTube' && vid.type === 'Trailer');

  return (
    <div className="min-h-screen bg-onyx-black text-white pb-20">
      {/* Backdrop or Trailer Player */}
      <div className="relative h-[50vh] md:h-[70vh] w-full bg-black">
        <div className="absolute top-4 left-4 z-20">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors backdrop-blur-md"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
        </div>
        
        {playingTrailer && trailer ? (
          <div className="w-full h-full flex flex-col">
             <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="flex-1"
            ></iframe>
            <button 
              onClick={() => setPlayingTrailer(false)}
              className="w-full bg-onyx-dark-gray text-white py-2 font-bold hover:bg-gray-800 transition-colors"
            >
              Cerrar Tráiler
            </button>
          </div>
        ) : (
          <>
            <img 
              src={getImageUrl(media.backdrop_path, 'original')} 
              alt={media.title || media.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-onyx-black via-onyx-black/20 to-transparent" />
          </>
        )}
      </div>

      <div className="px-4 md:px-12 -mt-32 relative z-10">
        {/* Title & Meta */}
        <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg">
          {media.title || media.name}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300 mb-6 font-medium">
          <span className="text-green-400 font-bold">
            {Math.round(media.vote_average * 10)}% Match
          </span>
          {releaseDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(releaseDate).getFullYear()}
            </div>
          )}
          {runtime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {runtime} min
            </div>
          )}
          {media.genres?.map((g: any) => g.name).slice(0, 3).join(' • ')}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {isMovie && (
            <button 
              onClick={() => handlePlay()}
              className="w-full md:w-auto bg-onyx-red text-white text-lg font-bold py-3 px-8 rounded flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
            >
              <Play className="w-6 h-6 fill-white" />
              REPRODUCIR PELÍCULA
            </button>
          )}
          
          {trailer && (
            <button 
              onClick={() => setPlayingTrailer(true)}
              className="w-full md:w-auto bg-transparent border-2 border-gray-400 text-white text-lg font-bold py-3 px-8 rounded flex items-center justify-center gap-2 hover:bg-gray-400/20 transition-colors"
            >
              <Play className="w-6 h-6" />
              VER TRÁILER
            </button>
          )}
        </div>

        {/* Server List (Visible when servers are found) */}
        {showServerList && servers.length > 0 && (
          <div className="mb-8 bg-onyx-dark-gray/90 p-4 rounded-lg border border-white/10 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-white font-bold mb-3">Selecciona un servidor:</h3>
            <div className="flex flex-col gap-2">
              {servers.map((server, index) => (
                <button
                  key={index}
                  onClick={() => handleServerSelect(server.url)}
                  className="w-full text-left px-4 py-3 bg-black/50 hover:bg-onyx-red/20 border border-white/5 hover:border-onyx-red/50 rounded transition-all flex justify-between items-center group"
                >
                  <span className="font-medium text-gray-200 group-hover:text-white">{server.name}</span>
                  <Play className="w-4 h-4 text-gray-500 group-hover:text-onyx-red" />
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowServerList(false)}
              className="mt-3 text-sm text-gray-400 hover:text-white underline"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Overview */}
        <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-3xl mb-8">
          {media.overview}
        </p>

        {/* Cast */}
        <div className="mb-10">
          <h3 className="text-white font-bold mb-3">Reparto:</h3>
          <div className="flex flex-wrap gap-2 text-sm text-gray-400">
            {media.credits?.cast?.slice(0, 5).map((actor: any) => (
              <span key={actor.id} className="bg-onyx-dark-gray px-3 py-1 rounded-full border border-white/10">
                {actor.name}
              </span>
            ))}
          </div>
        </div>

        {/* TV Seasons & Episodes */}
        {!isMovie && (
          <div className="mt-8">
            {/* Season Selector */}
            <div className="flex items-center gap-4 mb-6 overflow-x-auto no-scrollbar pb-2">
              {media.seasons?.filter((s: any) => s.season_number > 0).map((season: any) => (
                <button
                  key={season.id}
                  onClick={() => fetchSeason(season.season_number)}
                  className={`whitespace-nowrap px-4 py-2 rounded font-medium transition-colors ${
                    selectedSeason === season.season_number 
                      ? 'bg-white text-black' 
                      : 'bg-onyx-dark-gray text-gray-400 hover:text-white'
                  }`}
                >
                  Temporada {season.season_number}
                </button>
              ))}
            </div>

            {/* Episodes List */}
            <div className="space-y-4">
              {loadingSeason ? (
                <div className="text-gray-500 py-8">Cargando episodios...</div>
              ) : (
                seasonData?.episodes?.map((episode: any) => (
                  <div 
                    key={episode.id} 
                    className="flex flex-col md:flex-row gap-4 p-4 bg-onyx-dark-gray/50 rounded-lg hover:bg-onyx-dark-gray transition-colors group"
                  >
                    <div className="relative flex-none w-full md:w-48 aspect-video rounded overflow-hidden bg-black">
                      <img 
                        src={getImageUrl(episode.still_path)} 
                        alt={episode.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button 
                          onClick={() => handlePlay(episode.episode_number)}
                          className="bg-black/60 p-3 rounded-full border border-white/20 hover:bg-onyx-red hover:border-onyx-red transition-colors"
                        >
                          <Play className="w-5 h-5 fill-white" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-white">
                          {episode.episode_number}. {episode.name}
                        </h4>
                        <span className="text-sm text-gray-400">{episode.runtime}m</span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {episode.overview}
                      </p>
                      
                      <button 
                        onClick={() => handlePlay(episode.episode_number)}
                        className="mt-3 md:hidden w-full bg-onyx-red/90 text-white text-sm font-bold py-2 rounded flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        REPRODUCIR EPISODIO
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
