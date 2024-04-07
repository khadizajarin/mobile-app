import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { db, collection, getDocs } from '../Hooks/firebase.config';
import { MaterialIcons } from '@expo/vector-icons';

const Rating = ({ user }) => {
  const [ratings, setRatings] = useState([]);

  // Fetch all ratings from Firestore
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ratingsCollection = collection(db, 'rating');
        const querySnapshot = await getDocs(ratingsCollection);
        const allRatings = querySnapshot.docs.map(doc => doc.data());
        setRatings(allRatings);
        console.log(allRatings);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    fetchRatings();
  }, []);

  const renderStars = (rating) => {
    const filledStars = Math.round(rating.rate);
    const starArray = [];
    for (let i = 1; i <= 5; i++) {
      starArray.push(
        <TouchableOpacity key={i} disabled>
          <MaterialIcons
            name={i <= filledStars ? 'star' : 'star-border'}
            size={24}
            color={'#AB8C56'} 
          />
        </TouchableOpacity>
      );
    }
    return starArray;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Ratings:</Text>
      {ratings.map((rating, index) => (
        <View key={index} style={styles.ratingContainer}>
          <Text>{rating.email}</Text>
          <View style={styles.starsContainer}>{renderStars(rating)}</View>
        </View>
      ))}
    </View>
  );
};

export default Rating;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ratingContainer: {
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
  },
});
