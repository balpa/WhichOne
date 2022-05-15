import React, { Component, useMemo } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, KeyboardAvoidingView, useWindowDimensions } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config'
import { Button, Icon } from 'react-native-elements'
import { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { db } from '../firebase'
import firebase from 'firebase/compat/app'
import { Input } from 'react-native-elements/dist/input/Input'
import * as ImagePicker from 'expo-image-picker';
import { ImageBrowser } from 'expo-image-picker-multiple'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, collection, updateDoc } from "firebase/firestore"; 

function UploadPhoto() {

    const user = auth.currentUser

    const [image, setImage] = useState([])
    const [postUniqueID, setPostUniqueID] = useState(null) // unique id for each post. created using date ms

    const storage = getStorage()
    const postRef = ref(storage, `Users/${user.uid}/posts/${postUniqueID}/`) // storage'da postun yerini belirleme

    const window = useWindowDimensions()    // hook to get the window dimensions

    let height4posts = (window.width*3)/4    // height of the post calculated by the width of the screen
    let height4postcontainer = ((window.width*3)/4)+50   // height of the post container calculated by the width of the screen plus the gap needed for likes comments etc. section

    // for selecting multiple images. library not so good. need to find a better way
    const ImageBrowserComponent = () => {
      return (
        <ImageBrowser onChange={(num, onSubmit)  => {}} callback={(callback) => {}}/>
      )
    }

    // camera permissions
    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);

    // image picker from library NEED TO ADD MULTIPLE SELECTION (need another library)
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        // if image is selected, set image uri to state
        if (!result.cancelled && image.length < 5) {
          setImage(oldArray => [...oldArray,result.uri]);
        }
        else if (image.length >= 5 ) alert("You can only upload up to 5 images")
    }

    //upload image blob to firebase storage
    async function upload(){        // NEED TO MAKE IT WORK PROPERLY

      if (image){

      let uniqID = new Date().getTime() // unique id for each post. created using date ms
      setPostUniqueID(uniqID)

      await setDoc(doc(db,"posts",`${user.uid}`,`${postUniqueID}`),{
        postID: postUniqueID,
        commentCount: 0,
        likeCount: 0,
        userID: user.uid,
        userName: user.displayName,
        isPhoto1Liked: false,
        isPhoto2Liked: false,
        isPhoto3Liked: false,
        isPhoto4Liked: false,
        isPhoto5Liked: false,
      })


    // Images[imageTarget]?.map((Img) =>
    //   uploadBytes (imageRef, Img, "data_url").then(async () => {
    //     const downloadURL = await getDownloadURL(imageRef);
    //     await updateDoc(doc(db, "posts", docRef.id), {
    //       image: downloadURL,

    
      image.map(async(img, index) => {    
        const imgInside = await fetch(img)
        const imgInsideBlob = await imgInside.blob()

        uploadBytes(postRef, imgInsideBlob, "data_url")
        .then(async () => {
          const downloadURL = await getDownloadURL(postRef);
          await updateDoc(doc(db, "posts",`${user.uid}`,`${postUniqueID}`,`photo${index+1}`), {
            image: downloadURL,
          })
        })
      })         

      }
    }


    return (
        <View style={styles.component}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
            <View style={styles.addButtonIconWrapper}>
                <Icon name="collections" color="white" />
                <Button title="Add Photos" onPress={pickImage} titleStyle={{color: "white", fontSize: 25}} buttonStyle={styles.createPostButtons} />
            </View>
            <ScrollView style={styles.scrollViewStyling} horizontal={true} minimumZoomScale={1} maximumZoomScale={2} pagingEnabled={true} pinchGestureEnabled={true}>
              {image.map((img, index) => {
                return (
                <>
                  <View style={styles.imageContainer}>
                    <Image key={index} source={{uri: img}} style={{width: window.width-2, height: height4posts}} />
                    <Text style={{color:"white"}}>{`${index+1}/${image.length}`}</Text>
                  </View>
                </>
                )
                })}
            </ScrollView> 

            <View style={styles.uploadIconWrapper}>
                <Icon name="send" color="white" />
                <Button title="Upload" onPress={()=> upload()} titleStyle={{color: "white", fontSize: 25}} buttonStyle={styles.createPostButtons} />
                
            </View> 
          </View>
        </View>
    )
}

export default UploadPhoto

const styles = StyleSheet.create({
    component: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(15,15,15,1)",
        zIndex: 10
    },
      uploadIconWrapper: {
        position: "absolute",
        bottom: 0,
        height: 80,
        flexDirection: "row",
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderTopEndRadius: 25,
        borderTopStartRadius: 25

    },
      addButtonIconWrapper: {
        position: "absolute",
        top: 0,
        height: 80,
        flexDirection: "row",
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderBottomEndRadius: 25,
        borderBottomStartRadius: 25

    },

      createPostButtons: {
        borderWidth: 0,
        backgroundColor: "transparent",
        justifyContent:"flex-start",
      },
      scrollViewStyling: {
        top: "50%"
      },
      imageContainer: {
        flexDirection: "column",
        alignItems: "center",

      }

})
