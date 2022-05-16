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


function PostComponent({ postID }){

    const [isPressed, setIsPressed] = useState(false)
    const [images, setImages] = useState([])
    const [imageCount, setImageCount] = useState(null)

    const user = auth.currentUser

    const storage = getStorage();

    const window = useWindowDimensions()    // hook to get the window dimensions

    let height4posts = (window.width*3)/4    // height of the post calculated by the width of the screen
    let height4postcontainer = ((window.width*3)/4)+50   // height of the post container calculated by the width of the screen plus the gap needed for likes comments etc. section


    // ANIMATION
    // let fadeAnim = new Animated.Value(0)
    //     Animated.timing(
    //       fadeAnim,
    //       {
    //         toValue: 1,
    //         duration: 500,
    //         useNativeDriver: true
    //       }
    //     ).start()

    
    // getting images from storage. need to add non existing image exceptions and improve this w/o for loop etc
    // photos arrangement changes on every render. need to fix this
    useEffect(async() => {

        await getDoc(doc(db,"posts",`${user.uid}`,`${postID}`,'postData'))
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
                backgroundColor: "rgba(255,255,255,0.1)",
                marginTop: 5,
                marginBottom: 5,
                padding: 5
            }}>
                <View style={{width: '100%', justifyContent:'space-between', display:'flex', flexDirection:'row'}}>
                    <Text style={{margin: 5, color:"white"}}>Berke Altıparmak</Text>
                    <Text style={{margin: 5, color:'white'}}>...</Text>
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
