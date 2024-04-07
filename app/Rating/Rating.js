import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { app, db } from '../Hooks/firebase.config';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, updateDoc, doc, getDocs, onSnapshot, where, addDoc, query } from 'firebase/firestore';
import useAuthentication from '../Hooks/useAuthentication';

const Rating = () => {
  const { user, auth } = useAuthentication(app);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const ratingQuery = query(collection(db, 'rating'), where('email', '==', user.email));
          const querySnapshot = await getDocs(ratingQuery);
          if (querySnapshot.size > 0) {
            setHasRated(true);
          }
        } catch (error) {
          console.error('Error checking user rating:', error);
        }
      };

      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'rating'));
        const allRatings = querySnapshot.docs.map(doc => doc.data().rate);
        setRatings(allRatings);
        const totalRating = allRatings.reduce((acc, curr) => acc + curr, 0);
        const avg = totalRating / allRatings.length || 0;
        setAverageRating(avg);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    fetchData();
  }, []);

  const handleRating = async (rating) => {
    if (user) {
      if (hasRated) {
        Alert.alert(
          'Already Rated',
          'You have already rated the app. Do you want to change your rating?',
          [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: async () => {
                try {
                  const ratingQuery = query(collection(db, 'rating'), where('email', '==', user.email));
                  const ratingSnapshot = await getDocs(ratingQuery);
                  const ratingDoc = ratingSnapshot.docs[0];
                  await updateDoc(doc(db, 'rating', ratingDoc.id), {
                    rate: rating
                  });
                  Alert.alert('Rating Updated', 'Your rating has been updated successfully.');
                  const updatedRatings = ratings.map(rate => rate === ratingDoc.data().rate ? rating : rate);
                  setRatings(updatedRatings);
                  const totalRating = updatedRatings.reduce((acc, curr) => acc + curr, 0);
                  const avg = totalRating / updatedRatings.length || 0;
                  setAverageRating(avg);
                } catch (error) {
                  console.error('Error updating rating:', error);
                }
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        try {
          await addDoc(collection(db, 'rating'), {
            email: user.email,
            rate: rating
          });
          setHasRated(true);
          const updatedRatings = [...ratings, rating];
          setRatings(updatedRatings);
          const totalRating = updatedRatings.reduce((acc, curr) => acc + curr, 0);
          const avg = totalRating / updatedRatings.length || 0;
          setAverageRating(avg);
        } catch (error) {
          console.error('Error adding rating:', error);
        }
      }
    }
  };

  const renderStars = () => {
    const filledStars = Math.floor(averageRating);
    const partialStar = averageRating - filledStars;
    const starArray = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= filledStars) {
        starArray.push(
          <TouchableOpacity key={i} onPress={() => handleRating(i)}>
            <MaterialIcons name={'star'} size={50} color={'#AB8C56'} />
          </TouchableOpacity>
        );
      } else if (i === filledStars + 1 && partialStar !== 0) {
        starArray.push(
          <TouchableOpacity key={i} onPress={() => handleRating(i)}>
            <MaterialIcons name={'star-half'} size={50} color={'#AB8C56'} />
          </TouchableOpacity>
        );
      } else {
        starArray.push(
          <TouchableOpacity key={i} onPress={() => handleRating(i)}>
            <MaterialIcons name={'star-border'} size={50} color={'#AB8C56'} />
          </TouchableOpacity>
        );
      }
    }
    return starArray;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Average Rating:</Text>
      <View style={styles.starsContainer}>{renderStars()}</View>
      <Text style={styles.ratingCount}>Total Ratings: {ratings.length}</Text>
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
  starsContainer: {
    flexDirection: 'row',
  },
  ratingCount: {
    marginTop: 10,
    fontSize: 16,
  },
});
