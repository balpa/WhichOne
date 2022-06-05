import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, KeyboardAvoidingView, Image, useWindowDimensions } from 'react-native'
import { Button, Input, Icon } from 'react-native-elements/'
import { auth, db } from "../../firebase";
import firebase from 'firebase/compat/app'
import { doc, onSnapshot, getDoc } from "firebase/firestore"
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';


export default function MessagePerson({ userID, color }) {

  // TODO: create message content page and navigations

    const navigation = useNavigation()

    const loggedinUser = auth.currentUser

    const window = useWindowDimensions()    // hook to get the window dimensions

    const [followSituation, setFollowSituation] = useState(false)
    const [userIDData, setUserIDData] = useState({}) // store the user's data 
    const [image, setImage] = useState(null) // store the user's avatar

    const storage = getStorage();

    getDownloadURL(ref(storage, `Users/${userID}/avatars/avatar_image`))    // get the user's avatar
      .then((url) => setImage(url))
      .catch((error) => console.log(error))

    // get the user's data. id is passed through component props
    useEffect(() => {
        var docRef = db.collection("useruid").doc(userID);
        docRef.get().then((doc) => {

        if (doc.exists) setUserIDData(doc.data())
        else console.log("No such document!")

        }).catch((error) => console.log("Error getting document:", error))
    }, [])

    

    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: window.width-5,
            height: 70,
            backgroundColor: 'rgba(255,255,255,0)',
            paddingLeft: 20,
            paddingRight: 20,
            }}>
            <View style={styles.nameAndImage} >
                    <Image 
                      style={{
                        width: 50, 
                        height: 50, 
                        borderRadius: 50/2, 
                        marginRight:10}} 
                      source={{uri: image}}/>
                    <TouchableOpacity 
                      onPress={()=>{navigation.navigate("UserProfile",{ name: `${userIDData.name}`, userID: `${userID}`})}}>
                        <Text 
                          style={{
                            fontSize: 17, 
                            color:'black', 
                            fontWeight:'500'}}
                            >{userIDData.name}</Text>
                    </TouchableOpacity>
            </View>
            <View>
                <View style={{
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 30,
                  flexDirection: "row", 
                  borderWidth:1,
                  borderColor:'black',
                  width:100,
                  height:50,
                  backgroundColor:`#${color}`, 
                  justifyContent:'center', 
                  alignItems:'center'}}>
                  <TouchableOpacity 
                    onPress={()=>console.log("navigate here")} 
                    style={{
                      width:'100%',
                      height:'100%',
                      justifyContent:'center',
                      alignItems:'center'}}>
                    <Text>Message</Text>
                  </TouchableOpacity>
                </View>
            </View>
        </View>
    )}


    const styles = StyleSheet.create({
    nameAndImage:{
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor:'black',
        borderBottomRightRadius: 30,
        borderTopRightRadius: 10,
        paddingRight: 20,
        paddingLeft: 10,
        paddingTop: 3,
        paddingBottom: 3

    },
    followButton: {
        width: 100,
        backgroundColor: "white",
    },
    unfollowButton: {
        width: 100,
        backgroundColor: "crimson",
    }
    })
    