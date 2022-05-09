import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, KeyboardAvoidingView } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config'
import { Button, Icon } from 'react-native-elements'
import { useState, useEffect } from 'react'
import { auth } from '../firebase'
import firebase from 'firebase/compat/app'
import { Input } from 'react-native-elements/dist/input/Input'
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes } from "firebase/storage";

function UploadAvatar() {

    const currentUser = auth.currentUser
    const storage = getStorage()
    const avatarRef = ref(storage, `Users/${currentUser.uid}/avatars/avatar_image`) // storage'da avatarın yerini belirleme

    const [image, setImage] = useState(null);

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

    // image picker from library
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // if image is selected, set image uri to state
        if (!result.cancelled) {
            result.fileName = "avatar_image"
            setImage(result.uri);
        }
  };

  //upload image blob to firebase storage
   async function upload(){
    if (image){
        const img = await fetch(image)
        const imgblob = await img.blob()

        uploadBytes(avatarRef, imgblob).then((snapshot)=>{console.log("uploaded")})
    }}


    return (
        <View style={styles.component}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
            <View style={styles.buttonIconWrapper}>
                <Icon name="collections" color="white" />
                <Button title="Add Photos" onPress={pickImage} titleStyle={{color: "white", fontSize: 25}} buttonStyle={styles.createPostButtons} />
            </View>
                {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            <View style={styles.buttonIconWrapper}>
                <Icon name="send" color="white" />
                <Button title="Upload" onPress={upload} titleStyle={{color: "white", fontSize: 25}} buttonStyle={styles.createPostButtons} />
            </View> 
          </View>
        </View>
    )
}

export default UploadAvatar

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
    buttonIconWrapper: {
      flexDirection: "row",
      width: "50%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",

  },
  createPostButtons: {
    borderWidth: 0,
    backgroundColor: "transparent",
    justifyContent:"flex-start",
},
})
