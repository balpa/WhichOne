import React from 'react'
import { useEffect, useState, useRef } from 'react'
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
import AvatarModal from '../components/AvatarModal'

const ProfilePage = ({ navigation }) => {

    const [followerCount, setFollowerCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
    const [image,setImage] = useState(null)
    const [postIDs, setPostIDs] = useState([])
    const [isShown, setIsShown] = useState(false)
    const [currentBio, setCurrentBio] = useState("")

    const user = auth.currentUser;
    const storage = getStorage();

    useEffect(()=>{   // get bio from firebase
      const bio =  onSnapshot(doc(db,'useruid',`${user.uid}`), (doc) => {
        setCurrentBio(doc.data().bio)
      })
  },[])

    getDownloadURL(ref(storage, `Users/${user.uid}/avatars/avatar_image`))  // get avatar
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

    useEffect(() => {   // if logout, go back to login page
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (!authUser) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
        }
    });
    }, [])

    // get post ids from firebase and store in array NEED POST IDS IN ARRAY LOCATED IN posts/useruid/postID
    useEffect(async() => {
      const toPostIDs = await getDoc(doc(db,"posts",`${user.uid}`))
      if (toPostIDs != undefined){
      setPostIDs(toPostIDs.data().postID)
      }
    }, [])

    // useEffect(() => {    // debugging. clg milliseconds to date and reversing the postIDs array
    //   postIDs.map((x)=>{
    //     console.log(new Date(x))
    //   })
    //   setPostIDs(postIDs.reverse())
    // }, [postIDs])



    //TODO: sorting posts by date

    //TODO: change some getDoc's to onSnapshot for efficiency and realtime updates


    return (
        <>
        <View style={styles.container}>
            <StatusBar style="light"></StatusBar>
            <View style={styles.header}>
              <Button onPress={() => navigation.navigate("Settings")} titleStyle={{color: "white", fontSize: 15}} buttonStyle={styles.settingsButton}
                 title={<Icon name="settings" color="white" />}/>
              <View>
                <Text style={{fontWeight: "900", letterSpacing: 1, color: "white"}}>{user.displayName}</Text> 
              </View>
              <Button onPress={showLogoutConfirm} titleStyle={{color: "white", fontSize: 15}} buttonStyle={styles.logoutButton} 
                 title={<Icon name="logout" color="white" />}/> 
            </View>
            <View style={styles.profileTop}>
              <View style={{flexDirection:'column'}}>
                {isShown && <AvatarModal changeModalStatus={setIsShown} />}
                <TouchableOpacity onPress={()=> setIsShown(!isShown)}>
                  <Image 
                  source={{uri: image}}
                  style={{ width: 60, height: 60, borderRadius: 60/2, marginBottom: 15}}
                  />
                </TouchableOpacity>
              </View>
              <Text style={{color:'white',fontSize:15}}>{currentBio}</Text>
                <View style={{flexDirection: "row", marginTop:10}}>
                  <TouchableOpacity onPress={() => navigation.navigate("Followers-Following")}> 
                    <Text style={styles.followersInfo}>{followerCount}{" "}Followers</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate("Followers-Following")}>
                    <Text style={styles.followersInfo}>{followingCount}{" "}Following</Text>
                  </TouchableOpacity>
                  <Text style={styles.followersInfo}>{postIDs.length}{" "}Posts</Text>
                </View>
            </View>
            
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', backgroundColor: "rgba(15,15,15,1)"  }}>
          {postIDs.length > 0 ? postIDs.reverse().map((postID, index)=>{
            console.log(`postid: ${postID}, index: ${index}`)
            return <PostComponent key={`${index}`} postID={postID} />}) 
          :
          <Text style={{color:'white',fontSize:20, marginTop:25}}>No Posts</Text>
          }
          <View style={{width:'100%',height:60, justifyContent:'center', alignItems:'center'}}>
            <Image source={require("../assets/w1logowhite.png")} style={styles.logoBottom}/>
          </View>
        </ScrollView>
        </>

    )
}

export default ProfilePage

const styles = StyleSheet.create({
    logoutButton: {
        marginTop: 5,
        borderWidth: 0,
        backgroundColor: "transparent",
    },
    settingsButton: {
      marginTop: 5,
      width: 45,
      borderWidth: 0,
      backgroundColor: "transparent",
  },
    topLogout: {
        position: "absolute",
        alignItems: "flex-end",
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
        minHeight: 180,
        height: 190,
        backgroundColor: "rgba(15,15,15,1)",
        overflow: "hidden",
    },
    followersInfo: {
      color: "white",
      margin: 5, 
      textAlign:"center",
    },
    profileTop: {
      justifyContent: "flex-start", 
      alignItems: "center", 
      flexDirection: "column",
      height: 160,
      width:'100%',
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      alignItems:'center'
    },
    logoBottom:{
      width: 50,
      height: 50,
      zIndex: 10
  },


})