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

import "react-native-gesture-handler";
import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, LogBox } from "react-native";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";
import SearchPage from "./pages/SearchPage";
import UserProfile from "./pages/UserProfile";
import AccountSettings from "./pages/AccountSettings";
import Create from "./pages/Create";
import UploadAvatar from "./pages/UploadAvatar";
import DMChatPage from "./pages/DMChatPage";
import ThemePage from "./pages/ThemePage";
import NotificationsPage from "./pages/NotificationsPage";
import FollowersFollowingPage from "./pages/FollowersFollowingPage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerRootComponent } from "expo";

// to clear the yellow warning on android devices
LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
LogBox.ignoreLogs(["color"]);

const Stack = createStackNavigator();

let globalScreenOptions;

if (Platform.OS === "ios") {
  globalScreenOptions = {
    //headerStyle: { height: 75 },
    //headerTitleStyle: { color: "black" },
    //headerTintColor: "black",
    gestureEnabled: true,
    headerShown: true,
    //cardStyle: { backgroundColor: 'rgba(255,255,255,1)' },    // to make the background black (transitions, reload etc)
  };
}

if (Platform.OS === "android") {
  globalScreenOptions = {
    //headerStyle: { height: 75 },
    //headerTitleStyle: { color: "black" },
    //headerTintColor: "black",
    gestureEnabled: false,
    headerShown: true,
    //cardStyle: { backgroundColor: 'rgba(255,255,255,1)' },    // to make the background black (transitions, reload etc)
  };
}

const config = {
  animation: "spring",
  config: {
    stiffness: 900,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
}

// TODO: SAFE AREA NOT WORKING STILL

export default function App() {
  //TODO: App needs restart after changing the theme. find a solution for theme (localstorage is not what i want)

  const [selectedTheme, setSelectedTheme] = React.useState("light")
  const [headerStyleDOT, setHeaderStyleDOT] = React.useState({})
  const [headerTitleStyleDOT, setHeaderTitleStyleDOT] = React.useState({})
  const [headerTintColorDOT, setHeaderTintColorDOT] = React.useState("")
  const [cardColor, setCardColor] = React.useState({})

  React.useEffect(async () => {
    // get theme data from local storage (cache) ***HARDCODED***
    try {
      const value = await AsyncStorage.getItem("GLOBAL_THEME")
      if (value !== null) {
        if (value == "dark") {
          setSelectedTheme(value)
          setHeaderStyleDOT({
            backgroundColor: "rgb(15,15,15)",
          })
          setHeaderTitleStyleDOT({ color: "white" })
          setHeaderTintColorDOT("white")
          setCardColor({ backgroundColor: "rgb(15,15,15)" })
        } else {
          setSelectedTheme(value)
          setHeaderStyleDOT({
            backgroundColor: "white",
            //height: 80
          })
          setHeaderTitleStyleDOT({ color: "black" })
          setHeaderTintColorDOT("black")
          setCardColor({ backgroundColor: "rgb(255,255,255)" })
        }
      }
    } catch (e) { console.log(e) }
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions} headerMode="screen">
        <Stack.Screen
          name="Login"
          options={{
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            cardStyle: cardColor,
            transitionSpec: { open: config, close: config },
          }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="Register"
          options={{
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            cardStyle: cardColor,
            transitionSpec: { open: config, close: config },
          }}
          component={RegisterScreen}
        />
        <Stack.Screen
          name="Profile"
          options={{
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            headerBackTitle: "Home",
            cardStyle: cardColor,
            transitionSpec: { open: config, close: config },
          }}
          component={ProfilePage}
        />
        <Stack.Screen
          name="Followers & Following"
          options={{
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            headerBackTitle: "Profile",
            cardStyle: cardColor,
            transitionSpec: { open: config, close: config },
          }}
          component={FollowersFollowingPage}
        />
        <Stack.Screen
          name="HomePage"
          options={{
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            title: "WhichOne",
            cardStyle: cardColor,
            transitionSpec: { open: config, close: config },
          }}
          component={HomePage}
        />
        <Stack.Screen
          name="Stats"
          options={{
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            cardStyle: cardColor,
            transitionSpec: { open: config, close: config },
          }}
          component={StatsPage}
        />
        <Stack.Screen
          name="Settings"
          options={{
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            cardStyle: cardColor,
            transitionSpec: { open: config, close: config },
          }}
          component={SettingsPage}
        />
        <Stack.Screen
          name="Notifications"
          options={{
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            cardStyle: cardColor,
            transitionSpec: { open: config, close: config },
          }}
          component={NotificationsPage}
        />
        <Stack.Screen
          name="About"
          options={{
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            cardStyle: cardColor,
            transitionSpec: { open: config, close: config },
          }}
          component={AboutPage}
        />
        <Stack.Screen
          name="Theme"
          options={{
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            cardStyle: cardColor,
            transitionSpec: { open: config, close: config },
          }}
          component={ThemePage}
        />
        <Stack.Screen
          name="UserProfile"
          options={({ route }) => ({
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            cardStyle: cardColor,
            title: route.params.name,
          })}
          component={UserProfile}
        />
        <Stack.Screen
          name="DMChatPage"
          options={({ route }) => ({
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            cardStyle: cardColor,
            title: route.params.name,
            headerBackTitle: "Messages",
          })}
          component={DMChatPage}
        />
        <Stack.Screen
          name="Search"
          options={{
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            headerBackTitle: "Home",
            cardStyle: cardColor,
            transitionSpec: { open: config, close: config },
          }}
          component={SearchPage}
        />
        <Stack.Screen
          name="Account"
          options={{
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            headerBackTitle: "Settings",
            cardStyle: cardColor,
            transitionSpec: { open: config, close: config },
          }}
          component={AccountSettings}
        />
        <Stack.Screen
          name="Upload Avatar"
          options={{
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            headerBackTitle: "Account",
            cardStyle: cardColor,
            transitionSpec: { open: config, close: config },
          }}
          component={UploadAvatar}
        />
        <Stack.Screen
          name="Create"
          options={{
            headerTitleStyle: headerTitleStyleDOT,
            headerStyle: headerStyleDOT,
            headerTintColor: headerTintColorDOT,
            headerBackTitle: "Home",
            cardStyle: cardColor,
            transitionSpec: { open: config, close: config },
          }}
          component={Create}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    width: 80,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
});
