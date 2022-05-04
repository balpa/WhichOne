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
            <Text>Choose file</Text>
            <UploadPhoto />
        </View>
    )
    
}

export default CreatePost

const styles = StyleSheet.create({
    component: {
        justifyContent: "center",
        alignItems: "center",
        width: 350,
        height: 400,
        backgroundColor: "rgba(250,250,250,1)",
        marginTop: 5,
        marginBottom: 5,
        borderRadius:20,
        padding: 5,
        zIndex: 10

    }
})
