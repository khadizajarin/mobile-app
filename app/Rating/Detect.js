// App.js
import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Modal, Text, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { getModel, convertBase64ToTensor, startPrediction } from './helpers/tensor-helpers';
import { cropPicture } from './helpers/image-helpers';

const RESULT_MAPPING = ["Light", "Stage", "FlowerGate"];

const Detect = () => {
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowCamera(true)}
        >
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
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
            <Text style={styles.buttonText}>Close Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleImageCapture()}
            style={styles.captureButton}
          ></TouchableOpacity>
        </React.Fragment>
      )}

      <Modal visible={isProcessing} transparent={true} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text>Your current shape is {presentedShape}</Text>
            {presentedShape === '' && <ActivityIndicator size="large" />}
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
  },
  captureButton: {
    position: 'absolute',
    left: Dimensions.get('screen').width / 2 - 50,
    bottom: 40,
    width: 100,
    zIndex: 100,
    height: 100,
    backgroundColor: 'black',
    borderRadius: 50,
  },
  // closeCameraButton: {
  //   position: 'absolute',
  //   top: 40,
  //   right: 20,
  //   backgroundColor: 'red',
  //   padding: 10,
  //   borderRadius: 8,
  // },
  // closeCameraButtonText: {
  //   color: 'white',
  //   fontSize: 16,
  // },
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
  // dismissButton: {
  //   width: 150,
  //   height: 50,
  //   marginTop: 60,
    
  //   color: 'white',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: 'red',
  // },
  button: {
    // marginTop:10,
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

export default Detect;
