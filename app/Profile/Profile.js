import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, TextInput, Modal, ActivityIndicator, ToastAndroid, ScrollView} from 'react-native';
import useAuthentication from '../Hooks/useAuthentication';
import { signOut } from '@firebase/auth';
import { useNavigation } from 'expo-router/build';
import * as ImagePicker from 'expo-image-picker';
import { app, db } from "../Hooks/firebase.config";
import { collection, query, where, updateDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Bookings from './Bookings';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

const getUserDataFromStorage = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user data from AsyncStorage:', error);
    return null;
  }
};
const saveUserDataToStorage = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data to AsyncStorage:', error);
  }
};


const countries = [
  { label: 'Bangladesh', value: 'bangladesh' },
  { label: 'Spain', value: 'spain' },
  { label: 'Australia', value: 'australia' },
];

const divisionsByCountry = {
  bangladesh: [
    { label: 'Dhaka', value: 'dhaka' },
    { label: 'Narsingdi', value: 'narsingdi' },
    { label: 'Chattogram', value: 'chattogram' },
  ],
  spain: [
    { label: 'Bercelona', value: 'barcelona' },
    { label: 'Madrid', value: 'madrid' },
    { label: 'Valencia', value: 'valencia' },
  ],
  australia: [
    { label: 'Queensland', value: 'queensland' },
    { label: 'Victoria', value: 'victoria' },
    { label: 'Tasmania', value: 'tasmania' },
  ],
};

const citiesByDivision = {
  dhaka: [
    { label: 'Farmgate', value: 'farmgate' },
    { label: 'Shahbagh', value: 'Shahbagh' },
  ],
  narsingdi: [
    { label: 'Raipura', value: 'raipura' },
    { label: 'Satirpara', value: 'satirpara' },
  ],
  chattogram: [
    { label: 'Andorkilla', value: 'andorkilla' },
    { label: 'Zobra', value: 'zobra' },
  ],
  barcelona: [
    { label: 'Gracia', value: 'gracia' },
    { label: 'Sant Marti', value: 'santmarti' },
  ],
  madrid: [
    { label: 'Aranjuez', value: 'aranjuez' },
    { label: 'Rascafria', value: 'rascafria' },
  ],
  valencia: [
    { label: 'Castellón', value: 'castellón' },
    { label: 'Alicante', value: 'alicante' },
  ],
  queensland: [
    { label: 'Brisbane', value: 'Brisbane' },
    { label: 'Gold Coast', value: 'goldcoast' },
  ],
  victoria: [
    { label: 'Melbourne,', value: 'melbourne,' },
    { label: 'Ballarat', value: 'ballarat' },
  ],
  tasmania: [
    { label: 'Hobart', value: 'hobart' },
    { label: 'West Coast', value: 'westcoast' },
  ],
};

