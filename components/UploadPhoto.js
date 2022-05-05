import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, KeyboardAvoidingView } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config'
import { Button, Icon } from 'react-native-elements'
import { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { Input } from 'react-native-elements/dist/input/Input'
import * as ImagePicker from 'expo-image-picker';

function UploadPhoto() {

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
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
    });
    console.log(result);

    // if image is selected, set image uri to state
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


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
                <Button title="Upload" titleStyle={{color: "white", fontSize: 25}} buttonStyle={styles.createPostButtons} />
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
