import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTrendingMovies, getActionMovies, getHorrorMovies } from '../src/api/tmdb';
import { LucideSearch } from 'lucide-react-native';

export default function Home() {
  const router = useRouter();
  const [trending, setTrending] = useState([]);
  const [action, setAction] = useState([]);
  const [horror, setHorror] = useState([]);

  useEffect(() => {
    // Carga de datos segura
    async function loadData() {
      try {
        const t = await getTrendingMovies();
        setTrending(t || []);
        const a = await getActionMovies();
        setAction(a || []);
        const h = await getHorrorMovies();
        setHorror(h || []);
      } catch (e) {
        console.error("Error cargando peliculas", e);
      }
    }
    loadData();
  }, []);

  const renderMovie = ({ item }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/movie/${item.id}`)}
      className="mr-3"
    >
      <Image 
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} 
        style={{ width: 120, height: 180, borderRadius: 8 }} 
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView>
        {/* HEADER */}
        <View className="flex-row justify-between items-center px-4 py-2">
          <Text className="text-red-600 text-2xl font-bold">ONYX</Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <LucideSearch color="white" size={24} />
          </TouchableOpacity>
        </View>

        {/* HERO BANNER */}
        {trending[0] && (
          <TouchableOpacity onPress={() => router.push(`/movie/${trending[0].id}`)}>
            <Image 
              source={{ uri: `https://image.tmdb.org/t/p/original${trending[0].backdrop_path}` }} 
              style={{ width: '100%', height: 450 }}
            />
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'rgba(0,0,0,0.5)' }}>
               <Text className="text-white text-3xl font-bold">{trending[0].title}</Text>
               <View className="bg-red-600 px-6 py-2 rounded-md mt-3 self-start">
                 <Text className="text-white font-bold">REPRODUCIR</Text>
               </View>
            </View>
          </TouchableOpacity>
        )}

        {/* LISTAS */}
        <View className="pb-10 pl-4">
          <Text className="text-white text-lg font-bold mt-6 mb-3">Tendencias</Text>
          <FlatList horizontal data={trending} renderItem={renderMovie} showsHorizontalScrollIndicator={false} />

          <Text className="text-white text-lg font-bold mt-6 mb-3">Acción</Text>
          <FlatList horizontal data={action} renderItem={renderMovie} showsHorizontalScrollIndicator={false} />

          <Text className="text-white text-lg font-bold mt-6 mb-3">Terror</Text>
          <FlatList horizontal data={horror} renderItem={renderMovie} showsHorizontalScrollIndicator={false} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
