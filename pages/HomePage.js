import React, { useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from 'react-native'
import { Button, Icon } from "react-native-elements"
import CreatePost from '../components/CreatePost'
import PostComponent from '../components/PostComponent'
import { doc, onSnapshot,get, getDoc, getDocs, query, where, collection, querySnapshot } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { auth } from '../firebase'
import { db } from '../firebase'
import { set } from 'react-native-reanimated'
import { async } from '@firebase/util'


const HomePage = ({navigation}) => {


    const [dummy,setDummy] = useState(false)
    const [isShown, setIsShown] = useState(false)
    const [followingList, setFollowingList] = useState([])    
    const [postComponentList, setPostComponentList] = useState({})
    const [components, setComponents] = useState([])
    const [allPostsFromFollowing, setAllPostsFromFollowing] = useState([])

    const createPostFunc = () => { setIsShown(!isShown) }

    const user = auth.currentUser

    //  console.log("render and following list:  ", followingList)

    function reloadPage(){      //page reload dummy func
       setDummy(!dummy)
    }

    useEffect(async() => {           // get list of people that logged in user follows for home page post display
        const getFollowingList = await getDoc(doc(db, "useruid", `${user.uid}`))
            .then((doc) => setFollowingList(doc.data().following))
    }, [])

    useEffect(async () => {
        if (allPostsFromFollowing.length != 0) {
            allPostsFromFollowing.map(async(postID,index) => {
                const getPostData = await getDoc(doc(db,'postInfo',`${postID}`))
                if (getPostData.exists){
                    setComponents(old=> [...old, <PostComponent key={index} postID={postID} userID={getPostData.data().userID} name={getPostData.data().name} />])
                }})}
    } , [])

    useEffect(async()=>{ 
        await getDoc(doc(db, "useruid", `${user.uid}`)).then((document) => {
        setFollowingList(document.data().following)     // DOESN'T SET THE ARRAY. IT PASSES HERE
    })
    }, [])



    async function setPosts(){
        console.log("setPosts worked 2222222")

        // console.log("useEffect running: ", allPostsFromFollowing)
        if (allPostsFromFollowing.length == 0 && followingList.length > 0) { 
        // console.log("first if read")
            followingList.map(async(id,index) =>{
                const followingPersonsPostID = await getDoc(doc(db,"posts",`${id}`))
        // console.log("followingpersonspostid read")

            if (followingPersonsPostID.exists){
        // console.log("followingpersonspostid exists read")
                followingPersonsPostID.data().postID.map((item,index) => {
        // console.log("followingpersonspostid.data.postid.map read")
                    if (allPostsFromFollowing.includes(item) === false) setAllPostsFromFollowing(old => [...old, item])
                })}
        })}
    }
    async function createComponent(){
        console.log("createComponent worked 3333333")
        // console.log("createComponent running: ", components)
        if (allPostsFromFollowing.length != 0) {
            allPostsFromFollowing.map(async(postID,index) => {
            const getPostData = await getDoc(doc(db,'postInfo',`${postID}`))
                if (getPostData.exists){
                    setComponents(old=> [...old, <PostComponent key={index} postID={postID} userID={getPostData.data().userID} name={getPostData.data().name} />])
                }})} 
    }

    useEffect(() => {
       setPosts().then(() => createComponent())
    }, [])

    // useEffect(async() => {           // take following list and get all post id's from each user and store in array to fetch them all 

    //     // TODO: at first render, it doesn't run this useEffect. CHECK
    //     // at second render, it runs 1-2-3 clg's. meaning second if statement not running. CHECK

    //     // followingList and allPostsFromFollowing abre empty at first render.

    //     console.log("useEffect running: ", allPostsFromFollowing)
    //     if (allPostsFromFollowing.length == 0 && followingList.length > 0) { 
    //         console.log("first if read")
    //         followingList.map(async(id,index) =>{
    //             console.log("followinglist.map read")
    //         const followingPersonsPostID = await getDoc(doc(db,"posts",`${id}`))
    //         console.log("followingpersonspostid read")

    //         if (followingPersonsPostID.exists){
    //             console.log("followingpersonspostid exists read")
    //             followingPersonsPostID.data().postID.map((item,index) => {
    //                 console.log("followingpersonspostid.data.postid.map read")
    //                 if (allPostsFromFollowing.includes(item) === false) setAllPostsFromFollowing(old => [...old, item])
    //             })
    //         }
    //     })}
    //     if (allPostsFromFollowing.length != 0) {
    //         allPostsFromFollowing.map(async(postID,index) => {
    //         const getPostData = await getDoc(doc(db,'postInfo',`${postID}`))
    //             if (getPostData.exists){
    //                 setComponents(old=> [...old, <PostComponent key={index} postID={postID} userID={getPostData.data().userID} name={getPostData.data().name} />])
    //             }})}
    // },[])


    // TODO: needs re-rendering to show posts and after re-rendering again, 
    // it shows the same posts again. FIX

    // SOLUTION MIGHT BE COLLECTING ALL OF THE useEffect's in one

    
    // console.log("allpostsfromfollowing => ",allPostsFromFollowing) // THIS NOT GETTING ON FIRST RENDER


    // TODO: use FlatList instead of ScrollView
    
    return (
        <View style={styles.container}>
            <StatusBar style="light"></StatusBar>
            <View style={styles.topSearch}>
                <Button onPress={() => navigation.navigate("Search")} titleStyle={{color: "white", fontSize: 15}} buttonStyle={styles.searchButton} title={
                    <Icon name="search" color="black" />
                }/>
            </View>
            <TouchableOpacity style={{width: 50, height: 50, position: "absolute"}} onPress={()=> reloadPage()}>
                <Image source={require("../assets/w1logocrimson.png")}
                style={{width: 50, height: 50, position: "absolute"}}
                />
            </TouchableOpacity>
            <View style={{height: 50}}></View>
            <View style={styles.topProfile}>
                <Button onPress={ () => navigation.navigate("Profile") } titleStyle={{color: "white", fontSize: 15}} buttonStyle={styles.profileButton} title={
                    <Icon name="account-circle" color="black" />
                }/>
            </View>
            <ScrollView>
                {components.reverse()}
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
    backgroundColor: "#ffffff",
    alignItems: "center"
},
})