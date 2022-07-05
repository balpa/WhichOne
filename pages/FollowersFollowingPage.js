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
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FollowersFollowingPage() {

    const Tab = createMaterialTopTabNavigator()

    const user = auth.currentUser

    const [followerCount, setFollowerCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])
    const [selectedTheme, setSelectedTheme] = useState('')
    const [textColorDependingOnTheme, setTextColorDependingOnTheme] = useState('')

    const window = useWindowDimensions()    // hook to get the window dimensions

    let height4posts = (window.width*3)/4    // height of the post calculated by the width of the screen
    let height4postcontainer = ((window.width*3)/4)+50   // height of the post container calculated by the width of the screen plus the gap needed for likes comments etc. section

    useEffect(async()=>{      // get theme data from local storage (cache) ***HARDCODED***
      try {
        const value = await AsyncStorage.getItem('GLOBAL_THEME')
        if(value !== null) {
          setSelectedTheme(value)
          if (value == 'light') setTextColorDependingOnTheme('black')
          else setTextColorDependingOnTheme('white')}
      } catch(e) {console.log(e)}
    },[])

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
        backgroundColor: selectedTheme == 'dark' ? 'rgb(15,15,15)' : 'white',
      },
      tabBarIndicatorStyle: {
        backgroundColor:'crimson'
      },
      tabBarActiveTintColor: 'crimson',
      tabBarInactiveTintColor: selectedTheme == 'dark' ? 'rgba(240,240,240,0.3)' : 'rgba(15,15,15,0.3)',
    }

    //TODO: ŞU APTAL TAB NAVIGATORDA TEXT COLOR DEĞİŞTİRMEYİ BUL

  return (

    <Tab.Navigator screenOptions={globalOptions} >
      <Tab.Screen style={{backgroundColor:'red'}}  name='followers' children={()=> <FollowerSection textColor={textColorDependingOnTheme} theme={selectedTheme} followers={followers}/>} />
      <Tab.Screen name='following' children={()=> <FollowingSection textColor={textColorDependingOnTheme} theme={selectedTheme} following={following}/>} />
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