import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from 'react-native'
import { Button, Icon } from "react-native-elements"
import CreatePost from '../components/CreatePost'
import PostComponent from '../components/PostComponent'
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { auth } from '../firebase'
import { db } from '../firebase'


const HomePage = ({navigation}) => {

    const [dummy,setDummy] = useState(false)
    const [isShown, setIsShown] = useState(false)
    const [followingList, setFollowingList] = useState([])    
    const [postComponentList, setPostComponentList] = useState({})

    const createPostFunc = () => { setIsShown(!isShown) }


    const user = auth.currentUser


    function reloadPage(){
       setDummy(!dummy)
    }

    useEffect(() => {           // get list of people that logged in user follows for home page post display
        const getFollowingList = onSnapshot(doc(db, "useruid", `${user.uid}`), (doc) => {
            setFollowingList(doc.data().following)
          })
    }, [])

    // NEED TO FIX THIS
    useEffect(() => {
        if (followingList.length > 0) { 

            followingList.map(async(id,index) =>{

            const followingPersonsPostID = await getDoc(doc(db,"posts",`${id}`))

            // console.log(`iteration: ${index}`, `userid: ${id}`,followingPersonsPostID.data().postID)

            setPostComponentList({...postComponentList, [id]: followingPersonsPostID.data().postID})

        })}
    } , [])

   
    console.log(postComponentList)

    return (
        <View style={styles.container}>
            <StatusBar style="light"></StatusBar>
            <View style={styles.topSearch}>
                <Button onPress={() => navigation.navigate("Search")} titleStyle={{color: "white", fontSize: 15}} buttonStyle={styles.searchButton} title={
                    <Icon name="search" color="white" />
                }/>
            </View>
            <TouchableOpacity style={{width: 50, height: 50, position: "absolute"}} onPress={()=> reloadPage()}>
                <Image source={require("../assets/w1logowhite.png")}
                style={{width: 50, height: 50, position: "absolute"}}
                />
            </TouchableOpacity>
            <View style={{height: 50}}></View>
            <View style={styles.topProfile}>
                <Button onPress={ () => navigation.navigate("Profile") } titleStyle={{color: "white", fontSize: 15}} buttonStyle={styles.profileButton} title={
                    <Icon name="account-circle" color="white" />
                }/>
            </View>
            <ScrollView>
                {}
            </ScrollView>
            <View style={{position: "absolute", flex: 1, top: 150}}>
                {isShown === true ? <CreatePost /> : null}
            </View>
            <TouchableOpacity style={styles.createButton}>
                <Button onPress={()=> navigation.navigate("Create")} icon={{name: "add-to-photos"}} buttonStyle={{borderRadius:40,backgroundColor: "crimson"}} />
            </TouchableOpacity>
          
        </View>
    )
}

export default HomePage

const styles = StyleSheet.create({
    createButton:{
        backgroundColor: "crimson", 
        justifyContent:"center", 
        alignItems: "center", 
        width: 50, 
        height:50, 
        position: "absolute", 
        zIndex: 100, 
        bottom: 30, 
        right: 30,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 5,
    },
    topSearch: {
        position: "absolute",
        alignItems: "flex-end",
        width: 85,
        left: 0,
        zIndex: 10,
  
    },
    profileButton: {
        marginTop: 5,
        width: 60,    
        borderWidth: 0,
        backgroundColor: "transparent",
    },
    searchButton: {
        marginTop: 5,
        width: 110,    
        borderWidth: 0,
        backgroundColor: "transparent",
    },
    topProfile: {
        position: "absolute",
        alignItems: "flex-end",
        width: 100,
        right: 0,
        zIndex: 10,

    },
    container: {
    flex: 1,
    backgroundColor: "rgba(15,15,15,1)",
    alignItems: "center"
},
})