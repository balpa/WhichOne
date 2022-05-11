import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import React, {useState} from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase'
import { auth } from '../firebase'
import SmallProfile from '../components/SmallProfile';

export default function FollowersFollowingPage() {

    const user = auth.currentUser

    const [followerCount, setFollowerCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)

    const window = useWindowDimensions()    // hook to get the window dimensions

    let height4posts = (window.width*3)/4    // height of the post calculated by the width of the screen
    let height4postcontainer = ((window.width*3)/4)+50   // height of the post container calculated by the width of the screen plus the gap needed for likes comments etc. section


    // get total follower count
    const getTotalFollowerCount = onSnapshot(doc(db, "useruid", `${user.uid}`), (doc) => {
        setFollowerCount(doc.data().followers.length)
      })
    // get total following count
    const getTotalFollowingCount = onSnapshot(doc(db, "useruid", `${user.uid}`), (doc) => {
        setFollowingCount(doc.data().following.length)
      })


  return (
    <View style={styles.container}>
    <ScrollView horizontal={true} minimumZoomScale={1} maximumZoomScale={2} pagingEnabled={true} pinchGestureEnabled={true}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', backgroundColor: "rgba(15,15,15,1)"  }}>
        <View style={{width:window.width, height:50, justifyContent:'center', backgroundColor:'rgba(255,255,255,0.05)'}}>
            <Text style={{fontSize:20, fontWeight:"bold", color:"white", textAlign:'center'}}>{followerCount}  followers</Text>
        </View>

        <SmallProfile />  

      </ScrollView>
      <ScrollView>
        <View style={{width:window.width, height:50, justifyContent:'center', backgroundColor: "rgba(255,255,255,0.1)"}}>
            <Text style={{fontSize:20, fontWeight:"bold", color:"rgba(15,15,15,1)", textAlign:'center'}}>{followingCount}  following</Text>
        </View>
      

      </ScrollView>
    </ScrollView>
    </View>
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