import { Image, ScrollView, StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Service from './service';
import { db } from "./Hooks/firebase.config";
import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';

const PAGE_SIZE = 3; // Number of items to fetch per page

const Services = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [hasMore, setHasMore] = useState(true); // to track if there are more documents to load

  const fetchServices = async (page) => {
    try {
      let servicesQuery = query(
        collection(db, "services"),
        orderBy('name'),
        limit(PAGE_SIZE),
      );

      if (page > 1) {
        const lastVisibleService = events[events.length - 1];
        servicesQuery = query(
          collection(db, "services"),
          orderBy('name'),
          startAfter(lastVisibleService.name),
          limit(PAGE_SIZE)
        );
      }

      const servicesQuerySnapshot = await getDocs(servicesQuery);

      const servicesData = [];
      servicesQuerySnapshot.forEach((doc) => {
        servicesData.push(doc.data());
      });

      setEvents(servicesData);

      // Check if there are more documents to load
      if (servicesData.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const getTotalPages = async () => {
      try {
        const totalServicesSnapshot = await getDocs(collection(db, "services"));
        const totalServicesCount = totalServicesSnapshot.size;
        const pages = Math.ceil(totalServicesCount / PAGE_SIZE);
        setTotalPages(pages);
      } catch (error) {
        console.error('Error fetching total pages:', error);
      }
    };

    getTotalPages();
  }, []);

  const loadPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <ScrollView>
      {isLoading && events.length === 0 ? (
        <ActivityIndicator size="large" color="#AB8C56" />
      ) : (
        <View style={{backgroundColor: "#ffffff", paddingRight: 20, paddingLeft:20, paddingBottom:5 }}>
          <Text  style={{fontFamily: "serif", fontSize: 40, fontWeight: 'bold',color: '#3A3D42', }}>Explore Our Events!</Text>
          <Text style={{fontFamily: "serif", fontSize: 20, marginBottom: 8, color: '#3A3D42' }}>Explore a variety of event management sectors to find your perfect fit. From weddings radiating eternal love to lively birthday bashes and corporate excellence summits, we have it all. Dive into DIY workshops and unleash your creativity. Discover unforgettable experiences with us today.</Text>

          <View style={styles.buttonContainer}>
            {Array.from({ length: totalPages }, (_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  currentPage === index + 1 && styles.activeButton
                ]}
                onPress={() => loadPage(index + 1)}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.buttonText,
                    currentPage === index + 1 && styles.activeButtonText
                  ]}
                >
                  Page {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>


          {events.map((event, id) => (
            <View key={id} style={{ marginBottom: 10 }}>
              <Service service={event}></Service>
            </View>
          ))}
          
        </View>
      )}
    </ScrollView>
  );
}

export default Services;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3A3D42',
    fontSize:20,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    color: '#AB8C56',
    fontSize: 16,
    fontWeight: 'bold',
    margin: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    paddingBottom:5
  },
  activeButton: {
    backgroundColor: '#AB8C56',
    color: '#3A3D42'
  },
  buttonText: {
    color: '#AB8C56',
  },
  activeButtonText: {
    color: '#3A3D42',
  },
});
