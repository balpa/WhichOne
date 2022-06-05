// @author: Berke Altıparmak
//  You may use, distribute and modify this code under the
//  terms of the Beerware license, which unfortunately won't be
//  written for another century.
//  ----------------------------------------------------------------------------
//  "THE BEER-WARE LICENSE" (Revision 42):
//  <berkealtiparmak@outlook.com> wrote this file.  As long as you retain this notice you
//  can do whatever you want with this stuff. If we meet some day, and you think
//  this stuff is worth it, you can buy me a beer in return.   Berke Altıparmak
//  ----------------------------------------------------------------------------

import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useEffect } from 'react';
import { Button } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, Alert, LogBox } from 'react-native';
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from './pages/RegisterScreen';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import SearchPage from './pages/SearchPage';
import UserProfile from './pages/UserProfile';
import AccountSettings from './pages/AccountSettings';
import Create from './pages/Create';
import UploadAvatar from './pages/UploadAvatar';
import DMChatPage from './pages/DMChatPage';
import { Icon } from 'react-native-elements';
import FollowersFollowingPage from './pages/FollowersFollowingPage';
import { TransitionSpecs } from '@react-navigation/stack';



LogBox.ignoreLogs(['Setting a timer for a long period of time']) // to clear the yellow warning on android devices


const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: 'rgba(255,255,255,1)', height: 75 },
  headerTitleStyle: { color: "black" },
  headerTintColor: "black",
  gestureEnabled: true,
  headerShown: true,
  cardStyle: { backgroundColor: 'rgba(255,255,255,1)' },    // to make the background black (transitions, reload etc)

}

const config = {
  animation: 'spring',
  config: {
    stiffness: 900,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};


export default function App() {

  return (

    <NavigationContainer>
     <Stack.Navigator screenOptions={globalScreenOptions} headerMode="screen" >
      <Stack.Screen name="Login" options={{transitionSpec: {open: config, close: config}}} component={LoginScreen} />
      <Stack.Screen name="Register" options={{transitionSpec: {open: config, close: config}}} component={RegisterScreen} />
      <Stack.Screen name="Profile" options={{headerBackTitle: "Home", transitionSpec: { open: config, close: config }}} component={ProfilePage} />
      <Stack.Screen name="Followers & Following" options={{headerBackTitle: "Profile", transitionSpec: {open: config, close: config}}} component={FollowersFollowingPage}/>
      <Stack.Screen name="HomePage" options={{title: "WhichOne", transitionSpec: {open: config, close: config}}} component={HomePage} />
      <Stack.Screen name="Stats" options={{transitionSpec: {open: config, close: config}}} component={StatsPage} />
      <Stack.Screen name="Settings" options={{transitionSpec: {open: config, close: config}}} component={SettingsPage} />
      <Stack.Screen name="About" options={{transitionSpec: {open: config, close: config}}} component={AboutPage} />
      <Stack.Screen name="UserProfile" options={({ route }) => ({ title: route.params.name })} component={UserProfile} />
      <Stack.Screen name="DMChatPage" options={({ route }) => ({ title: route.params.name, headerBackTitle: "Messages" })} component={DMChatPage} />
      <Stack.Screen name="Search" options={{headerBackTitle: "Home", transitionSpec: {open: config, close: config}}} component={SearchPage} />
      <Stack.Screen name="Account" options={{headerBackTitle: "Settings", transitionSpec: {open: config, close: config}}} component={AccountSettings} />
      <Stack.Screen name='Upload Avatar' options={{headerBackTitle: "Account", transitionSpec: {open: config, close: config}}} component={UploadAvatar} />
      <Stack.Screen name="Create" options={{headerBackTitle: "Home", transitionSpec: {open: config, close: config}}} component={Create} />
     </Stack.Navigator>
    </NavigationContainer>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    width: 80,
    borderWidth: 0,
    backgroundColor: "transparent",
},
});

