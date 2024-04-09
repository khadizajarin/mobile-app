import { Image, ScrollView, StyleSheet, Text, View,  Button, TouchableOpacity, TextInput, ActivityIndicator, Pressable, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import useAuthentication from './Hooks/useAuthentication';
import { app, db,  addDoc } from "./Hooks/firebase.config"
import { useNavigation } from 'expo-router';
import Video from './video';
import { collection, query, where, updateDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import DateTimePicker from "@react-native-community/datetimepicker";


const Details = () => {
  
  const { user, auth } = useAuthentication(app);
  const route = useRoute(); 
  const navigation = useNavigation();
  const { serviceId } = route.params || {};
  
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchServices = async () => {
    try {
      const servicesQuerySnapshot = await getDocs(collection(db, "services"));
      const servicesData = [];
      servicesQuerySnapshot.forEach((doc) => {
        servicesData.push(doc.data());
      });
      setEvents(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchServices();
  }, []);
  
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [venue, setVenue] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [currentInput, setCurrentInput] = useState(1);

  const [showPicker, setShowPicker] = useState(false);
  const toggleDatePicker= ()=>{
    setShowPicker(!showPicker);
  }
  const onChange =({type}, selectedDate) => {
    if(type == 'set'){
      const currentDate = selectedDate || date;
      setDate(currentDate);
      if (Platform.OS === "android"){
        toggleDatePicker();
        setDate(currentDate.toDateString());
      }
    } else {
      toggleDatePicker();
    }
  }

  const handleNextInput = () => {
    setCurrentInput(currentInput + 1);
  }
  
  const handleBooking = async (event) => {
    try {
      const eventData = {
        user: user.email,
        eventName: event.name,
      };
      const bookingData = {
        numberOfGuests: numberOfGuests,
        venue: venue,
        time: time,
        date: date,
        phoneNumber: phoneNumber,
        specialRequirements: specialRequirements,
      };
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        eventData: eventData,
      });
      console.log('Document written with ID: ', docRef.id);
      setNumberOfGuests("");
      setVenue("");
      setTime("");
      setDate("");
      setPhoneNumber("");
      setSpecialRequirements("");
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
 
  return (
    <ScrollView style={styles.wholeContain}>
      {user ? (
        <View>
          {isLoading ? (
            <ActivityIndicator size="large" color="#3A3D42"  />
          ) : ( 
            <View>
              {events.filter((event) => (event.id === serviceId)).map((event, id) => (
                <View key={id} style={{ paddingTop: 10 }}>
                  <Image source={{ uri: event.image }} style={{  borderRadius: 10, height: 200,  }} />
                  <Text style={{fontFamily: "serif", fontSize: 20, fontWeight: 'bold', marginTop: 4, color: '#3A3D42' }}>{event.name}</Text>
                  <Text style={{fontFamily: "serif", fontSize: 18, fontWeight: 'bold', marginTop: 4, color: '#3A3D42' }}>Approximate Cost: {event.price} (For 50 Guests)</Text>
                  <Text style={{fontFamily: "serif", fontSize: 16, marginBottom: 15, color: '#3A3D42' }}>{event.description}</Text>  

                  <View style={{ borderTopWidth: 1, borderTopColor: '#AB8C56', borderBottomWidth: 1, borderBottomColor: '#AB8C56'}}>
                    <Video></Video>
                  </View>

                  {/* Form for booking */}
                  <View style={{ marginTop: 20 }}>
                    <Text style={{ fontFamily: "serif", fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#3A3D42' }}>Do you want to book? Please submit the infos and our representative will contact you. </Text>

                    {currentInput >= 1 && (
                      <TextInput
                        placeholder="Number of Guests"
                        style={[styles.input, { color: '#3A3D42' }]}
                        value={numberOfGuests}
                        onChangeText={text => setNumberOfGuests(text)}
                        autoFocus={currentInput === 1}
                      />
                    )}
                    {currentInput >= 2 && (
                      <TextInput
                        placeholder="Venue"
                        style={[styles.input, { color: '#3A3D42' }]}
                        value={venue}
                        onChangeText={text=>setVenue(text)}
                        autoFocus={currentInput === 2}
                      />
                    )}
                    {currentInput >= 3 && (
                      <TextInput
                        placeholder="Time"
                        style={[styles.input, { color: '#3A3D42' }]}
                        value={time}
                        onChangeText={text=>setTime(text)}
                        autoFocus={currentInput === 3}
                      />
                    )}
                    {showPicker && (<DateTimePicker mode='date' display='spinner' value={date} onChange={onChange}/>)}
                    {!showPicker && (
                      <Pressable onPress={toggleDatePicker}>
                        <TextInput
                          placeholder="Date"
                          style={[styles.input, { color: '#3A3D42' }]}
                          value={date instanceof Date ? "Date" : date} 
                          onChangeText={text=>setDate(text)}
                          editable={false}
                          autoFocus={currentInput === 4}
                        />
                      </Pressable>
                    )}
                    {currentInput >= 5 && (
                      <TextInput
                        placeholder="Phone Number"
                        style={[styles.input, { color: '#3A3D42' }]}
                        value={phoneNumber}
                        onChangeText={text=>setPhoneNumber(text)}
                        autoFocus={currentInput === 5}
                      />
                    )}
                    {currentInput >= 6 && (
                      <TextInput
                        placeholder="Any Special Requirements"
                        style={[styles.input, { height: 100 },{ color: '#3A3D42' }]}
                        multiline={true}
                        value={specialRequirements}
                        onChangeText={text=>setSpecialRequirements(text)}
                        autoFocus={currentInput === 6}
                      />
                    )}
                    <TouchableOpacity onPress={currentInput >= 6 ? () => handleBooking(event) : handleNextInput} style={styles.button}>
                      <Text style={styles.buttonText}>{currentInput >= 6 ? 'Submit' : 'Next'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}  
            </View>
          )}  
        </View>
      ) : (
        <View style={styles.loginContainer}>
          <Text>Please login to access details.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.button} >
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      )}    
    </ScrollView>
  )
}

export default Details

const styles = StyleSheet.create({
  wholeContain: {
    fontFamily: "serif",
    paddingHorizontal:15
  },
  input: {
    marginBottom:10,
    backgroundColor:'#F1F2F6',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  loginContainer: {
    height: 500,
    flex: 1,
    display: 'flex',
    flexDirection:' column',
    justifyContent:'center',
    alignItems: 'center',
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
})
