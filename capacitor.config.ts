import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agri.pwa',
  appName: 'AgriPWA',
  webDir: 'build',          // output della build React
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'app',
  },
  plugins: {
    Camera: {
      // Configurazioni opzionali per la camera
      quality: 90,
      resultType: 'uri',
      saveToGallery: false,
    },
    PushNotifications: {
      // Config base (richiede Firebase Cloud Messaging per Android/iOS)
      presentationOptions: ['badge', 'sound', 'alert']
    }
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    backgroundColor: '#ffffff'
  }
};

export default config;
