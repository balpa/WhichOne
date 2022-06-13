import React from 'react'
import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet, Alert, useWindowDimensions } from 'react-native'
import { Button, Image, Input, TouchableHighlight, Icon } from "react-native-elements"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/native';
import firebase from 'firebase/app';
import { auth } from '../firebase'
import { db } from '../firebase'
import { ScrollView } from 'react-native-gesture-handler'
import PostComponent from '../components/PostComponent'
import { TouchableOpacity } from 'react-native'
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";


const UserProfile = ({ route, navigation }) => {
  
    const window = useWindowDimensions()    // hook to get the window dimensions

    const [followerCount, setFollowerCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
    const [image,setImage] = useState(null)
    const [postIDs, setPostIDs] = useState([])
    const [followSituation, setFollowSituation] = useState(false)

    const loggedinUser = auth.currentUser;
    const storage = getStorage();

    const { userID, name } = route.params  //userID and name are passed through route params

    getDownloadURL(ref(storage, `Users/${userID}/avatars/avatar_image`))
      .then((url) => {
        setImage(url) 
    })
      .catch((error) => {
        console.log(error)
    });

    // get total follower count
    const getTotalFollowerCount = onSnapshot(doc(db, "useruid", `${userID}`), (doc) => {
      setFollowerCount(doc.data().followers.length)
    })
    // get total following count
    const getTotalFollowingCount = onSnapshot(doc(db, "useruid", `${userID}`), (doc) => {
      setFollowingCount(doc.data().following.length)
    })

    useEffect(() => {       // check if the user is following or not
      if (userID !== "" || userID !== null || userID !== undefined) {
          const isFollowingSearchedUser = onSnapshot(doc(db, "useruid", `${userID}`), (doc) => {
              if (userID === loggedinUser.uid) setFollowSituation(true)
              else setFollowSituation(doc.data().followers.includes(loggedinUser.uid))
          })
          }
  }, [userID])

    // get post ids from firebase and store in array NEED POST IDS IN ARRAY LOCATED IN posts/useruid/postID
    useEffect(async() => {
      const toPostIDs = await getDoc(doc(db,"posts",`${userID}`))
      if (toPostIDs != undefined){
      setPostIDs(toPostIDs.data().postID)
      }
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
        <>
        <View style={[styles.container, {width: window.width-5}]}>
            <StatusBar style="light"></StatusBar>
            <View style={{justifyContent: "center", alignItems: "center", marginTop: 10}}>
                <Image 
                source={{uri: image}}
                style={{ width: 60, height: 60, borderRadius: 60/2, marginBottom: 15}}
                />
                <Text style={{fontWeight: "900", letterSpacing: 1, color: "black"}}>{name}</Text>
                <View style={{flexDirection: "row"}}>
                    <Text style={styles.followersInfo}>{followerCount}{"\n"}Followers</Text>
                    <Text style={styles.followersInfo}>{followingCount}{"\n"}Following</Text>
                    <Text style={styles.followersInfo}>{postIDs.length}{"\n"}Posts</Text>
                </View>
                {followSituation == true ? 
                <View 
                  style={{
                    width: 125,
                    height: 40,
                    marginTop: 10,
                    backgroundColor: 'crimson',
                    justifyContent:'center',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}>
                  <TouchableOpacity
                    style={{
                      width:'100%',
                      height: '100%',
                      justifyContent:'center',
                      alignItems: 'center',
                      }}>
                    <Text style={{color:'white'}}>Following</Text>
                  </TouchableOpacity>
                </View>
                :
                <View 
                  style={{
                    width: 125,
                    height: 40,
                    marginTop: 10,
                    backgroundColor: 'rgb(240,240,240)',
                    justifyContent:'center',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}>
                  <TouchableOpacity
                    style={{
                      width:'100%',
                      height: '100%',
                      justifyContent:'center',
                      alignItems: 'center',
                      }}>
                    <Text style={{color:'crimson'}}>Follow</Text>
                  </TouchableOpacity>
                </View>
                }
            </View>
            
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', backgroundColor: "#ffffff"  }}>
          {postIDs.length > 0 ? postIDs.reverse().map((postID, index)=>{
            return <PostComponent key={index} postID={postID} userID={userID} name={name} />}) 
          :
          <Text style={{color:'white',fontSize:20, marginTop:25}}>No Posts</Text>
          }
        </ScrollView>
          <View style={{width:'100%',height:60, justifyContent:'center', alignItems:'center'}}>
            <Image source={require("../assets/w1logocrimson.png")} style={styles.logoBottom}/>
          </View>
        </>

    )
}

export default UserProfile

const styles = StyleSheet.create({
    logoutButton: {
        marginTop: 5,
        width: 45,
        borderWidth: 0,
        backgroundColor: "transparent",
    },
    settingsButton: {
      marginTop: 5,
      width: 120,
      borderWidth: 0,
      backgroundColor: "transparent",
  },
    topLogout: {
        position: "absolute",
        alignItems: "flex-end",
        width: 100,
        right: 0,
        zIndex: 10,

    },
    topSettings: {
      position: "absolute",
      alignItems: "flex-end",
      width: 85,
      left: 0,
      zIndex: 10,

  },
    container: {
        alignSelf:'center',
        height: 210,
        backgroundColor: "#ffffff",
        overflow: "hidden",
        borderColor:'black',
        borderWidth:2,
        borderRadius:20,
    },
    followersInfo: {
      color: "black",
      margin: 5, 
      textAlign:"center"
    },
    logoBottom:{
      width: 50,
      height: 50,
      zIndex: 10,
      marginBottom:5
  },


})