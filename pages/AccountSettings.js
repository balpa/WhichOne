import React from 'react'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet, Alert, Animated } from 'react-native'
import { Button, Image, Input } from "react-native-elements"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler'
import { TouchableOpacity } from 'react-native'
import { useState } from 'react'
import ChangeName from '../components/AccountSettingsComponents/ChangeName'
import EditBio from '../components/AccountSettingsComponents/EditBio'
import "firebase/firestore";
import { db } from '../firebase'
import { auth } from '../firebase'
import UploadAvatar from '../components/UploadPhoto'

const AccountSettings = ({ navigation }) => {

    const [isChangeNameShown, setIsChangeNameShown] = useState(false)
    const [isEditBioShown, setIsEditBioShown] = useState(false)
    const [changedName, setChangedName] = useState("") 
    const user = auth.currentUser;
  

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



    return (
        <>
        <View style={styles.container}>
            <View style={styles.elevation}>
                <Button onPress={()=> setIsChangeNameShown(true)} titleStyle={{color: "white", fontSize: 20}} buttonStyle={styles.accountButton} title="Change Name"/>
                <Button onPress={()=> setIsEditBioShown(true)} titleStyle={{color: "white", fontSize: 20}} buttonStyle={styles.accountButton} title="Edit Bio"/>
                <Button onPress={()=> navigation.navigate("Upload Avatar")} titleStyle={{color: "white", fontSize: 20}} buttonStyle={styles.accountButton} title="Upload Avatar"/>
                {isChangeNameShown ? <ChangeName setIsChangeNameShown={setIsChangeNameShown} /> : null}
                {isEditBioShown ? <EditBio setIsEditBioShown={setIsEditBioShown} /> : null}
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
        backgroundColor: "black",
        borderWidth: 1, 
    },
    elevation:{
        width: "100%",
        height: "100%",
        justifyContent: "center", alignItems: "center", 
        backgroundColor: "rgba(15,15,15,1)",
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