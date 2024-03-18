import { Image, ScrollView, StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Service from './service';
import { db } from "./Hooks/firebase.config";
import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import {gsap, Back} from 'gsap-rn';

const PAGE_SIZE = 5; // Number of items to fetch per page

const Services = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // to track if there are more documents to load
  // gsap.to(this.ref, {duration:3, style:{right:0, left:50}, transform:{rotate:0,scale:1}, 	ease:Back.easeInOut});
  
  const fetchServices = async () => {
    try {
      let servicesQuery = query(
        collection(db, "services"),
        orderBy('name'),
        limit(PAGE_SIZE)
      );
  
      if (currentPage > 1 && events.length > 0) {
        const lastEventName = events[events.length - 1].name;
        servicesQuery = query(
          collection(db, "services"),
          orderBy('name'),
          limit(PAGE_SIZE),
          startAfter(lastEventName)
        );
      }
  
      const servicesQuerySnapshot = await getDocs(servicesQuery);
  
      const servicesData = [];
      servicesQuerySnapshot.forEach((doc) => {
        servicesData.push(doc.data());
      });
  
      setEvents(prevEvents => [...prevEvents, ...servicesData]);
  
      // Check if there are more documents to load
      if (servicesData.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchServices();
  }, [currentPage]); // Fetch data when currentPage changes

  const loadMore = () => {
    setCurrentPage(currentPage + 1); // Increment page to load next page
  };

  return (
    <ScrollView>
      {isLoading && events.length === 0 ? (
        <ActivityIndicator size="large" color="#AB8C56" />
      ) : (
        <View style={{backgroundColor: "#ffffff", padding: 20 }}>
          <Text   style={{fontFamily: "serif", fontSize: 40, fontWeight: 'bold',color: '#3A3D42', }}>Explore Our Events!</Text>
          <Text style={{fontFamily: "serif", fontSize: 20, marginBottom: 8, color: '#3A3D42' }}>Explore a variety of event management sectors to find your perfect fit. From weddings radiating eternal love to lively birthday bashes and corporate excellence summits, we have it all. Dive into DIY workshops and unleash your creativity. Discover unforgettable experiences with us today.</Text>
          {events.map((event, id) => (
            <View key={id} style={{ marginBottom: 10 }}>
              <Service service={event}></Service>
            </View>
          ))}
          {hasMore && (
            <TouchableOpacity style={styles.button} title="Load More" onPress={loadMore} disabled={isLoading} >See More...</TouchableOpacity>
          )}
          {!hasMore && (
            <Text style={{ fontSize: 16, marginTop: 10,textAlign:'center' }}>No more events to load</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

export default Services;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3A3D42',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    color: '#AB8C56',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});
