import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const LocationScreen = () => {
  const [map, setMap] = useState({
    latitude: 23.6933,
    longitude: 90.3818,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapViewRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please enable location services to use this feature.');
        setLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);

        fetchWeather(location.coords.latitude, location.coords.longitude);

        setMap({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        });
      } catch (error) {
        console.error('Error fetching location:', error);
        Alert.alert('Error', 'Failed to fetch location. Please try again later.');
        setLoading(false);
      }
    })();
  }, []);

  const fetchWeather = async (latitude, longitude) => {
    try {
      const API_KEY = '68b6d6acd8fbe078d54eecc8971d7b40';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeather(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather:', error);
      Alert.alert('Error', 'Failed to fetch weather data. Please try again later.');
      setLoading(false);
    }
  };

  const renderPolyline = () => {
    if (userLocation) {
      return (
        <Polyline
          coordinates={[
            { latitude: userLocation.latitude, longitude: userLocation.longitude },
            { latitude: 23.6933, longitude: 90.3818 },
          ]}
          strokeColor="#FF0000"
          strokeWidth={3}
        />
      );
    }
    return null;
  };

  const scrollToUserLocation = async () => {
    if (userLocation && mapViewRef.current) {
      mapViewRef.current.animateToRegion({
        latitude: map.latitude,
        longitude: map.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Let's see where we are located!</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#3A3D42" />
      ) : (
        <>
          <MapView
            ref={mapViewRef}
            style={styles.map}
            region={map}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            <Marker coordinate={{ latitude: 23.6933, longitude: 90.3818 }} title="EvePlano" />
            {renderPolyline()}
          </MapView>
          {weather && (
            <View style={styles.weatherContainer}>
              <Text style={styles.weatherText}>Get to know about the weather {'\n'}of your current location:</Text>
              <Text style={styles.weatherText}>Weather: {weather.weather[0].main}</Text>
              <Text style={styles.weatherText}>Description: {weather.weather[0].description}</Text>
              <Text style={styles.weatherText}>Temperature: {weather.main.temp}°C</Text>
              <Text style={styles.weatherText}>Humidity: {weather.main.humidity}%</Text>
              <Text style={styles.weatherText}>Wind Speed: {weather.wind.speed} m/s</Text>
              <Text style={styles.weatherText}>Pressure: {weather.main.pressure} hPa</Text>
              <Text style={styles.weatherText}>Visibility: {weather.visibility / 1000} km</Text>
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={scrollToUserLocation}>
            <Text style={styles.buttonText}>Get Your Location</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontFamily: 'serif',
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#3A3D42',
    marginBottom: 10,
  },
  map: {
    borderWidth:2,
    borderColor:'#3A3D42',
    borderRadius: 5,
    width: '100%',
    height: '85%',
  },
  weatherContainer: {
    position: 'absolute',
    bottom: 50,
    right: 5,
    backgroundColor: '#3A3D42',
    padding: 10,
    borderRadius: 5,
  },
  weatherText: {
    fontSize: 12,
    color: '#AB8C56',
    marginBottom: 2,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#3A3D42',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#AB8C56',
    fontSize: 16,
    padding: 5,
    fontWeight: 'bold',
  },
});

export default LocationScreen;
