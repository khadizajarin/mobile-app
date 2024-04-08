import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Modal,
  Text,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  getModel,
  convertBase64ToTensor,
  startPrediction,
} from './helpers/tensor-helpers';
import {cropPicture} from './helpers/image-helpers';

import {Camera} from 'expo-camera';

const RESULT_MAPPING = ["Light","Stage","FlowerGate"];

const Main = () => {
  const cameraRef = useRef();
  const [isProcessing, setIsProcessing] = useState(false);
  const [presentedShape, setPresentedShape] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false); 

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleImageCapture = async () => {
    setIsProcessing(true);
    // console.log("image captured")
    const imageData = await cameraRef.current.takePictureAsync({
      base64: true,
    });
    // console.log("Image Data", imageData);
    processImagePrediction(imageData);
  };

  const processImagePrediction = async (base64Image) => {
    const croppedData = await cropPicture(base64Image, 300);
    const model = await getModel();
    const tensor = await convertBase64ToTensor(croppedData.base64);

    const prediction = await startPrediction(model, tensor);
    // console.log(prediction);
    const highestPrediction = prediction.indexOf(
      Math.max.apply(null, prediction),
    );
    setPresentedShape(RESULT_MAPPING[highestPrediction]);
    setIsProcessing(false);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!showCamera ? ( 
        <View>
          <Text style={{ fontFamily: "serif", fontSize: 30, fontWeight: 'bold',color: '#3A3D42'}}>Detect night light, stage or flowergate from your events! Just Play! </Text>
          <TouchableOpacity
          style={styles.button}
          onPress={() => setShowCamera(true)}
        >
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
        </View>
      ) : (
        <React.Fragment>
          <Camera
            ref={cameraRef}
            style={styles.camera}
          />
          <TouchableOpacity
            onPress={handleCloseCamera}
            style={[styles.button,{position: 'absolute',top: 20,right: 20,}]}
          >
          <Text style={styles.buttonText}>Close Camera </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleImageCapture()}
            style={[styles.button, {position:'absolute',left: Dimensions.get('screen').width / 2 - 50,bottom: 40,zIndex: 100,borderRadius:50}]}
          ><MaterialIcons name="camera" size={24} color="#AB8C56" /></TouchableOpacity>
        </React.Fragment>
      )}

      <Modal visible={isProcessing} transparent={true} animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text>Your current object is {presentedShape}</Text>
            {presentedShape === '' && <ActivityIndicator size="large" color="#AB8C56"/>}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setPresentedShape('');
                setIsProcessing(false);
              }}>
              <Text style={styles.buttonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height:'100%'
  },
  modal: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
    borderRadius: 24,
    backgroundColor: '#F1F2F6',
  },
  button: {
    marginTop:10,
    backgroundColor: '#3A3D42',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#AB8C56',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Main;