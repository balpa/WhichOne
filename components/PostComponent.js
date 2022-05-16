import React, { Component } from 'react'
import { useState , useEffect} from 'react'
import { Text, View, StyleSheet, ScrollView, Image, Animated, useWindowDimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { BackgroundImage } from 'react-native-elements/dist/config'
import { useSharedValue } from 'react-native-reanimated'
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { auth } from '../firebase'


function PostComponent({ postID }){

    const [isPressed, setIsPressed] = useState(false)
    const [likeColor, setLikeColor] = useState("white")
    const [images, setImages] = useState([])

    const user = auth.currentUser

    const storage = getStorage();

    const window = useWindowDimensions()    // hook to get the window dimensions

    let height4posts = (window.width*3)/4    // height of the post calculated by the width of the screen
    let height4postcontainer = ((window.width*3)/4)+50   // height of the post container calculated by the width of the screen plus the gap needed for likes comments etc. section

    // FAV BUTTON FUNCTIONALITY
    const favColor = () => { setIsPressed(!isPressed) }

    // FAV COLOR CHANGE
    useEffect(() => {
        if (isPressed) setLikeColor("red") 
        else setLikeColor("white")
    }, [favColor])

    // ANIMATION
    let fadeAnim = new Animated.Value(0)
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          }
        ).start();

    // getting images from storage. need to add non existing image exceptions and image width problems
    useEffect(() => {
        if (postID){
        for (let i = 1; i < 6; i++) {
            getDownloadURL(ref(storage, `Users/${user.uid}/posts/${postID}/photo${i}`))
            .then((url) => {
                setImages(old => [...old, url])
            })
            .catch((error) => console.log(error))
        }}
    }, [])

    


        return (
            <View style={{    // width & height set to window w/h vars. used styles w that
                justifyContent: "center",
                alignItems: "center",
                width: window.width,
                height: height4postcontainer,
                backgroundColor: "rgba(255,255,255,0.1)",
                marginTop: 5,
                marginBottom: 5,
                padding: 5
            }}>
                <ScrollView horizontal={true} minimumZoomScale={1} maximumZoomScale={2} pagingEnabled={true} pinchGestureEnabled={true}>
                    {images.length > 0 && images.map((url,index) => {
                        return <Image key={index} source={{uri : url}} style={{width: window.width, height: height4posts}}></Image>
                    })}
                </ScrollView>
                <View style={{flexDirection: "row"}}>
                    <Text style={{margin: 5, color:"white"}}>Likes</Text>
                    <Text style={{margin: 5, color:"white"}}>Comments</Text>
                    <Icon onPress={favColor} name="favorite" color={likeColor} />
                </View>
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
