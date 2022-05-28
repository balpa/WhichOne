import React from 'react'
import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet, Alert } from 'react-native'
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

    const [followerCount, setFollowerCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
    const [image,setImage] = useState(null)
    const [postIDs, setPostIDs] = useState([])

    const user = auth.currentUser;
    const storage = getStorage();

    const { userID, name } = route.params  //userID and name are passd through route params

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

    // get post ids from firebase and store in array NEED POST IDS IN ARRAY LOCATED IN posts/useruid/postID
    useEffect(async() => {
      const toPostIDs = await getDoc(doc(db,"posts",`${userID}`))
      if (toPostIDs != undefined){
      setPostIDs(toPostIDs.data().postID)
      }
    }, [])
    console.log(postIDs)


    // TODO: ADD LIKES AND COMMENTS HERE

    return (
        <>
        <View style={styles.container}>
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
            </View>
            
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', backgroundColor: "#ffffff"  }}>
          {postIDs.length > 0 ? postIDs.map((postID, index)=>{
            return <PostComponent key={index} postID={postID} userID={userID} name={name} />}) 
          :
          <Text style={{color:'white',fontSize:20, marginTop:25}}>No Posts</Text>
          }
        </ScrollView>
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
        height: 150,
        backgroundColor: "#ffffff",
        overflow: "hidden",
    },
    followersInfo: {
      color: "black",
      margin: 5, 
      textAlign:"center"
    }


})