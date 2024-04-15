import React, { useState, useEffect } from 'react';
//import { Platform, Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListScreen from './screens/ListScreen';
import OptionsScreen from './screens/OptionsScreen';
import CameraScreen from './screens/CameraScreen';
import { QueryClient, QueryClientProvider } from 'react-query';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from './constants/couleurs'
import axios from 'axios';
import * as Location from 'expo-location';

const Stack = createNativeStackNavigator();

export default function App() {
  const [site, setSite] = useState('SPL');
  const [km, setKm] = useState(null);
  const api = 'https://pod-server-znug.onrender.com'

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  function TabBarIcon({ name, color, onPress }) {  
    return <FontAwesome size={28} style={{ marginBottom: -5, padding: 10, }} name={name} color={color} onPress={onPress} />;
  }

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(`latitude : ${location.coords.latitude} et longitude : ${location.coords.longitude}`)

      try {
        // Utilisez 'await' pour attendre la résolution de la requête axios
        const response = await axios.get(`${api}/getSite?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`);
        
        // Accédez à la propriété 'distance' de l'objet 'response.data'
        setKm(response.data.distance);
        
        console.log(` km=${response.data.distance}`);
      } catch (error) {
        // Gérez les erreurs de la requête ici
        console.error('Erreur lors de la requête axios', error);
      }
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="List" component={ListScreen}
                initialParams={{ site: site, api: api }}
                options={({ navigation }) => ({
                  headerTitle: site,
                  headerStyle: { backgroundColor: 'papayawhip' },
                  headerTitleAlign: "center",
                  headerRight: () => (
                    <TabBarIcon name="gears" color='#2F4F4F'
                      onPress={() => navigation.navigate('Options', { item: null, api: api })}
                    />
                  ),
                  headerLeft: () => (
                    <TabBarIcon name="qrcode" color='#2F4F4F'
                      onPress={() => navigation.navigate('Camera', { site: site, api: api })}
                    />
                  ),
                })}
              />
              <Stack.Screen name="Camera" component={CameraScreen} />
              <Stack.Screen name="Options" component={OptionsScreen} />
            </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}


