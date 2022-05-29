import React, { Children, Component } from 'react'
import { useState , useEffect} from 'react'
import { Text, View, StyleSheet, ScrollView, Button, Image, Animated, useWindowDimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { doc, onSnapshot, getDoc, setDoc, arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { auth } from '../../firebase'
import { db } from '../../firebase'
import { TouchableOpacity, TapGestureHandler } from 'react-native-gesture-handler';
import LikesModal from './LikesModal';

function PostImage({url, photoNumber, postID}){

    const doubleTapRef = React.createRef()

    const scaleAnim = React.useRef(new Animated.Value(0.7)).current

    const [likes, setLikes] = useState([])
    const [userLikedThePhoto, setUserLikedThePhoto] = useState(false)
    const [showLikes, setShowLikes] = useState(false)
    const [showLikeAnimation, setShowLikeAnimation] = useState(false)

    const user = auth.currentUser

    const window = useWindowDimensions()    // hook to get the window dimensions

    let height4posts = (window.width*3)/4    // height of the post calculated by the width of the screen
    let height4postcontainer = ((window.width*3)/4)+70   // height of the post container calculated by the width of the screen plus the gap needed for likes comments etc. section

    function dislike(){
      updateDoc(doc(db,"postInfo", `${postID}`,"likes", `photo${photoNumber}`),{
        likes: arrayRemove(user.uid)
      })

    }

    async function likeFunc(){    // adds likes to db by photo number
      const getLikes = await getDoc(doc(db,"postInfo", `${postID}`,"likes", `photo${photoNumber}`))

      if (getLikes.data() != undefined && getLikes.data().likes.includes(user.uid)){    // if user already liked the photo, remove.
        dislike()
      } else {
        if (getLikes.data() != undefined){    // if likes exist, update doc
          updateDoc(doc(db,"postInfo", `${postID}`,"likes", `photo${photoNumber}`), {
            likes: arrayUnion(user.uid)
          })
        } else {                              // if likes don't exist, create doc
        await setDoc(doc(db,"postInfo", `${postID}`, "likes", `photo${photoNumber}`), {
          likes: arrayUnion(user.uid)
        })
      }
  }
    }

    function doubleTapLike(){     // double tap to like with a cool animation
      setShowLikeAnimation(true)
      likeFunc()
      Animated.spring(scaleAnim, {
        toValue: 1.5,
        friction: 5,
        useNativeDriver: true
      }).start(()=>{              // chain anmations as a callback 
        Animated.spring(scaleAnim, {
          toValue: 0,
          friction: 5,
          useNativeDriver: true
        }).start()
      })
    }

    useEffect(()=>{             // get likes from db
      onSnapshot(doc(db,"postInfo", `${postID}`, "likes", `photo${photoNumber}`), (doc)=>{
        if (doc.data() != undefined){ setLikes(doc.data().likes) }
      }) 
    },[])

    useEffect(()=>{             // check if user liked the photo
      if (likes.includes(user.uid)){ setUserLikedThePhoto(true) }
      else{ setUserLikedThePhoto(false) }
    },[likes])


    // TODO: add unlike system

    return (
      <>
        <View style={{width: window.width-10, height: height4posts, justifyContent:'center', display:'flex', flexDirection:'column'}}>
          <TapGestureHandler onActivated={()=> doubleTapLike()} numberOfTaps={2} ref={doubleTapRef}>
            <Image source={{uri: url}}  style={{width: "100%", height: height4posts}}></Image>
          </TapGestureHandler>
          {showLikeAnimation && 
            <Animated.View style={[styles.likeIconAnimation, {transform: [{scale: scaleAnim}]}]} >
              <Icon size={100} name='favorite' color='red'></Icon>
            </Animated.View>
          }
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <TouchableOpacity onPress={()=> likeFunc()}>
              <Icon name={userLikedThePhoto ? "favorite" : "favorite-border"} color={userLikedThePhoto ? "red" : "black"}></Icon>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={()=> setShowLikes(true)}>
              <Text style={{color:'black'}}>{likes.length == 1 ? `${likes.length} like` : `${likes.length} likes`}</Text>
            </TouchableOpacity>
          </View>
          {showLikes && <LikesModal setShowLikes={setShowLikes} likes={likes} />} 
        </View>
      </> 
    )
}

export default PostImage

const styles = StyleSheet.create({
  likeIconAnimation: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignSelf: 'center',

  }

})