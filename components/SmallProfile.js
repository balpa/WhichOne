import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, KeyboardAvoidingView, Image, useWindowDimensions } from 'react-native'
import { Button, Input, Icon } from 'react-native-elements/'
import { auth } from "../firebase";
import { db } from "../firebase"
import firebase from 'firebase/compat/app'
import { doc, onSnapshot, getDoc } from "firebase/firestore"
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';


export default function SmallProfile({ userID }) {

    const navigation = useNavigation()

    const loggedinUser = auth.currentUser

    const window = useWindowDimensions()    // hook to get the window dimensions

    const [followSituation, setFollowSituation] = useState(false)
    const [userIDData, setUserIDData] = useState({}) // store the user's data 
    const [image, setImage] = useState(null) // store the user's avatar

    const storage = getStorage();

    console.log(navigation)

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

    // check if the user is following
    useEffect(() => {
        if (userID !== "" || userID !== null || userID !== undefined) {
            const isFollowingSearchedUser = onSnapshot(doc(db, "useruid", `${userID}`), (doc) => {
                if (userID === loggedinUser.uid) setFollowSituation(true)
                else setFollowSituation(doc.data().followers.includes(loggedinUser.uid))
            })
            }
    }, [userID])


     // follow button func
    function follow () {   
        if (userID !== loggedinUser.uid) {
        const addToFollowingForFollowingUser = db.collection('useruid')
            .doc(`${loggedinUser.uid}`)
            .update({
                following: firebase.firestore.FieldValue.arrayUnion(userID)
            })
        const addToFollowersForSearchedUser = db.collection('useruid')
            .doc(`${userID}`)
            .update({
                followers: firebase.firestore.FieldValue.arrayUnion(loggedinUser.uid)
            })
        }
    }
    // unfollow button func
    function unfollow () {
        if (userID !== loggedinUser.uid) {
        const removeFromFollowingForFollowingUser = db.collection('useruid')
            .doc(`${loggedinUser.uid}`)
            .update({
                following: firebase.firestore.FieldValue.arrayRemove(userID)
        })
        const removeFromFollowersForSearchedUser = db.collection('useruid')
            .doc(`${userID}`)
            .update({
                followers: firebase.firestore.FieldValue.arrayRemove(loggedinUser.uid)
            })
        }
    }

    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: window.width-5,
            height: 50,
            backgroundColor: 'rgba(255,255,255,0)',
            paddingLeft: 20,
            paddingRight: 20,
            }}>
            <View style={styles.nameAndImage} >
                    <Image style={{width: 30, height: 30, borderRadius: 30/2, marginRight:10}} source={{uri: image}}/>
                    <TouchableOpacity onPress={()=>{navigation.navigate("UserProfile",{ name: `${userIDData.name}`, userID: `${userID}`})}}>
                        <Text style={{fontSize: 15, color:"white"}}>{userIDData.name}</Text>
                    </TouchableOpacity>
            </View>
            <View >
                <View style={{flexDirection: "row"}}>
                    {!followSituation && <Button onPress={follow} buttonStyle={styles.followButton} titleStyle={{fontSize: 10}} title={"Follow"}/>}
                    {followSituation && <Button onPress={unfollow} buttonStyle={styles.followButton} titleStyle={{fontSize: 10}} title={"Following"}/>}
                </View>
            </View>
        </View>
    )}


    const styles = StyleSheet.create({
    nameAndImage:{
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    followButton: {
        width: 100,
        backgroundColor: "crimson",
    }
    })
    