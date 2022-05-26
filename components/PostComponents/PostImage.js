import React, { Children, Component } from 'react'
import { useState , useEffect} from 'react'
import { Text, View, StyleSheet, ScrollView, Button, Image, Animated, useWindowDimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { doc, onSnapshot, getDoc, setDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { auth } from '../../firebase'
import { db } from '../../firebase'
import { TouchableOpacity } from 'react-native-gesture-handler';
import LikesModal from './LikesModal';

function PostImage({url, photoNumber, postID}){

    const [likes, setLikes] = useState([])
    const [userLikedThePhoto, setUserLikedThePhoto] = useState(false)
    const [showLikes, setShowLikes] = useState(false)

    const user = auth.currentUser

    const window = useWindowDimensions()    // hook to get the window dimensions

    let height4posts = (window.width*3)/4    // height of the post calculated by the width of the screen
    let height4postcontainer = ((window.width*3)/4)+70   // height of the post container calculated by the width of the screen plus the gap needed for likes comments etc. section

    async function likeFunc(){    // adds likes to db by photo number
      const getLikes = await getDoc(doc(db,"postInfo", `${postID}`,"likes", `photo${photoNumber}`))
      if (getLikes.data() != undefined){    // if likes exist, update doc
        updateDoc(doc(db,"postInfo", `${postID}`,"likes", `photo${photoNumber}`), {
          likes: arrayUnion(user.uid)
        })
      } else{                              // if likes don't exist, create doc
      await setDoc(doc(db,"postInfo", `${postID}`, "likes", `photo${photoNumber}`), {
        likes: arrayUnion(user.uid)
      })
    }
    }


    useEffect(()=>{             // get likes from db
      onSnapshot(doc(db,"postInfo", `${postID}`, "likes", `photo${photoNumber}`), (doc)=>{
        if (doc.data() != undefined){ setLikes(doc.data().likes) }
      }) 
    },[])

    useEffect(()=>{             // check if user liked the photo
      if (likes.includes(user.uid)){ setUserLikedThePhoto(true) }
    },[likes])


    // TODO: add unlike system

    return (
      <>
        <View style={{width: window.width-10, height: height4posts, justifyContent:'center', display:'flex', flexDirection:'column'}}>
          <Image source={{uri: url}}  style={{width: "100%", height: height4posts}}></Image>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <TouchableOpacity onPress={()=> likeFunc()}>
              <Icon name={userLikedThePhoto ? "favorite" : "favorite-border"} color={userLikedThePhoto ? "red" : "white"}></Icon>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> setShowLikes(true)}>
              <Text style={{color:'white'}}>{likes.length == 1 ? `${likes.length} like` : `${likes.length} likes`}</Text>
            </TouchableOpacity>
          </View>
          {showLikes && <LikesModal setShowLikes={setShowLikes} likes={likes} />} 
        </View>
      </> 
    )
}

export default PostImage