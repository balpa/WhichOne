import React from 'react'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native'
import { Button, Image, Input } from "react-native-elements"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/native';
import * as firebase from 'firebase'
import { auth } from '../firebase'
import { ScrollView } from 'react-native-gesture-handler'
import ProfileRecentPosts from '../components/ProfileRecentPosts'

const SettingsPage = ({ navigation }) => {

    return (
        <>
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.elevation}>
            <Button onPress={ ()=> navigation.navigate("Account")} titleStyle={{color: "white", fontSize: 25}} buttonStyle={styles.logoutButton} title="Account"/>
            <Button titleStyle={{color: "white", fontSize: 25}} buttonStyle={styles.logoutButton} title="Notifications"/>
            <Button titleStyle={{color: "white", fontSize: 25}} buttonStyle={styles.logoutButton} title="Theme"/>
            <Button titleStyle={{color: "white", fontSize: 25}} buttonStyle={styles.logoutButton} title="Help"/>
            <Button onPress={() => navigation.navigate("About")} titleStyle={{color: "white", fontSize: 25}} buttonStyle={styles.logoutButton} title="About"/>

            </View>
        </KeyboardAvoidingView>
    
        </>

    )
}

export default SettingsPage

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