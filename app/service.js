import { useNavigation} from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'; 


const Service = ({ service }) => {
  const { id, name, image, description } = service;
  const navigation = useNavigation();
  // console.log("eta konta ta jani na",service);
  // console.log("eta service function e",navigation);

  // const handleDetails = () => {
  //   navigation.navigate('details', { serviceId: id });
  // };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={{marginVertical: 10}}>{description}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Details",{ serviceId: id })}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Service;


const styles = StyleSheet.create({
  container: {
    color: '#3A3D42',
    backgroundColor: 'rgba(201, 170, 116, 0.3)',
    borderRadius:10,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    height: 200,
    borderRadius: 10,
  },
  contentContainer: {
    // padding: 10,
  },
  title: {
    marginTop:10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
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



