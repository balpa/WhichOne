import { View, Text, StyleSheet, Animated, Button, Alert } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { doc, onSnapshot, getDoc, deleteDoc, updateDoc, deleteField, arrayRemove } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { auth } from '../firebase'
import { db } from '../firebase'

function PostComponentDotSettings ({userID, setShowDotSettings, postID }){

    // INFO: deleting is not actually deleting sub-collections etc. need to do it manually if needed. security issues etc.

    const storage = getStorage()

    const scaleYanimation = useRef(new Animated.Value(0)).current
    const scaleXanimation = useRef(new Animated.Value(0)).current


    useEffect(() => {       // animation for height of the modal
        Animated.timing(scaleYanimation, {
            toValue: 150,
            duration: 500,
            useNativeDriver: false
        }).start()
    }, [])

    useEffect(() => {       // animation for width of the modal
        Animated.timing(scaleXanimation, {
            toValue:100,
            duration: 500,
            useNativeDriver: false
        }).start()
    }, [])


    function closeModal (){     // animation for closing the modal and setting showDotSettings to false
        Animated.timing(scaleYanimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start()
        Animated.timing(scaleXanimation, {
            toValue:0,
            duration: 500,
            useNativeDriver: false
        }).start()
        
        setTimeout(() => {
            setShowDotSettings(false)
        }, 500)

    }

    async function deletePost(){

        let photoCount
        const getCount = await getDoc(doc(db,"postInfo", `${postID}`))
        .then(document => photoCount = document.data().photoCount)

        await deleteDoc(doc(db,"postInfo", `${postID}`))           // delete post id from postInfo collection
        await updateDoc(doc(db,"posts", `${userID}`),{
            postID: arrayRemove(postID)
        })
        for (let i = 1; i <= photoCount; i++){
        deleteObject(ref(storage,`Users/${userID}/posts/${postID}/photo${i}`))
        }
    }

    const showDeleteConfirm = () => {
        return Alert.alert(
            "Deleted posts can not be recovered",
            "Are you sure you want to delete?",
            [
              {
                text: "Yes",
                onPress: deletePost()
                },
              {
                text: "No",
              },
            ]
          )
    }

  return (
    <Animated.View style={[styles.container,{height: scaleYanimation, width: scaleXanimation}]}>
        <TouchableOpacity>
          <Text style={{fontSize: 15}}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> showDeleteConfirm()}>
          <Text style={{fontSize: 15}}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity>
            <Text style={{fontSize: 15}}>Copy Link</Text>
        </TouchableOpacity>
      <Button onPress={()=> closeModal()} title='close'/>
    </Animated.View>
  )
}

export default PostComponentDotSettings

const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 150,
        backgroundColor: 'rgba(240,240,240,1)',
        position:'absolute',
        top:10,
        right: 10,
        borderRadius: 15,
        padding: 5,
        justifyContent:'space-evenly',
        alignItems:'center',
        borderWidth:2,
        borderColor:'black'
    
    }
})