import { Link, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,  Alert, ToastAndroid } from 'react-native';
import { app, db, collection, addDoc} from '../Hooks/firebase.config';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,  } from '@firebase/auth';
import useAuthentication from '../Hooks/useAuthentication';


const Login = () => {

  const navigation = useNavigation();
  const { user, auth } = useAuthentication(app);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // console.log('User signed in successfully!');
      ToastAndroid.show('Logged in successfully', ToastAndroid.SHORT);
      navigation.navigate('Home')
    } catch (error) {
      console.error('Login error:', error.message);
      Alert.alert(
        'Login Failed',
        error.message,
        [{ text: 'OK' }],
        { cancelable: false }
    );
    }
  };


  return (
    <View style={styles.container}>
        <Text style={styles.heroTitle}>Login to book your events!</Text>

        <View style={styles.formContainer}>
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
            <View style={styles.formControl}>
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
            />
            </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>

        <View style={styles.hero}>
            <View style={styles.heroContent}>
            <Text style={styles.heroDescription}>Effortlessly log in to know more about our exclusive social event management package.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.buttonText}>
                Do not have an account yet? Please proceed to Register
              </Text>
            </TouchableOpacity>
           
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1, 
    borderTopColor: '#AB8C56',
    fontFamily: "serif",
    backgroundColor: '#F1F2F6',
    color: '#3A3D42',
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
    backgroundColor:'#F1F2F6',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  forgotPassword: {
    color: '#689A7C',
    fontSize: 14,
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
  registerLink: {
    padding: 5,
    flexDirection: 'column'
  },
});

export default Login;
