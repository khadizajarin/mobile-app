import { StyleSheet, Text, View, Dimensions, Button } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location';
import { ScrollView } from 'react-native';


const LocationScreen = () => {
    const [map, setMap] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });

    const useLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
        }
        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        setMap({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
        fetchWeather(location.coords.latitude, location.coords.longitude);
    }

    useEffect(() => {
        useLocation();
    }, []);

    const scrollToUserLocation = async () => {
        await useLocation();
        mapViewRef.current.animateToRegion({
            latitude: map.latitude,
            longitude: map.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }, 1000);
    }

    const mapViewRef = React.createRef();




    const [weather, setWeather] = useState(null);
    const API_KEY = '68b6d6acd8fbe078d54eecc8971d7b40'
  
    const fetchWeather = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            const data = await response.json();
            console.log(data);
            setWeather(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };
    
    

    return (
        <View style={styles.container}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#AB8C56' }}>
                
            </View>
            <Text style={{ fontFamily: "serif", fontSize: 40, fontWeight: 'bold',  padding:10, paddingBottom:10, color: '#3A3D42', borderBottomWidth: 1, borderBottomColor: '#AB8C56'}}>Let's see where we are located!</Text>
            <MapView
                ref={mapViewRef}
                style={styles.map}
                region={map}>
                <Marker coordinate={map} title='Marker' />
            </MapView>
            {weather && (
            <View style={styles.weatherContainer}>
                <Text style={styles.weatherText}>Weather: {weather.weather[0].main}</Text>
                <Text style={styles.weatherText}>Description: {weather.weather[0].description}</Text>
                <Text style={styles.weatherText}>Temperature: {weather.main.temp}°C</Text>
            </View>
            )}
            <Button title='Get Location' onPress={scrollToUserLocation}></Button>
        </View>
    );
}

export default LocationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '50%',
    },
    weatherContainer: {
        position: 'absolute',
        top: 30,
        left: 20,
        backgroundColor: '#00bfff',
        padding: 20,
        borderRadius: 10,
      },
      weatherText: {
        fontSize: 20,
        color: '#ffffff',
      },
});
