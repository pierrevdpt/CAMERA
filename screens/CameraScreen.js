import { Camera } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; 
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function CameraScreen({ navigation }) {
  const route = useRoute();
  const { site, api } = route.params;

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation((data) => setStatus(data), {
    onSuccess: () => {
        queryClient.invalidateQueries('posts');
    },
  });

  const setStatus = async (qrcode) => {
    console.log(`CameraScreen - setStatus(${qrcode}) - api=${api}`)

    const { data } = await axios.get(`${api}/setStatus?qrcode=${qrcode}&status=SCANNED`);
    
    setTimeout(() => {
      setScanned(false);
    }, 2000);
    
    return data;
  };

  const handleBarCodeScanned = ({ type, data }) => {
    console.log(`CameraScreen.js - handleBarCodeScanned(data=${data}) `)
    setScanned(true)
    mutation.mutate(data);
  };
  
  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        key={scanned ? 'scanned' : 'not-scanned'}
        style={styles.camera}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && 
        <View style={styles.scanContainer}>
          <Text style={styles.scanOKText}>Scan OK</Text>
        </View> }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  scanContainer: {
    backgroundColor: 'green', // Couleur de fond du bouton
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 50,
    borderRadius: 8, // Bordure arrondie
    alignItems: 'center',
  },
  scanOKText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
