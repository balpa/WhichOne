import React, { Children, Component } from 'react'
import { useState , useEffect} from 'react'
import { Text, View, StyleSheet, ScrollView, Button, Image, Animated, useWindowDimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { doc, onSnapshot, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { auth } from '../../firebase'
import { db } from '../../firebase'
import { TouchableOpacity } from 'react-native-gesture-handler';

function PostImage({url, photoNumber, postID}){

    const [likes, setLikes] = useState([])

    const user = auth.currentUser

    const window = useWindowDimensions()    // hook to get the window dimensions

    let height4posts = (window.width*3)/4    // height of the post calculated by the width of the screen
    let height4postcontainer = ((window.width*3)/4)+70   // height of the post container calculated by the width of the screen plus the gap needed for likes comments etc. section

    async function likeFunc(){    // adds likes to db by photo number
      await setDoc(doc(db,"postInfo", `${postID}`, "likes", `photo${photoNumber}`), {
        [user.uid]: true
      },{ merge: true })
    }

    useEffect(async()=>{         // gets likes from db by photo number (NOT WORKING)
      await getDoc(doc(db,"postInfo", `${postID}`, "likes", `photo${photoNumber}`)) 
      .then((document)=> {
        Object.keys(document.data()).forEach(key => {
          console.log("TODO")
      })
    })},[])

    console.log(likes)
    return (
      <>
        <View style={{width: window.width-10, height: height4posts, justifyContent:'center', display:'flex', flexDirection:'column'}}>
          <Image source={{uri: url}}  style={{width: "100%", height: height4posts}}></Image>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <TouchableOpacity onPress={()=> likeFunc()}>
              <Icon name="favorite-border" color='white'></Icon>
            </TouchableOpacity>
            <Text style={{color:'white'}}></Text>
          </View> 
        </View>
      </> 
    )
}

export default PostImage