import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { UserProvider } from '../src/context/UserContext';

// Si el UserContext no existe aún, usaremos un Fragmento vacío para que no falle
const Provider = UserProvider || (({ children }) => <View style={{ flex: 1 }}>{children}</View>);

export default function Layout() {
  return (
    <Provider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000000' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="search" />
        <Stack.Screen name="movie/[id]" />
        <Stack.Screen name="player/webview" options={{ presentation: 'fullScreenModal' }} />
      </Stack>
    </Provider>
  );
}
