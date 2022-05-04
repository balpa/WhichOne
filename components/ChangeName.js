import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, KeyboardAvoidingView } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config'
import { Button } from 'react-native-elements'
import { useState } from 'react'
import { auth } from '../firebase'
import { Input } from 'react-native-elements/dist/input/Input'

function ChangeName() {

    const [changedName, setChangedName] = useState("") 

    const name = auth.currentUser;


    return (
        <KeyboardAvoidingView style={styles.component}>
            <Text style={{marginBottom: 50}}>Your name: {name.displayName}</Text>
            <Input placeholder="Change your name" value={changedName} onChangeText={(text) => setChangedName(text)} />

        </KeyboardAvoidingView>
    )
}

export default ChangeName

const styles = StyleSheet.create({
    component: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        width: 350,
        height: 400,
        backgroundColor: "rgba(250,250,250,0.9)",
        marginTop: 5,
        marginBottom: 5,
        borderRadius:20,
        padding: 5,
        zIndex: 10

    }
})
