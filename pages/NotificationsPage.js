import React from 'react'
import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet, Alert } from 'react-native'
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

    useEffect(async()=>{      // get theme data from local storage (cache) ***HARDCODED***
        try {
          const value = await AsyncStorage.getItem('GLOBAL_THEME')
          if(value !== null) {
            setSelectedTheme(value)
            if (value == 'light') setTextColorDependingOnTheme('black')
            else setTextColorDependingOnTheme('white')}
        } catch(e) {console.log(e)}
      },[])

    return (
        <>
        <View style={[
            styles.container,
            selectedTheme == 'dark' ? {backgroundColor:'rgb(15,15,15)'} : {backgroundColor:'white'}
            ]}>
            <Text>
                asbout
            </Text>
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
    top: {
        alignItems: "flex-end"
    },
    container: {
        flex: 1,
        alignItems:"center",
        justifyContent: "center",
        backgroundColor: "rgba(15,15,15,1)",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25 
    },
   
    profileBody: {
    }

})