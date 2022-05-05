import React, { Component, useState } from 'react'
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config'
import 'firebase/compat/storage'
import ImagePicker from 'react-native-image-picker';
import UploadPhoto from './UploadPhoto';

function CreatePost () {

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);

    
    return (
        <View style={styles.component}>
            <UploadPhoto />
        </View>
    )
    
}

export default CreatePost

const styles = StyleSheet.create({
    component: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(15,15,15,1)",
        zIndex: 10

    }
})
