import React from 'react';
import { ScrollView } from 'react-native';
import LandingLayout1 from './LandingLayout1';
import Upcomings from '../upcomings';
import useAuthentication from '../Hooks/useAuthentication';
import app from '../Hooks/firebase.config';
import Login from './login';

const Home = () => {
  const {user,auth} = useAuthentication(app)
  return (
    <ScrollView>
      <LandingLayout1></LandingLayout1>
      <Upcomings></Upcomings>
      { !user && (<Login></Login>  )}
    </ScrollView>
  );
};

export default Home;
