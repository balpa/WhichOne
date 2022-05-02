import React from 'react'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet, Alert, Animated } from 'react-native'
import { Button, Image, Input } from "react-native-elements"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/native';
import * as firebase from 'firebase'
import { auth } from '../firebase'
import { ScrollView } from 'react-native-gesture-handler'
import ProfileRecentPosts from '../components/ProfileRecentPosts'
import { TouchableOpacity } from 'react-native'
import { useState } from 'react'
import ChangeName from '../components/ChangeName'
import "firebase/firestore";
import { db } from '../firebase'
import UploadPhoto from '../components/UploadPhoto'

const AccountSettings = ({ navigation }) => {

    const [isShown, setIsShown] = useState(false)
    const [uploadAvatar, setUploadAvatar] = useState(false)
    const [changedName, setChangedName] = useState("") 
    const user = firebase.auth().currentUser;

    const changeName = () => {
        setIsShown(true)
    }
    const openUploadAvatar = () => {
        setUploadAvatar(true)
    }
    const SubmitButton = () => {


        const submitButtonFunc = () => {

            if (changedName.length > 3 && changedName.length < 15){
            user.updateProfile({
                displayName: `${changedName}`,
              }).then(() => {
                Alert.alert("Name Changed!")
              }).catch((error) => {
                Alert.alert(error.message)
              }); 
            } 
            else if (changedName.length > 15) {
                Alert.alert("Name must be between 3 and 15 characters!")
            }
            else {
                Alert.alert("Name must be at least 3 characters long!")
            }
            setIsShown(false)

        }
        return <Button onPress={submitButtonFunc} 
                    buttonStyle={{
            zIndex: 20,
            width: 90,
            height: 50,
            backgroundColor: "rgba(220,20,60,0.9)",
            borderRadius: 20,
        
        }} 
        title="Submit"/>
    }
    const CancelButton = () => {

        const cancel = () => {
            Alert.alert("Cancelled!")
            setIsShown(false)
            setUploadAvatar(false)
        }
        return <Button onPress={cancel} 
        buttonStyle={{
            zIndex: 20,
            width: 90,
            height: 50,
            backgroundColor: "rgba(220,20,60,0.9)",
            borderRadius: 20,
        
        }} 
        title="Cancel!"/>

    
    }
    const UploadButton = () => {
        return <Button buttonStyle={{
            zIndex: 20,
            width: 90,
            height: 50,
            backgroundColor: "rgba(220,20,60,0.9)",
            borderRadius: 20,
        
        }} 
        title="Upload"/>
    }

    let fadeAnim = new Animated.Value(0)
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          }
        ).start();
        const animStyle = {
            opacity: fadeAnim
        }


    const ChangeName = () => {
        return (
            <Animated.View style={[styles.component, animStyle]}>
                <Text style={{marginBottom: 50}}>Your name: {user.displayName}</Text>
                <Input autoFocus placeholder="Change your name" value={changedName} onChangeText={(text) => setChangedName(text)} />
    
            </Animated.View>
        )
    }

    const UploadAvatar = () => {
        return (
            <Animated.View style={[styles.component, animStyle]}>
    
            </Animated.View>
        )
    }



    return (
        <>
        <View style={styles.container}>
            <View style={styles.elevation}>
                <Button onPress={changeName} titleStyle={{color: "white", fontSize: 20}} buttonStyle={styles.accountButton} title="Change Name"/>
                <Button onPress={openUploadAvatar} titleStyle={{color: "white", fontSize: 20}} buttonStyle={styles.accountButton} title="Profile Picture"/>
                {isShown ? <ChangeName /> : null}
                {uploadAvatar ? <UploadPhoto /> : null}
                
            </View>
            <View style={{
                position: "absolute",
                bottom: 100, 
                left: 80,
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 3 },
                shadowOpacity: 0.8,
                shadowRadius: 1,
                elevation: 5,
        }}>
                {isShown ?  <SubmitButton /> : null}
            </View>
            <View style={{
                position: "absolute",
                bottom: 100, 
                left: 200,
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 3 },
                shadowOpacity: 0.8,
                shadowRadius: 1,
                elevation: 5,
        }}>
                {isShown ?  <CancelButton /> : null}
            </View>
            <View style={{
                position: "absolute",
                bottom: 100, 
                left: 80,
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 3 },
                shadowOpacity: 0.8,
                shadowRadius: 1,
                elevation: 5,
        }}>
                {uploadAvatar ?  <UploadButton /> : null}
            </View>
            <View style={{
                position: "absolute",
                bottom: 100, 
                left: 200,
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 3 },
                shadowOpacity: 0.8,
                shadowRadius: 1,
                elevation: 5,
        }}>
                {uploadAvatar ?  <CancelButton /> : null}
            </View>
            
        </View>
    
        </>

    )
}

export default AccountSettings

const styles = StyleSheet.create({
    accountButton: {
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
    },
    component: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        width: 350,
        height: 400,
        backgroundColor: "rgba(250,250,250,0.9)",
        marginTop: 5,
        marginBottom: 5,
        borderRadius:20,
        padding: 5,
        zIndex: 10,

    }

})