const Profile = () => {
  const navigation = useNavigation();
  const { user, auth } = useAuthentication(app);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedCities, setSelectedCities] = useState(null);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedDivision(null);
    setSelectedCities(null);
  };

  const handleDivisionChange = (division) => {
    setSelectedDivision(division);
    setSelectedCities(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const userQuery = query(collection(db, "users"), where("email", "==", user.email));
          const querySnapshot = await getDocs(userQuery);
          
          if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
              console.log('Document data:', doc.data());
              setUserData(doc.data());
              saveUserDataToStorage(doc.data());
            });
          } else {
            console.log('No documents found for user with uid:', user.email);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const retrieveUserData = async () => {
      try {
        const userData = await getUserDataFromStorage();
        if (userData) {
          setUserData(userData);
          setIsLoading(false); 
          // console.log('UserData set after retrieval:', userData);
        } else {
          fetchData(); 
        }
      } catch (error) {
        // console.error('Error retrieving user data from AsyncStorage:', error);
        fetchData(); 
      }
    };
    retrieveUserData(); 
  }, [user]);
  
  
  const handleLogOut = async () => {
    try {
      await signOut(auth);
      // Remove AsyncStorage data
      await AsyncStorage.clear();
      navigation.navigate('Home');
      ToastAndroid.show('Logged out', ToastAndroid.SHORT);
      // console.log('User logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      if (result.assets ) {
        const imageUri = result.assets[0].uri;
        setPhotoURL(imageUri);
        console.log("phooturl : ", photoURL);
      }
    }
  };
  

  const handleUpdateProfile = async () => {
    try {
        if (userData && userData.email) {
            const updatedDoc = {
                displayName: displayName || userData.displayName,
                phoneNumber: phoneNumber || userData.phoneNumber,
                photoURL: photoURL || userData.photoURL,
                Country : selectedCountry || userData.selectedCountry,
                Devision : selectedDivision || userData.selectedDivision,
                City : selectedCities || userData.selectedCities
            };
            // console.log("Updating profile for user:", userData.email);
            // console.log("Updated document:", updatedDoc);

            const userRef = doc(db, "users", user.uid); // Reference the document using user.uid
            const docSnapshot = await getDoc(userRef);

            if (docSnapshot.exists()) {
                await updateDoc(userRef, updatedDoc);
                console.log("Profile updated successfully!");

                // Update AsyncStorage
                await updateAsyncStorage(updatedDoc);
                setShowUpdateForm(false);
                // Fetch updated data from the database and update state
                const updatedUserQuery = query(collection(db, "users"), where("email", "==", user.email));
                const updatedQuerySnapshot = await getDocs(updatedUserQuery);
                
                if (!updatedQuerySnapshot.empty) {
                    updatedQuerySnapshot.forEach(doc => {
                        // console.log('Document data:', doc.data());
                        setUserData(doc.data());
                        saveUserDataToStorage(doc.data());
                        // console.log('UserData set after fetching:', userData);
                        ToastAndroid.show('Your profile is updated', ToastAndroid.SHORT);
                    });
                } else {
                    console.log('No documents found for user with uid:', user.email);
                }
            } else {
                console.error("Document does not exist:", userData.uid);
            }
        } else {
            console.error("User data is not available.");
        }
    } catch (error) {
        console.error("Error updating profile: ", error);
    }
};


