import React, { Component, useRef, useEffect } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Alert, Animated } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config'
import { Button } from 'react-native-elements'
import { useState } from 'react'
import { auth } from '../../firebase'
import { db } from '../../firebase'
import { Input } from 'react-native-elements/dist/input/Input'
import { doc, getDoc, updateDoc} from 'firebase/firestore'

function EditBio({ setIsEditBioShown }) {

    const [bioText, setBioText] = useState("") 
    const [currentBio, setCurrentBio] = useState('')

    const user = auth.currentUser

    const springAnim = useRef(new Animated.Value(1000)).current

    useEffect(() => {           // animation
        Animated.spring(springAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start()
    }, [])

    useEffect(async()=>{
        const bio = await getDoc(doc(db,'useruid',`${user.uid}`))
        .then((document)=>{
            setCurrentBio(document.data().bio)
        })
    },[])

    console.log(currentBio)
    
    const submitFunction = async() => {     // submit bio to db and close modal

        if (bioText.length < 150) {
            await updateDoc(doc(db,'useruid',`${user.uid}`), {bio: bioText}).then(()=>{Alert.alert("Bio updated")})
        }
        else if (bioText.length > 150) 
        {
            Alert.alert("Bio must be less than 150 characters")
        }
        
        closeModal()
    }

    function closeModal(){      // closing the modal with the animation reversed
        Animated.spring(springAnim, {
            toValue: 1000,
            duration: 1000,
            useNativeDriver: true,
          }).start() 
        setTimeout(() => {setIsEditBioShown(false)}, 1000)
    }



    return (
        <Animated.View style={[styles.component, {transform: [{translateY: springAnim}]}]}>
            <Text style={{marginBottom: 20, textAlign:'center', fontSize:20}}>Current bio:{'\n'} {currentBio}</Text>
            <Input placeholder="Add bio" value={bioText} onChangeText={(text) => setBioText(text)} />
            <View style={{flexDirection:'row', bottom: 10, }}>
              <Button title='Submit' onPress={submitFunction}  buttonStyle={{width: 90,height: 50,backgroundColor: "crimson",borderRadius: 20,}} />
              <Button title='Cancel' onPress={()=> closeModal()} buttonStyle={{width: 90,height: 50,backgroundColor: "crimson",borderRadius: 20,}} />

            </View>             
        </Animated.View>
    )
}

export default EditBio

const styles = StyleSheet.create({
    component: {
        position: "absolute",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: 350,
        height: 250,
        backgroundColor: "rgba(250,250,250,1)",
        marginTop: 5,
        marginBottom: 5,
        borderRadius:20,
        padding: 5,
        zIndex: 10

    }
})
