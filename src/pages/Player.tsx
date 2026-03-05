import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Player = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const url = searchParams.get('url');

  if (!url) return <View style={styles.container}><Text style={styles.text}>Error: No URL provided</Text></View>;

  const killAdsScript = "window.open = function() { return null; }; document.querySelectorAll('.ad-container, .popup, #popup').forEach(e => e.remove()); true;";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigate(-1)}
          style={styles.backButton}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
          <Text style={styles.backText}>Cerrar</Text>
        </TouchableOpacity>
      </View>

      {/* Armor-Plated Player */}
      <WebView 
        source={{ uri: url }} 
        style={styles.webview}
        allowsFullscreenVideo={true}
        setSupportMultipleWindows={false}
        javaScriptEnabled={true}
        injectedJavaScript={killAdsScript}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  text: {
    color: 'white',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  }
});