const updateAsyncStorage = async (updatedData) => {
    try {
        const existingUserData = await AsyncStorage.getItem('userData');
        let userDataToUpdate = JSON.parse(existingUserData);

        userDataToUpdate = {
            ...userDataToUpdate,
            ...updatedData
        };

        await AsyncStorage.setItem('userData', JSON.stringify(userDataToUpdate));
        console.log("AsyncStorage updated successfully!");
    } catch (error) {
        console.error("Error updating AsyncStorage: ", error);
    }
};


  return (
    <View >
      {isLoading ? (
        <ActivityIndicator size="large" color="#689A7C"  />
      ) : (
        <View style= {styles.container} >
          <View>
          <View style={styles.image}>
            {userData ? (
              <Image source={{ uri: userData.photoURL }} style={{ width: 180, height: 180, borderRadius: 90 }} />
              ) : (
              <Text><AntDesign name="user" size={175} color="gray" style={{ alignSelf: 'center', marginTop: 10 }} /></Text>
              )}
          </View>
          <View>
              {
                userData ? ( <Text style={{ fontFamily: 'serif', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Name : {userData.displayName}</Text>) : 
                (<Text style={{ fontFamily: 'serif', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Name : </Text>)
              }
          </View>
          <View>
              {
                userData ? ( <Text style={{ fontFamily: 'serif', fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Email : {userData.email} </Text>) : 
                (<Text style={{ fontFamily: 'serif', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Email : </Text>)
              }
          </View>
          <View>
              {
                userData ? ( <Text style={{ fontFamily: 'serif', fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Phone Number : {userData.phoneNumber}</Text>) : 
                (<Text style={{ fontFamily: 'serif', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Phone Number : </Text>)
              }
          </View>
          <View>
              {
                userData ? ( <Text style={{ fontFamily: 'serif', fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Country : {userData.Country}</Text>) : 
                (<Text style={{ fontFamily: 'serif', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Country : </Text>)
              }
          </View>
          <View>
              {
                userData ? ( <Text style={{ fontFamily: 'serif', fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Devision : {userData.Devision}</Text>) : 
                (<Text style={{ fontFamily: 'serif', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Devision : </Text>)
              }
          </View>
          <View>
              {
                userData ? ( <Text style={{ fontFamily: 'serif', fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>City : {userData.City}</Text>) : 
                (<Text style={{ fontFamily: 'serif', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>City : </Text>)
              }
          </View>
          <View style={{ marginVertical:10, width:'auto',display:'flex', flexDirection:'row', gap:2}}>
              <TouchableOpacity style={styles.button} onPress={() => setShowUpdateForm(true)}>
                <Text style={styles.buttonText}>Update Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={handleLogOut}>
                <Text style={styles.buttonText}>LogOut</Text>
              </TouchableOpacity>
          </View>
          </View>

          {/* user will see their bookings */}
          <View>
            <Bookings></Bookings>
          </View>
        </View>
      )}

      {/* update form as modal */}
      {userData && 
      <Modal visible={showUpdateForm} transparent={true} animationType="slide">
        <ScrollView style={styles.modalContainer}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10,color: '#3A3D42' }}>Update Profile</Text>

          <View style={{width:"100%",borderColor:'gray',borderWidth:1, borderRadius:5, padding:20, marginBottom:10,color: '#3A3D42'}}>
            <View style={styles.formControl}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                defaultValue={userData.email}
                editable={false}
              />
            </View>
            <View style={styles.formControl}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Display Name"
                // value={displayName}
                defaultValue={userData.displayName}
                onChangeText={text => setDisplayName(text)}
              />
            </View>
            <View style={styles.formControl}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                // value={phoneNumber}
                defaultValue={userData.phoneNumber}
                onChangeText={text => setPhoneNumber(text)}
              />
            </View>
            <View style={styles.formControl}>
                <Text style={styles.label}>Photo</Text>
                <View style={{ display:'flex', flexDirection: 'row',gap:2, justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{ flex: 0.8 }}>
                    <TextInput
                      style={[styles.input,  { height: 60 }]} 
                      placeholder="Photo URL"
                      // value={photoURL}
                      defaultValue={userData.photoURL}
                      onChangeText={ text => setPhotoURL(text)}
                    />
                  </View>
                  <TouchableOpacity style={[styles.button, { flex: 0.2,padding:10 }]} onPress={pickImage}>
                    <Text style={styles.buttonText}>Change Photo</Text>
                  </TouchableOpacity>
                </View>
            </View>
            <View>
              <View style={styles.formControl}>
                <Text style={styles.label}>Country</Text>
                <RNPickerSelect
                  style={styles.input}
                  value={selectedCountry}
                  defaultValue={userData.Country}
                  onValueChange={handleCountryChange}
                  items={countries}
                />
              </View>
              {selectedCountry && (
                <View style={styles.formControl}>
                  <Text style={styles.label}>Division</Text>
                  <RNPickerSelect
                    style={styles.input}
                    value={selectedDivision}
                    defaultValue={userData.Devision}
                    onValueChange={handleDivisionChange}
                    items={divisionsByCountry[selectedCountry]}
                  />
                </View>
              )}
              {selectedDivision && (
                <View style={styles.formControl}>
                  <Text style={styles.label}>Cities</Text>
                  <RNPickerSelect
                    style={styles.input}
                    value={selectedCities}
                    defaultValue={userData.City}
                    onValueChange={(city) => setSelectedCities(city)}
                    items={citiesByDivision[selectedDivision]}
                  />
                </View>
              )}
              <Text style={styles.label}>
                Address: 
                {selectedCountry && `Country: ${selectedCountry}, `}
                {selectedDivision && `Division: ${selectedDivision}, `}
                {selectedCities && `City: ${selectedCities}`}
              </Text>
            </View>
          </View>
          <View style={{display:'flex', flexDirection:'row', gap:2}}>
            <TouchableOpacity style={[styles.button,{flex:0.5}]} onPress={()=> handleUpdateProfile( )}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,{flex:0.5}]} onPress={() => setShowUpdateForm(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '50%',
    backgroundColor: '#F1F2F6',
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
  input: {
    backgroundColor:'#F1F2F6',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth:10,
    borderColor: 'gray'
  },
  modalContainer: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    width: '100%',
  },
  formControl: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
});
