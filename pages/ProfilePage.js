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
import { doc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";


const ProfilePage = ({ navigation }) => {

    const [followerCount, setFollowerCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
    const [image,setImage] = useState(null)

    const user = auth.currentUser;
    const storage = getStorage();

    getDownloadURL(ref(storage, `Users/${user.uid}/avatars/avatar_image`))
      .then((url) => {
        setImage(url) 
    })
      .catch((error) => {
        console.log(error)
    });

    // get total follower count
    const getTotalFollowerCount = onSnapshot(doc(db, "useruid", `${user.uid}`), (doc) => {
      setFollowerCount(doc.data().followers.length)
    })
    // get total following count
    const getTotalFollowingCount = onSnapshot(doc(db, "useruid", `${user.uid}`), (doc) => {
      setFollowingCount(doc.data().following.length)
    })

    const showLogoutConfirm = () => {
    return Alert.alert(
      "Your second chance!",
      "Are you sure you want to logout?",
      [
        {
          text: "Yes",
          onPress: async () => {
            await auth.signOut()
            console.log(auth)
          },
        },
        {
          text: "No",
        },
      ]
    );
    };

    const logout = async () => {
      await auth.signOut()
      console.log(auth)
    }

    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (!authUser) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
        }
    });
    }, [])

    return (
        <>
        <View style={styles.container}>
            <StatusBar style="light"></StatusBar>
            <View style={styles.topSettings}>
                <Button onPress={() => navigation.navigate("Settings")} titleStyle={{color: "white", fontSize: 15}} buttonStyle={styles.settingsButton} title={
                  <Icon name="settings" color="white" />
                }/>
            </View>
            <View style={styles.topLogout}>
                <Button onPress={showLogoutConfirm} titleStyle={{color: "white", fontSize: 15}} buttonStyle={styles.logoutButton} title={
                  <Icon name="logout" color="white" />
                }/>
            </View>
            <View style={{justifyContent: "center", alignItems: "center", marginTop: 10}}>
                <Image 
                source={{uri: image}}
                style={{ width: 60, height: 60, borderRadius: 60/2, marginBottom: 15}}
                />
                <Text style={{fontWeight: "900", letterSpacing: 1, color: "white"}}>{user.displayName}</Text>
                <View style={{flexDirection: "row"}}>
                  <TouchableOpacity onPress={() => navigation.navigate("Followers-Following")}> 
                    <Text style={styles.followersInfo}>{followerCount}{"\n"}Followers</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate("Followers-Following")}>
                    <Text style={styles.followersInfo}>{followingCount}{"\n"}Following</Text>
                  </TouchableOpacity>
                  <Text style={styles.followersInfo}>0{"\n"}Posts</Text>
                </View>
            </View>
            
        </View>
        <View style={{height: 2, backgroundColor: "white"}}></View>
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', backgroundColor: "rgba(15,15,15,1)"  }}>
                <PostComponent />
                <PostComponent />
                <PostComponent />
                <PostComponent />
                <PostComponent />
                <PostComponent />
                <PostComponent />
        </ScrollView>
        </>

    )
}

export default ProfilePage

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
        backgroundColor: "rgba(15,15,15,1)",
        overflow: "hidden",
    },
    followersInfo: {
      color: "white",
      margin: 5, 
      textAlign:"center"
    }


})