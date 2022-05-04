import React from 'react'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { Button, Image, Input } from "react-native-elements"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/native';
import { auth } from '../firebase'
import { ScrollView } from 'react-native-gesture-handler'
import ProfileRecentPosts from '../components/ProfileRecentPosts'

const AboutPage = ({ navigation }) => {

    return (
        <>
        <View style={styles.container}>
            <View style={styles.elevation}>
                <Text>baLpa</Text>
            </View>
        </View>
    
        </>

    )
}

export default AboutPage

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
        backgroundColor: "#243447",
        borderWidth: 1,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25 
    },
    elevation:{
        width: 300,
        height: 500,
        justifyContent: "center", alignItems: "center", 
        backgroundColor: "rgba(255,255,255,0.1)",
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 5,
        borderRadius: 40,
    },
    profileBody: {
    }

})