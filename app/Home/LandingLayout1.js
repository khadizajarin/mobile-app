import { useNavigation } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { View, Text,  ScrollView,TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import 'tailwindcss/tailwind.css';
import useAuthentication from '../Hooks/useAuthentication';
import app from '../Hooks/firebase.config';
import { signOut } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {gsap, Back,Power2} from 'gsap-rn';

const LandingLayout1 = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const timeline = gsap.timeline();
      timeline.set(ref, {style:{backgroundColor:"#F00"}});
      timeline.to(ref, {duration:1, style:{backgroundColor:"#F0F"}, ease:Power2.easeInOut});
    }
  }, []);

  // gsap.to(this.ref, {duration:3, style:{right:0, left:50}, transform:{rotate:0,scale:1}, 	ease:Back.easeInOut});
  
  const { user, auth } = useAuthentication(app);
  const navigation = useNavigation();

  const handleLogOut = async () => {
    if (user) {
      try {
        await signOut(auth);
        // Remove AsyncStorage data
        await AsyncStorage.clear();
        navigation.navigate('Home');
        console.log('User logged out successfully!');
        ToastAndroid.show('Logged out', ToastAndroid.SHORT);
      } catch (error) {
        console.error('Logout error:', error.message);
      }
    }
  };
  
  return (
    <ScrollView>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F1F2F6", borderBottomWidth: 1, borderBottomColor: '#AB8C56', }}>
        {user ? (
          <View style={{ padding: 10 }}>
            <Text ref={ref}  style={{ fontFamily: "serif", fontSize: 31, fontWeight: 'bold', color: '#3A3D42', marginBottom: 10 }}>
              Welcome to {"\n"}EvePlano, {user.email ? user.email.split('@')[0] : user.displayName}!
            </Text>
            <Text style={{ fontFamily: "serif", fontSize: 18, color: '#3A3D42' }}>EvePlano is your one-stop platform for planning and managing social events with ease. Whether you are organizing a birthday party, wedding, corporate gathering, or any other social occasion, EvePlano simplifies the entire process.</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogOut}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ padding: 10 }} >
            <Text ref={ref} style={{ fontFamily: "serif", fontSize: 31, fontWeight: 'bold', color: '#3A3D42', marginBottom: 10 }}>Welcome to {"\n"}EvePlano !</Text>
            <Text style={{ fontFamily: "serif", fontSize: 18, color: '#3A3D42' }}>EvePlano is your one-stop platform for planning and managing social events with ease. Whether you are organizing a birthday party, wedding, corporate gathering, or any other social occasion, EvePlano simplifies the entire process.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
};

export default LandingLayout1;

const styles = StyleSheet.create({
  logContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#3A3D42',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#AB8C56',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
