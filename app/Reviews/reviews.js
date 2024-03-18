import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, ToastAndroid } from 'react-native';
import { app, db } from "../Hooks/firebase.config";
import { collection, updateDoc, doc, getDocs, getDoc } from 'firebase/firestore';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import useAuthentication from '../Hooks/useAuthentication';
import AddReview from './addReview';

const Reviews = () => {
    const { user, auth } = useAuthentication(app);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [showComments, setShowComments] = useState({});
    const [commentTexts, setCommentTexts] = useState({});

    const fetchReviews = async () => {
        try {
            const servicesQuerySnapshot = await getDocs(collection(db, "reviews"));
            const revData = [];
            servicesQuerySnapshot.forEach((doc) => {
                const reviewData = doc.data();
                revData.push({ id: doc.id, ...reviewData });
            });
            setReviews(revData);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleComments = (index) => {
        setShowComments(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const handleComment = async (reviewId, comments, userEmail) => {
        try {
            const reviewDocRef = doc(db, "reviews", reviewId);
            const reviewDocSnapshot = await getDoc(reviewDocRef);
            
            if (reviewDocSnapshot.exists()) {
                const existingData = reviewDocSnapshot.data();
                const updatedData = {
                    ...existingData,
                    comments: comments
                };
                await updateDoc(reviewDocRef, updatedData);
                fetchReviews(); 
                ToastAndroid.show('Your comment was posted', ToastAndroid.SHORT);
            } else {
                console.log("Review document not found");
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handlePostComment = (review, newComment, index) => {
        const updatedReview = {
            ...review,
            comments: [
                ...(review.comments || []),
                { email: user.email, commentText: newComment }
            ]
        };

        handleComment(review.id, updatedReview.comments, user.email);
        setCommentTexts(prevState => ({
            ...prevState,
            [index]: '', // Clear the input field after posting comment
        }));
        fetchReviews(); 
    };

    const handleLike = async (review) => {
        try {
            const reviewDocRef = doc(db, "reviews", review.id);
            const reviewDocSnapshot = await getDoc(reviewDocRef);
            
            if (reviewDocSnapshot.exists()) {
                const existingData = reviewDocSnapshot.data();
                const likedEmail = existingData.likedEmail || [];
                
                if (!likedEmail.includes(user.email)) {
                    const updatedLikedEmail = [...likedEmail, user.email];
                    const updatedData = {
                        ...existingData,
                        likedEmail: updatedLikedEmail
                    };
        
                    await updateDoc(reviewDocRef, updatedData);
                    fetchReviews(); 
                    ToastAndroid.show('You liked this review', ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show('You have already liked this review', ToastAndroid.SHORT);
                }
            } else {
                console.log("Review document not found");
            }
        } catch (error) {
            console.error('Error liking review:', error);
        }
    };
    
    
    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <ScrollView>
            <View>
            {isLoading ? (
            <ActivityIndicator size="large" color="#AB8C56"  />
            ) : (
               <View style={styles.container} >
                <Text style={{ fontFamily: "serif", fontSize: 40, fontWeight: 'bold',color: '#3A3D42' }}>See What Our Clients Say!</Text>
                <Text style={{ fontFamily: "serif", fontSize: 20, marginBottom: 8,color: '#3A3D42' }}>Want to be more confirmed about our services? Let's see what our customers' say about our services, so that we can assure you more!</Text>
                {/* this is for adding reviews */}
                <View style={{borderBottomWidth: 1,  borderBottomColor: '#AB8C56',borderTopWidth: 1, borderTopColor: '#AB8C56' }}>
                    <AddReview></AddReview>
                </View>
                
                  {
                    reviews.map((review, index) => (
                        <View key={index}>
                            <View style={styles.contentContainer}>
                                <Text style={styles.title}>"{review.reviewtext}", </Text>
                                <Text>says {review.email}</Text>

                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 5, marginTop:10 }}>
                                    <TouchableOpacity style={[styles.button, { flex: 0.5 , padding: 8,}]} onPress={() => handleLike(review)} >
                                    <Text style={styles.buttonText}>
                                    {review.likedEmail && review.likedEmail.includes(user.email) ? review.likedEmail.length : ''}
                                        <MaterialCommunityIcons 
                                            name={review.likedEmail && review.likedEmail.includes(user.email) ? "cards-heart" : "cards-heart-outline"} 
                                            size={18} 
                                            color={review.likedEmail && review.likedEmail.includes(user.email) ? "#AB8C56" : "#AB8C56"} />
                                    </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.button, { flex: 0.5, padding: 8, }]} onPress={() => toggleComments(index)} >
                                        <Text style={styles.buttonText}>{review.comments.length > 0 ? review.comments.length : ""} <Fontisto name="comments" size={18} color="#AB8C56" /> </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {showComments[index] && (
                                <View>
                                    {review.comments && review.comments.map((comment, commentIndex) => (
                                        <View key={commentIndex} style={{ marginLeft: 20, marginTop: 10 }}>
                                          <Text>{comment.commentText}</Text>
                                          <Text style={{ fontStyle: 'italic', color: '#AB8C56' }}>Commented by: {comment.email}</Text>
                                        </View>
                                    ))}
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 2, alignItems: 'center', marginBottom: 10,marginTop:10 }}>
                                        <View style={{ flex: 0.8 }}>
                                            <TextInput
                                                placeholder="Want to ask or tell something more?"
                                                value={commentTexts[index] || ''}
                                                onChangeText={text => setCommentTexts(prevState => ({ ...prevState, [index]: text }))}
                                                style={styles.input}
                                            />
                                        </View>
                                        <TouchableOpacity style={[styles.button, { flex: 0.2, padding: 14 }]} onPress={() => handlePostComment(review, commentTexts[index] || '', index)}>
                                            <Text style={styles.buttonText}>Post</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}
            </View>
        </ScrollView>
    );
}

export default Reviews;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 10,
  },
  contentContainer: {
    marginTop:10,
    padding: 10,
    backgroundColor: 'rgba(201, 170, 116, 0.3)',
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

