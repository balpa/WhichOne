import React, { Component, useRef, useEffect } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Alert, Animated } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config'
import { Button } from 'react-native-elements'
import { useState } from 'react'
import { auth } from '../../firebase'
import { Input } from 'react-native-elements/dist/input/Input'

function ChangeName({ setIsChangeNameShown }) {

    const [changedName, setChangedName] = useState("") 

    const user = auth.currentUser

    const springAnim = useRef(new Animated.Value(1000)).current

    useEffect(() => {           // animation
        Animated.spring(springAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start()
    }, [])
    
    const submitFunction = () => {

        if (changedName.length > 3 && changedName.length < 25){
            user.updateProfile({
                displayName: `${changedName}`,
              }).then(() => {
                Alert.alert("Name Changed!")
              }).catch((error) => {
                Alert.alert(error.message)
              }); 
            } 
            else if (changedName.length > 25) {
                Alert.alert("Name must be between 3 and 25 characters!")
            }
            else {
                Alert.alert("Name must be at least 3 characters long!")
            }
            setIsShown(false)
    }

    function closeModal(){      // closing the modal with the animation reversed
        Animated.spring(springAnim, {
            toValue: 1000,
            duration: 1000,
            useNativeDriver: true,
          }).start() 
        setTimeout(() => {setIsChangeNameShown(false)}, 1000)
    }



    return (
        <Animated.View style={[styles.component, {transform: [{translateY: springAnim}]}]}>
            <Text style={{marginBottom: 20, textAlign:'center', fontSize:20}}>Your name:{'\n'} {user.displayName}</Text>
            <Input placeholder="Change your name" value={changedName} onChangeText={(text) => setChangedName(text)} />
            <View style={{flexDirection:'row', bottom: 10, }}>
              <Button title='Submit' onPress={submitFunction}  buttonStyle={{width: 90,height: 50,backgroundColor: "crimson",borderRadius: 20,}} />
              <Button title='Cancel' onPress={()=> closeModal()} buttonStyle={{width: 90,height: 50,backgroundColor: "crimson",borderRadius: 20,}} />

            </View>             
        </Animated.View>
    )
}

export default ChangeName

const styles = StyleSheet.create({
    component: {
        position: "absolute",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: 350,
        height: 250,
        backgroundColor: "rgba(240,240,240,1)",
        marginTop: 5,
        marginBottom: 5,
        borderRadius:20,
        padding: 5,
        zIndex: 10,
        borderColor:'black',
        borderWidth: 2

    }
})
