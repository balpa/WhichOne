import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { StyleSheet, View, Text, KeyboardAvoidingView, Image } from 'react-native'
import { Button, Input, Icon } from 'react-native-elements/'
import { useState, useLayoutEffect } from "react"
import { auth } from "../firebase";
import { db } from "../firebase"
import { Alert } from 'react-native'
import firebase from 'firebase/compat/app'
import { doc, onSnapshot } from "firebase/firestore"
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const SearchPage = ({ navigation }) => {


    const [searchUsername, setSearchUsername] = useState("")
    const [isFollowing, setIsFollowing] = useState(false)
    const [exists, setExists] = useState(false)
    const [searchedUsersUID, setSearchedUsersUID] = useState("")
    const [followSituation, setFollowSituation] = useState(false)
    const [followerCount, setFollowerCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
    const [isSearchedMyself, setIsSearchedMyself] = useState(false)
    const [image, setImage] = useState(null)

    const loggedinUser = auth.currentUser

    const storage = getStorage();
    // get searched user's avatar 
    useEffect(() => {
        getDownloadURL(ref(storage, `Users/${searchedUsersUID}/avatars/avatar_image`))
          .then((url) => {
            if (url) setImage(url)
        })
          .catch((error) => {
            setImage(null)
            console.log(error)
        });
    }, [searchedUsersUID])

    // FOLLOW-UNFOLLOW WORKS BUT NEED TO ADD STATE CHECK BY QUERYING THE USER'S UID

    // follow button func
    function follow () {   
        if (searchedUsersUID !== loggedinUser.uid) {
        const addToFollowingForFollowingUser = db.collection('useruid')
            .doc(`${loggedinUser.uid}`)
            .update({
                following: firebase.firestore.FieldValue.arrayUnion(searchedUsersUID)
            })
        const addToFollowersForSearchedUser = db.collection('useruid')
            .doc(`${searchedUsersUID}`)
            .update({
                followers: firebase.firestore.FieldValue.arrayUnion(loggedinUser.uid)
            })
        }
    }
    // unfollow button func
    function unfollow () {
        if (searchedUsersUID !== loggedinUser.uid) {
        const removeFromFollowingForFollowingUser = db.collection('useruid')
            .doc(`${loggedinUser.uid}`)
            .update({
                following: firebase.firestore.FieldValue.arrayRemove(searchedUsersUID)
        })
        const removeFromFollowersForSearchedUser = db.collection('useruid')
            .doc(`${searchedUsersUID}`)
            .update({
                followers: firebase.firestore.FieldValue.arrayRemove(loggedinUser.uid)
            })
        }
    }

    // get searched user's follower and following count depending on searcheced user's uid.
    useEffect(() => {

        if (searchedUsersUID !== ""){
        // get total follower count
        const getTotalFollowerCount = onSnapshot(doc(db, "useruid", `${searchedUsersUID}`), (doc) => {
            setFollowerCount(doc.data().followers.length)
                })
            // get total following count
        const getTotalFollowingCount = onSnapshot(doc(db, "useruid", `${searchedUsersUID}`), (doc) => {
            setFollowingCount(doc.data().following.length)
                })
        }

    },[searchedUsersUID])

    // search for if the user searched for themselves
    useEffect(() => {
        if (loggedinUser.uid === searchedUsersUID) setIsSearchedMyself(true)
        else setIsSearchedMyself(false)
    }, [searchedUsersUID])

    // check if the user is following the searched user
    useEffect(() => {
        if (searchedUsersUID !== ""){
            const isFollowingSearchedUser = onSnapshot(doc(db, "useruid", `${searchedUsersUID}`), (doc) => {
                if (searchedUsersUID === loggedinUser.uid) setFollowSituation(true)
                else setFollowSituation(doc.data().followers.includes(loggedinUser.uid))
            })
            }
    }, [searchedUsersUID])


    // searched user's component
    const UserSearchProfile = () => {
        return (
            <View style={styles.component}>
                <View style={styles.imageNameField}>
                    <Image source={{uri: image}} style={{width: 70, height: 70, borderRadius: 70/2}}/>
                    <Text style={{fontSize: 25, color:"white"}}> {searchUsername}</Text>
                </View>
                <View style={styles.userSearchProfile}>
                    <View style={{flexDirection: "row"}}>
                        <Text style={styles.followersInfo}>{followerCount}{"\n"}Followers</Text>
                        <Text style={styles.followersInfo}>{followingCount}{"\n"}Following</Text>
                        <Text style={styles.followersInfo}>0{"\n"}Posts</Text>
                    </View>

                    {!followSituation && <Button onPress={follow} buttonStyle={styles.followButton} titleStyle={{fontSize: 10}} title={"Follow"}/>}
                    {followSituation && <Button onPress={unfollow} buttonStyle={styles.followButton} titleStyle={{fontSize: 10}} title={"Unfollow"}/>}
                </View>
            </View>
        )}


    // searching for a user
    const [searchVal, setSearchVal] = useState("")

    const search = () => {
        if (searchVal.length > 3 && searchVal.length < 15) {
            db.collection('usernames')
            .doc(`${searchVal.toLowerCase()}`)
            .get()
            .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
                setExists(true)
                let userData = documentSnapshot.data()
                setSearchUsername(userData.name)  // searched user's name
                setSearchedUsersUID(userData.UID) // searched user's UID    

                console.log(userData)
        } else {
            Alert.alert("User not found!")
        }});
    } else {
        Alert.alert("Username must be between 3 and 15 characters.")
    }}



    return (
        <View behavior="padding" style={styles.container}>
        <StatusBar style="light"/>
            <View style={styles.elevation}>
                <View style={styles.searchBar}>
                    <Input autoCapitalize="none" style={{color: "white", width: 250}}  selectionColor="white"  placeholder="Search by username" value={searchVal} onChangeText={(text) => setSearchVal(text)}/>
                    <Button buttonStyle={{backgroundColor: "transparent", borderRadius: 15, width: "auto", height: "auto"}} titleStyle={{fontSize: 15}} 
                            onPress={search} title={<Icon size={30} name="search" color="white" />}/>
                </View>

                {searchUsername.length > 1 ? <UserSearchProfile /> : null}

            </View>
        </View>
    )
}

export default SearchPage

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
    },
    imageNameField:{
        height: "50%",
        width: "100%",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    searchBar:{
        width: "90%",
        left: 0,
        position: "absolute",
        top: "1%",
        display: "flex",
        flexDirection: "row",
    }, 
    component: {
        width: "100%",
        height: 250,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius:20,
        display: "flex",
        justifyContent: "space-between",
        alignItems:"center",
        top: -200

    },
    userSearchProfile: {
        width: "100%",
        height: "50%",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    followersInfo: {
        color: "white",
        margin: 10,
        textAlign:"center"
      },
    elevation:{
        width: "100%",
        height: "100%",
        justifyContent: "center", alignItems: "center", 
        backgroundColor: "rgba(15,15,15,1)", //rgba(255,255,255,0.1)
        elevation: 5,
    },
    followButton: {
        width: 100,
        backgroundColor: "crimson",
    }
})
