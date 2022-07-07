import { View, Text, StyleSheet, Animated, Button, Alert } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { doc, onSnapshot, getDoc, deleteDoc, updateDoc, deleteField, arrayRemove } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { auth } from '../firebase'
import { db } from '../firebase'
import EditPost from './PostComponents/EditPost';

function PostComponentDotSettings ({userID, setShowDotSettings, postID, theme, textColorDependingOnTheme }){

    // INFO: deleting is not actually deleting sub-collections etc. need to do it manually if needed. security issues etc.

    const [isEditPostShown, setIsEditPostShown] = useState(false)

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

    function showDeleteConfirm(){
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

    function showEditPost(){
        setIsEditPostShown(true)
    }

    // TODO: whenever click for an edit menu, expand the window and change component inside

  return (
    <>
    <Animated.View style={[
        styles.container,
        theme == 'dark' ? {backgroundColor: 'rgb(40,40,40)', borderColor:'rgba(255,255,255,0.3)'} : {backgroundColor: 'rgb(240,240,240)'},
        {height: scaleYanimation, width: scaleXanimation}]}>
        <TouchableOpacity onPress={()=> showEditPost()}>
          <Text style={{fontSize: 15, color:textColorDependingOnTheme}}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> showDeleteConfirm()}>
          <Text style={{fontSize: 15, color: textColorDependingOnTheme}}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity>
            <Text style={{fontSize: 15, color: textColorDependingOnTheme}}>Copy Link?</Text>
        </TouchableOpacity>
      <Button onPress={()=> closeModal()} title='close'/>
    </Animated.View>
    {isEditPostShown && <EditPost postID={postID} setIsEditPostShown={setIsEditPostShown}/>}
    </>
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