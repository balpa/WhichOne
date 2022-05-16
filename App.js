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
import HomeScreen from "./pages/HomeScreen";
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import SearchPage from './pages/SearchPage';
import AccountSettings from './pages/AccountSettings';
import Create from './pages/Create';
import UploadAvatar from './pages/UploadAvatar';
import { Icon } from 'react-native-elements';
import FollowersFollowingPage from './pages/FollowersFollowingPage';
import { TransitionSpecs } from '@react-navigation/stack';



LogBox.ignoreLogs(['Setting a timer for a long period of time']) // to clear the yellow warning on android devices


const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: 'rgba(15,15,15,1)', height: 75 },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
  gestureEnabled: true,
  headerShown: true,

}

const config = {
  animation: 'spring',
  config: {
    stiffness: 300,
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
      <Stack.Screen name="Home" options={{transitionSpec: {open: config, close: config}}} component={HomeScreen} />
      <Stack.Screen name="Profile" options={{headerBackTitle: "Home", transitionSpec: { open: config, close: config }}} component={ProfilePage} />
      <Stack.Screen name="Followers-Following" options={{headerBackTitle: "Profile", transitionSpec: {open: config, close: config}}} component={FollowersFollowingPage}/>
      <Stack.Screen name="HomePage" options={{title: "WhichOne", transitionSpec: {open: config, close: config}}} component={HomePage} />
      <Stack.Screen name="Stats" options={{transitionSpec: {open: config, close: config}}} component={StatsPage} />
      <Stack.Screen name="Settings" options={{transitionSpec: {open: config, close: config}}} component={SettingsPage} />
      <Stack.Screen name="About" options={{transitionSpec: {open: config, close: config}}} component={AboutPage} />
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

