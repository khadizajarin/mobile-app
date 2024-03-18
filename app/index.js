import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home/Home';
import Contact from './Contact';
import Services from './Services';
import useAuthentication from './Hooks/useAuthentication';
import Reviews from './Reviews/reviews';
import Details from './Details';
import app from './Hooks/firebase.config';
import Profile from './Profile/Profile';
import LocationScreen from './Location';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Register from './Home/register';



const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});



const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const ServicesStack = createStackNavigator();

const ServicesStackScreen = () => (
  <ServicesStack.Navigator>
    <ServicesStack.Screen name="Services" component={Services}  options={{ headerShown: false }}/>
    <ServicesStack.Screen name="Details" component={Details}  options={{ headerShown: true }}/>
    <ServicesStack.Screen name="Register" component={Register}  options={{ headerShown: true }}/>
  </ServicesStack.Navigator>
);

const Layout = () => {
    const { user, auth } = useAuthentication(app);

    return (
        <NavigationContainer independent={true} screenOptions={{ headerShown: false }}>
            <Drawer.Navigator
               screenOptions={{
                drawerActiveTintColor:"#AB8C56",
                drawerInactiveTintColor:"#AB8C56",
                drawerLabelStyle: {
                    fontWeight: 'bold',
                    fontFamily: 'serif',
                },
                color: '#AB8C56',
                drawerType: 'slide',
                headerStyle: { backgroundColor: '#3A3D42', height: 80 },
                headerTintColor: '#AB8C56',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontFamily: 'serif',
                },
                drawerStyle: {
                    backgroundColor: '#3A3D42',
                    width: 240,
                    paddingTop: 50,
                },
            }}>
                <Drawer.Screen name="Home" component={Home} />
                <Drawer.Screen name="Services" component={ServicesStackScreen} />
                <Drawer.Screen name="Contact" component={Contact} />
                {/* <Drawer.Screen name="Rating" component={Rating} /> */}
                {user && (
                    <>
                        <Drawer.Screen name="Reviews" component={Reviews} />
                        <Drawer.Screen name="Location" component={LocationScreen} />
                        <Drawer.Screen name="Profile" component={Profile} />
                    </>
                )}
                {!user && (
                    <>
                        <Drawer.Screen name="Register" component={Register} />
                    </>
                )}
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

const Index = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Layout" component={Layout}  options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default Index;
