import React from 'react'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from "react-native-elements"
import { SafeAreaView, ScrollView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { auth } from '../firebase'
import HomePage from "./HomePage"
import ProfilePage from './ProfilePage'
import StatsPage from './StatsPage'

const HomeScreen = ({ navigation }) => {


    const Stack = createBottomTabNavigator();

   


    return (

        <Text></Text>

    )
}

export default HomeScreen

const styles = StyleSheet.create({
    logoutButton: {
        width: 100,
        borderWidth: 0,
        backgroundColor: "transparent",
        marginTop: 10,
    },
    top: {
        alignItems: "flex-end"
    }
})