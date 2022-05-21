import React, { Component } from 'react'
import { useState , useEffect} from 'react'
import { Text, View, StyleSheet, ScrollView, Button, Image, Animated, useWindowDimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { BackgroundImage } from 'react-native-elements/dist/config'
import { useSharedValue } from 'react-native-reanimated'
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { auth } from '../firebase'
import { db } from '../firebase'
import { TouchableOpacity } from 'react-native-gesture-handler'
import PostComponentDotSettings from './PostComponentDotSettings'


function PostComponent({ postID, userID, name }){

    const [isPressed, setIsPressed] = useState(false)
    const [images, setImages] = useState([])
    const [imageCount, setImageCount] = useState(null)
    const [avatar,setAvatar] = useState(null)
    const [showDotSettings, setShowDotSettings] = useState(false)

    const userIdToPass = userID != undefined ? userID : auth.currentUser.uid 
    const nameToPass = name != undefined ? name : auth.currentUser.displayName
    const storage = getStorage();

    const window = useWindowDimensions()    // hook to get the window dimensions

    let height4posts = (window.width*3)/4    // height of the post calculated by the width of the screen
    let height4postcontainer = ((window.width*3)/4)+50   // height of the post container calculated by the width of the screen plus the gap needed for likes comments etc. section

    getDownloadURL(ref(storage, `Users/${userIdToPass}/avatars/avatar_image`))
      .then((url) => {
        setAvatar(url) 
    })
      .catch((error) => {
        console.log(error)
    });


    // console.log("postid",postID)
    // console.log("userid", userID)

    
    // getting images from storage. need to add non existing image exceptions and improve this w/o for loop etc
    useEffect(async() => {

        await getDoc(doc(db,"posts",`${userIdToPass}`,`${postID}`,'postData'))
            .then(doc => {
                if (doc.exists) setImages(doc.data().imageURLs)
                else console.log('no doc')
            })
    }, [])

    // ****************
    // NEED TO ADD WHO POSTED, DATE, COMMENTS, LIKES, SHARE, DELETE, EDIT, FAV BUTTONS
    // ****************

        return (
            <View style={{    // width & height set to window w/h vars. used styles w that
                justifyContent: "center",
                alignItems: "center",
                width: window.width,
                height: height4postcontainer+50,
                marginTop: 5,
                marginBottom: 5,
                padding: 5,
                borderStyle:'solid',
                borderWidth: 0.25,
                borderBottomColor: 'white',
                borderTopColor: 'white',
            }}>
                <View style={{width: '100%', justifyContent:'space-between',alignItems:'center', display:'flex', flexDirection:'row'}}>
                    <View style={{width: '50%', flexDirection:'row', marginBottom:10, alignItems:'center'}}>
                        <Image source={{uri: avatar}} style={{width: 35, height: 35, borderRadius: 35/2, marginRight:10}}/>
                        <Text style={{color:"white", textAlign:'center'}}>{nameToPass}</Text>
                    </View>
                    <TouchableOpacity onPress={()=> {setShowDotSettings(true)}} style={{marginBottom:10}}>
                        <Icon name='more-vert' color='white' />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{alignItems:'center'}} horizontal={true} minimumZoomScale={1} maximumZoomScale={2} pagingEnabled={true} pinchGestureEnabled={true}>
                    {images.length > 0 && images.map((url,index) => {
                        return (
                        <>
                        <View style={{width: window.width-10, height: height4posts, justifyContent:'center', display:'flex', flexDirection:'column'}}>
                            <Image key={index} source={{uri : url}} style={{width: "100%", height: height4posts}}></Image>
                            <Button buttonStyle={{width:50, height: 20}} titleStyle={{color: "white", fontSize: 15}} title='like'/>
                        </View>
                        </>
                        )
                    })}
                </ScrollView>
                <View style={{flexDirection: "row"}}>
                    <Text style={{margin: 5, color:"white"}}>Likes</Text>
                    <Text style={{margin: 5, color:"white"}}>Comments</Text>
                </View>
                {showDotSettings && <PostComponentDotSettings setShowDotSettings={setShowDotSettings} />}
            </View>
        )
}

export default PostComponent

const styles = StyleSheet.create({
    component: {
        justifyContent: "center",
        alignItems: "center",
        // width: window.width,
        // height: 400,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginTop: 5,
        marginBottom: 5,
        padding: 5

    }
})
