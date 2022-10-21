import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image, useWindowDimensions } from 'react-native'
import { Button } from 'react-native-elements/'
import { auth } from "../firebase";
import { db } from "../firebase"
import firebase from 'firebase/compat/app'
import { doc, onSnapshot } from "firebase/firestore"
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';


export default function SmallProfile({ userID, theme, textColor }) {

    const COLOR_PALETTE_1 = ["FAC213", "F77E21", "D61C4E", "990000", "FF5B00"]   // bright yellows cleared 

    const navigation = useNavigation()

    const loggedinUser = auth.currentUser

    const window = useWindowDimensions()    // hook to get the window dimensions

    const [followSituation, setFollowSituation] = useState(false)
    const [userIDData, setUserIDData] = useState({}) // store the user's data 
    const [image, setImage] = useState(null) // store the user's avatar

    const storage = getStorage();

    getDownloadURL(ref(storage, `Users/${userID}/avatars/avatar_image`))    // get the user's avatar
      .then((url) => setImage(url))
      .catch((error) => setImage("https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png"))

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
        <View style={[
            styles.container, 
            {backgroundColor: theme == 'dark' ? 'rgb(15,15,15)' : 'white'}]}>
            <View style={styles.nameAndImage} >
                    <Image 
                        style={styles.avatar} 
                        source={{uri: image}}/>
                    <TouchableOpacity 
                        onPress={()=>{
                            navigation.navigate("UserProfile",{ name: `${userIDData.name}`, userID: `${userID}`})}
                            }>
                        <Text 
                            style={{fontSize: 17, color:textColor}}>
                            {userIDData.name}
                        </Text>
                    </TouchableOpacity>
            </View>
            <View>
                <View style={{flexDirection: "row"}}>
                    {!followSituation && 
                        <Button 
                            onPress={follow} 
                            buttonStyle={styles.followButton} 
                            titleStyle={{fontSize: 10, color:'crimson'}} 
                            title={"Follow"}/>}
                    {followSituation && 
                        <Button 
                            onPress={unfollow} 
                            buttonStyle={[
                                styles.unfollowButton, 
                                {backgroundColor: `#${COLOR_PALETTE_1[Math.floor(Math.random() * COLOR_PALETTE_1.length)]}`}
                            ]} 
                            titleStyle={{fontSize: 10}} 
                            title={"Following"}/>}
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
        backgroundColor: "white",
    },
    unfollowButton: {
        width: 100,
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: '100%',
        height: 50,
        paddingLeft: 20,
        paddingRight: 20,
    },
    avatar: {
        width: 30, 
        height: 30, 
        borderRadius: 30/2, 
        marginRight:10
    }
    })
    