import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import { app, db,  addDoc } from "../Hooks/firebase.config"
import { collection, query, where, updateDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import useAuthentication from '../Hooks/useAuthentication';


const AddReview = () => {

    const { user, auth } = useAuthentication(app);
    const [reviewText, setReviewText] = useState(''); 

    const handleAddReviews = async() => {
      try {
          const currentDate = new Date(); // Get current date and time
          // const formattedDate = currentDate.toLocaleString(); // Convert to human-readable format
          const newReview = { 
            comments: [],
            email: user.email,
            reviewtext: reviewText,
            likedEmail: [],
            dislikedEmail : [],
            createdAt: currentDate // Include posting time and date
          };
          console.log(newReview);
          const docRef = await addDoc(collection(db, 'reviews'), newReview);
          // console.log('Document written with ID: ', docRef.id);
          setReviewText(''); 
          ToastAndroid.show('Your review was posted! Thanks for staying with us!', ToastAndroid.SHORT);
      } catch (e) {
          console.error('Error adding document: ', e);
      }
  };
    return (
        <View style={{ marginTop: 10 }}>
            <Text style={{ fontFamily: "serif", fontSize: 15 }}>Feel free to give any suggestions or complaints! We will heartily try to solve it!</Text>
            <View style={{ height:100, display:'flex', flexDirection: 'row', justifyContent: 'center', gap:2 , alignItems: 'center', marginBottom: 10, }}>
              <View style={{ flex: 0.8 }}>
                <TextInput
                  style={[styles.input,  { height: 71 }]} 
                  placeholder="Write your suggestions or complaints"
                  value={reviewText}
                  multiline={true}
                  onChangeText={text => setReviewText(text)}
                />
              </View>
              <TouchableOpacity onPress={handleAddReviews} style={[styles.button, { flex: 0.2 }]}>
                <Text style={styles.buttonText}>Post a review!</Text>
              </TouchableOpacity>
            </View> 
        </View>
    );
};

export default AddReview;

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#F1F2F6",
      padding: 20,
      marginBottom: 10,
    },
    contentContainer: {
      marginTop:10,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
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
    input: {
      // marginBottom:10,
      backgroundColor:'#F1F2F6',
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
    },
  });
