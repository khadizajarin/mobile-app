import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Alert, ToastAndroid } from 'react-native';
import { initializeApp } from '@firebase/app';
import {app, db, collection, addDoc} from '../Hooks/firebase.config';
import { getAuth, createUserWithEmailAndPassword, signOut } from '@firebase/auth';
import useAuthentication from '../Hooks/useAuthentication';
import { Link, useNavigation } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {

  const { user, auth } = useAuthentication(app);
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleRegistration = async () => {
      try {
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User registered successfully!');
          const user = auth.currentUser;
          const userData = {
              email: user.email,
              displayName: '',
              phoneNumber: '',
              photoURL: '',
              role: 'user'
          };
          await setDoc(doc(db, 'users', user.uid), userData); 
          ToastAndroid.show('Registered successfully', ToastAndroid.SHORT);
          navigation.navigate('Home');
      } catch (error) {
          console.error('Registration error:', error.message);
          Alert.alert(
              'Registration Failed',
              error.message,
              [{ text: 'OK' }],
              { cancelable: false }
          );
    }
  };



  return (
    <View style={styles.container}>
        <Text style={styles.heroTitle}>Join Us Today!</Text>
        <View style={styles.formContainer}>
            {/* Email */}
            <View style={styles.formControl}>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
            />
            </View>
            {/* Password */}
            <View style={styles.formControl}>
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
            />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRegistration}>
            <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.hero}>
            <View style={styles.heroContent}>
            <Text style={styles.heroDescription}>Already have an account?</Text>
            <Text style={styles.heroDescription}>Create an account to access exclusive features.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Home')}>
              <Text style={styles.buttonText}>
                Back to login
              </Text>
            </TouchableOpacity>
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    fontFamily: "serif",
    backgroundColor: '#F1F2F6',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  formControl: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
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
  hero: {
    flex: 1,
    justifyContent: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  heroDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Register;
