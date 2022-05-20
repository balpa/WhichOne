import { View, Text, StyleSheet, Animated, Image, Button } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase'
import firebase from 'firebase/compat/app'


const UserSearchProfile = ({ image, searchUsername, followerCount, followingCount, followSituation, searchedUsersUID, loggedinUser }) => {


    const springAnim = useRef(new Animated.Value(1000)).current

    useEffect(() => {
        Animated.spring(springAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start()
    }, [])

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

    return (
        <Animated.View style={[styles.component, {transform: [{translateY: springAnim}]}]}>
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

                {!followSituation && <TouchableOpacity style={styles.followButton} onPress={follow}><Button color={'white'}  titleStyle={{fontSize: 10}} title={"Follow"}/></TouchableOpacity>}
                {followSituation && <TouchableOpacity style={styles.followButton} onPress={unfollow}><Button color={'white'}  titleStyle={{fontSize: 10}} title={"Following"}/></TouchableOpacity>}
            </View>
        </Animated.View>
    )}

export default React.memo(UserSearchProfile)

const styles = StyleSheet.create({
    imageNameField:{
        height: "50%",
        width: "100%",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
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
        borderRadius: 10,
    }
})