import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import React, {useEffect, useState} from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase'
import { auth } from '../firebase'
import SmallProfile from '../components/SmallProfile';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FollowingSection from '../components/FollowersFollowing/FollowingSection';
import FollowerSection from '../components/FollowersFollowing/FollowerSection'


export default function FollowersFollowingPage() {

    const Tab = createMaterialTopTabNavigator()

    const user = auth.currentUser

    const [followerCount, setFollowerCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])

    const window = useWindowDimensions()    // hook to get the window dimensions

    let height4posts = (window.width*3)/4    // height of the post calculated by the width of the screen
    let height4postcontainer = ((window.width*3)/4)+50   // height of the post container calculated by the width of the screen plus the gap needed for likes comments etc. section


    // get followers and following and store in array
    useEffect(() => {
      const getFollowers = onSnapshot(doc(db, "useruid", `${user.uid}`), 
      (doc) => setFollowers(doc.data().followers))

      const getFollowing = onSnapshot(doc(db, "useruid", `${user.uid}`), 
      (doc) => setFollowing(doc.data().following))
    }, [])

    // get total follower count
    const getTotalFollowerCount = onSnapshot(doc(db, "useruid", `${user.uid}`), 
    (doc) => setFollowerCount(doc.data().followers.length))

    // get total following count
    const getTotalFollowingCount = onSnapshot(doc(db, "useruid", `${user.uid}`), 
    (doc) => setFollowingCount(doc.data().following.length))


    const globalOptions = {
      tabBarStyle: {
        backgroundColor:'white',
      },
      tabBarIndicatorStyle :{
        backgroundColor:'crimson'
      }
    }

  return (

    <Tab.Navigator screenOptions={globalOptions} >
      <Tab.Screen  style={{backgroundColor:'black'}}  name='followers' children={()=> <FollowerSection followers={followers}/>} />
      <Tab.Screen name='following' children={()=> <FollowingSection following={following}/>} />
    </Tab.Navigator>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:"center",
        justifyContent: "center",
        backgroundColor: "rgba(15,15,15,1)",
        borderWidth: 1, 
    },
})