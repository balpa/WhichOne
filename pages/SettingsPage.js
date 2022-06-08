import React from 'react'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Image } from 'react-native'
import { Button, Input, Icon } from "react-native-elements"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/native';
import { auth } from '../firebase'
import { ScrollView } from 'react-native-gesture-handler'

const SettingsPage = ({ navigation }) => {

    // TODO: check container and elevation box styling

    return (
        <>
            <View style={styles.container}>
                <View style={styles.buttonIconWrapper}>
                    <Icon name="person" color="black" />
                    <Button onPress={ ()=> navigation.navigate("Account") } titleStyle={{color: "black", fontSize: 25}} buttonStyle={styles.settingsButton} title="Account" />
                </View>
                <View style={styles.buttonIconWrapper}>
                    <Icon name='notifications' color="black" />
                    <Button titleStyle={{color: "black", fontSize: 25}} buttonStyle={styles.settingsButton} title="Notifications"/>
                </View>
                <View style={styles.buttonIconWrapper}>
                    <Icon name='palette' color="black" />
                    <Button titleStyle={{color: "black", fontSize: 25}} buttonStyle={styles.settingsButton} title="Theme"/>
                </View>
                <View style={styles.buttonIconWrapper}>
                    <Icon name='lock' color="black" />
                    <Button titleStyle={{color: "black", fontSize: 25}} buttonStyle={styles.settingsButton} title="Security"/>
                </View>
                <View style={styles.buttonIconWrapper}>
                    <Icon name='help' color="black" />
                    <Button titleStyle={{color: "black", fontSize: 25}} buttonStyle={styles.settingsButton} title="Help"/>
                </View>
                <View style={styles.buttonIconWrapper}>
                    <Icon name='info' color="black" />
                    <Button onPress={ () => navigation.navigate("About") } titleStyle={{color: "black", fontSize: 25}} buttonStyle={styles.settingsButton} title="About"/>
                </View>
            </View>
            <View style={styles.logoBottomContainer}>
                <Image source={require("../assets/w1logocrimson.png")} style={styles.logoBottom}/>
            </View>

        </>

    )
}

export default SettingsPage

const styles = StyleSheet.create({
    logoutButton: {
        width: "50%",
        borderWidth: 0,
        backgroundColor: "green",
        justifyContent:"flex-start",
    },
    settingsButton: {
        borderWidth: 0,
        backgroundColor: "transparent",
        justifyContent:"flex-start",
    },
    buttonIconWrapper: {
        flexDirection: "row",
        width: "50%",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",

    },

    top: {
        alignItems: "flex-end"
    },
    container:{
        width: "100%",
        height: "50%",
        justifyContent: "space-evenly", 
        backgroundColor: "#ffffff",
        // shadowColor: '#000',
        // shadowOffset: { width: 1, height: 3 },
        // shadowOpacity: 0.9,
        // shadowRadius: 2,
        elevation: 5,
    },
    profileBody: {
    },
    logoBottom:{
        position: 'absolute',
        width: 50,
        height: 50,
        bottom: 0,
        zIndex: 10
    },
    logoBottomContainer:{
        position: 'absolute',
        bottom: 10,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    }

})