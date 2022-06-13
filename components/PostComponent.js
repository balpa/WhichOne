import React, { Component } from 'react'
import { useState , useEffect} from 'react'
import { Text, View, StyleSheet, ScrollView, Button, Image, Animated, useWindowDimensions } from 'react-native'
import { Icon } from 'react-native-elements'
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { auth } from '../firebase'
import { db } from '../firebase'
import { TouchableOpacity } from 'react-native-gesture-handler'
import PostComponentDotSettings from './PostComponentDotSettings'
import { useNavigation } from '@react-navigation/native';
import CommentsModal from './PostComponents/CommentsModal'
import PostImage from './PostComponents/PostImage';


function PostComponent({ postID, userID, name }){

    const [isPressed, setIsPressed] = useState(false)
    const [imageCount, setImageCount] = useState(null)
    const [images, setImages] = useState([])
    const [avatar,setAvatar] = useState(null)
    const [showDotSettings, setShowDotSettings] = useState(false)
    const [postDate, setPostDate] = useState(null)
    const [showComments, setShowComments] = useState(false)


    const userIdToPass = userID != undefined ? userID : auth.currentUser.uid 
    const nameToPass = name != undefined ? name : auth.currentUser.displayName
    const storage = getStorage();

    const navigation = useNavigation()

    const window = useWindowDimensions()    // hook to get the window dimensions

    let height4posts = (window.width*3)/4    // height of the post calculated by the width of the screen
    let height4postcontainer = ((window.width*3)/4)+70   // height of the post container calculated by the width of the screen plus the gap needed for likes comments etc. section

    function dateFormatter( postDate ){     // func to return date in a readable format
        let months = {"01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June", "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"}
        if (postDate){
            let dateArray = postDate.split(".")
            let day = dateArray[0]
            let month = months[dateArray[1]]
            let year = dateArray[2].slice(0,4)
            return `${day} ${month}, ${year}`
        }
    }


    getDownloadURL(ref(storage, `Users/${userIdToPass}/avatars/avatar_image`))
      .then((url) => { setAvatar(url) })
      .catch((error) => console.log(error))

    useEffect(async()=>{
        const date = getDoc(doc(db,"postInfo", `${postID}`))
        .then((document)=> setPostDate(document.data().date))
    },[])


    
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
                width: window.width-5,
                minHeight: height4postcontainer+70,
                marginTop: 5,
                marginBottom: 5,
                padding: 5,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: '#000',

            }}>
                <View 
                    style={{
                        width: '100%', 
                        justifyContent:'space-between',
                        alignItems:'center', 
                        display:'flex', 
                        flexDirection:'row'}}>
                    <View 
                        style={{
                            width: '50%', 
                            flexDirection:'row', 
                            marginBottom:10, 
                            alignItems:'center'}}>
                        <TouchableOpacity 
                            onPress={()=>{navigation.navigate("UserProfile",{ name: `${nameToPass}`, userID: `${userIdToPass}`})}}>
                          <Image 
                            source={{uri: avatar}} 
                            style={{
                                width: 35, 
                                height: 35, 
                                borderRadius: 35/2, 
                                marginRight:10}}/>
                        </TouchableOpacity>
                      <Text 
                        style={{
                            color:"black", 
                            textAlign:'center'}}>{nameToPass}</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={()=> {setShowDotSettings(true)}} 
                        style={{marginBottom:10}}>
                        {userIdToPass == auth.currentUser.uid ?  <Icon name='more-vert' color='black' /> : null}
                    </TouchableOpacity>
                </View>
                <ScrollView 
                    contentContainerStyle={{alignItems:'center'}} 
                    horizontal={true} 
                    minimumZoomScale={1} 
                    maximumZoomScale={2} 
                    pagingEnabled={true} 
                    pinchGestureEnabled={true}>
                    {images.length > 0 && images.map((url,index) => {
                        return (
                            <PostImage key={index} arrayLength={images.length} photoNumber={index+1} url={url} postID={postID} />
                        )
                    })}
                </ScrollView>
                <View style={{width:'100%'}}>
                    <Text 
                        style={{
                            fontSize:12, 
                            fontWeight:'800'}}>
                        todo:post description
                    </Text>
                </View>
                <View 
                    style={{
                        width:'100%',
                        justifyContent:'space-between', 
                        alignItems:'center',
                        flexDirection:'row', 
                        marginLeft: 10, 
                        marginRight: 10}}>
                    <TouchableOpacity onPress={()=>{setShowComments(true)}}>
                        <Text style={{color:'black'}}>Comments</Text>
                    </TouchableOpacity>
                    <Text style={{color:'black'}}>{dateFormatter(postDate)}</Text>
                </View>
                {showDotSettings && <PostComponentDotSettings userID={userIdToPass} postID={postID} setShowDotSettings={setShowDotSettings} />}
                {showComments && <CommentsModal height4postcontainer={height4postcontainer} postID={postID} setShowComments={setShowComments}/>}
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
        backgroundColor: "white",
        marginTop: 5,
        marginBottom: 5,
        padding: 5

    }
})
