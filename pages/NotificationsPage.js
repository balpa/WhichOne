import React from 'react'
import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet, Alert, Switch } from 'react-native'
import { Button, Image, Input } from "react-native-elements"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/native';
import { auth } from '../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler'

const NotificationsPage = ({ navigation }) => {

    const [selectedTheme, setSelectedTheme] = useState('')
    const [textColorDependingOnTheme, setTextColorDependingOnTheme] = useState('')
    const [isEnabled, setIsEnabled] = useState(false)

    useEffect(async()=>{      // get theme data from local storage (cache) ***HARDCODED***
        try {
          const value = await AsyncStorage.getItem('GLOBAL_THEME')
          if(value !== null) {
            setSelectedTheme(value)
            if (value == 'light') setTextColorDependingOnTheme('black')
            else setTextColorDependingOnTheme('white')}
        } catch(e) {console.log(e)}
      },[])

    // TODO: styling and cache storing the choices

    return (
        <>
        <View 
          style={[
            styles.container,
            selectedTheme == 'dark' ? {backgroundColor:'rgb(15,15,15)'} : {backgroundColor:'white'}
            ]}>
          
          <View style={styles.switchLineStyle}>
            <Text>
                Show message notifications
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "crimson" }}
              thumbColor={isEnabled ? "white" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={()=>setIsEnabled(!isEnabled)}
              value={isEnabled}
            />
          </View>
          <View style={styles.switchLineStyle}>
            <Text>
                Show post notifications
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "crimson" }}
              thumbColor={isEnabled ? "white" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={()=>setIsEnabled(!isEnabled)}
              value={isEnabled}
            />
          </View>
          <View style={styles.switchLineStyle}>
            <Text>
                Show bişiy notifications
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "crimson" }}
              thumbColor={isEnabled ? "white" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={()=>setIsEnabled(!isEnabled)}
              value={isEnabled}
            />
          </View>
          
        </View>
        <View style={styles.logoBottomContainer}>
                <Image source={require("../assets/w1logocrimson.png")} style={styles.logoBottom}/>
        </View>
        </>

    )
}

export default NotificationsPage

const styles = StyleSheet.create({
    logoutButton: {
      width: 170,
      borderWidth: 0,
      backgroundColor: "transparent",
    },
    container: {
      flex: 1,
      alignItems:"center",
      justifyContent: "center",
      backgroundColor: "rgba(15,15,15,1)",
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25 
    },
    switchLineStyle: {
      flexDirection:'row',
      width:'100%',
      justifyContent:'center',
      alignItems:'center',
      margin: 20
    },
    logoBottom:{
      width: 50,
      height: 50,
      bottom: 0,
      zIndex: 10
    },
    logoBottomContainer:{
      position:'absolute',
      bottom: 10,
      width: "100%",
      justifyContent: 'center',
      alignItems: 'center',
      zIndex:5
    },

})