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
import ChangePassword from '../components/AccountSettingsComponents/ChangePassword'
import "firebase/firestore";
import { db } from '../firebase'
import { auth } from '../firebase'
import UploadAvatar from '../components/UploadPhoto'

const AccountSettings = ({ navigation }) => {

    // TODO: styling bad & add shadow platform based
    // need problems with styling. need refactoring probably

    const COLOR_PALETTE_1 = ["FEF9A7","FAC213", "F77E21", "D61C4E", "990000", "FF5B00", "D4D925", "FFEE63"]

    const [isChangeNameShown, setIsChangeNameShown] = useState(false)
    const [isEditBioShown, setIsEditBioShown] = useState(false)
    const [isChangePasswordShown, setIsChangePasswordShown] = useState(false)
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

            <View style={styles.elevation}>
                <View style={[styles.buttonView,{backgroundColor:`#${COLOR_PALETTE_1[3]}`}]}>
                    <TouchableOpacity onPress={()=> setIsChangeNameShown(true)} style={{
                        width:'100%', height: 50, justifyContent:'center', alignItems:'center'}}>
                        <Text 
                            style={{fontSize:25, fontWeight:'800'}}>
                            Change Name
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.buttonView,{backgroundColor:`#${COLOR_PALETTE_1[3]}`}]}>
                    <TouchableOpacity onPress={()=> setIsEditBioShown(true)} style={{
                        width:'100%', height:50, justifyContent:'center', alignItems:'center'}}>
                        <Text 
                            style={{fontSize:25, fontWeight:'800'}}>
                            Edit Bio
                        </Text>
                    </TouchableOpacity>
                </View> 
                <View style={[styles.buttonView,{backgroundColor:`#${COLOR_PALETTE_1[5]}`}]}>
                    <TouchableOpacity onPress={()=> navigation.navigate("Upload Avatar")} style={{
                        width:'100%', height: 50, justifyContent:'center', alignItems:'center'}}>
                        <Text 
                            style={{fontSize:25, fontWeight:'800'}}>
                            Upload Avatar
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.buttonView,{backgroundColor:`#${COLOR_PALETTE_1[6]}`}]}>
                    <TouchableOpacity onPress={()=> setIsChangePasswordShown(true)} style={{
                        width:'100%', height: 50, justifyContent:'center', alignItems:'center'}}>
                        <Text 
                            style={{fontSize:25, fontWeight:'800'}}>
                            Change Password
                        </Text>
                    </TouchableOpacity>
                </View>


               
            </View>
            {isChangeNameShown ? 
                <View style={{width:'100%',height:'100%',justifyContent:'center', alignItems:'center'}} >
                    <ChangeName color={`#${COLOR_PALETTE_1[3]}`} setIsChangeNameShown={setIsChangeNameShown} />
                </View> : null}

                {isEditBioShown ? 
                <View style={{width:'100%',height:'100%',justifyContent:'center', alignItems:'center'}}>
                    <EditBio color={`#${COLOR_PALETTE_1[3]}`} setIsEditBioShown={setIsEditBioShown} /> 
                </View> : null}

                {isChangePasswordShown ? 
                <View style={{width:'100%',height:'100%',justifyContent:'center', alignItems:'center'}}>
                    <ChangePassword color={`#${COLOR_PALETTE_1[6]}`} setIsChangePasswordShown={setIsChangePasswordShown} /> 
                </View> : null}

           

    
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
    // container: {
    //     alignItems:"center",
    //     justifyContent: "space-evenly",
    //     backgroundColor: "black",
    //     borderWidth: 1, 
    // },
    elevation:{
        position:'absolute',
        width: "100%",
        height: "100%",
        alignItems: "center",
    },
    buttonView: {
        margin: 10, 
        width:'90%',
        height:50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius:10
    }

})