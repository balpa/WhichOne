import React, { Component, useRef, useEffect } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Alert, Animated, Platform } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config'
import { Button } from 'react-native-elements'
import { useState } from 'react'
import { auth } from '../../firebase'
import { Input } from 'react-native-elements/dist/input/Input'
import { Icon } from 'react-native-elements'

function ChangeName({ color, setIsChangeNameShown }) {

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
        <Animated.View style={[styles.component,{transform: [{translateY: springAnim}]}]}>
            <Text style={{marginBottom: 20, textAlign:'center', fontSize:20}}>Your name:{'\n'} {user.displayName}</Text>
            <Input 
              placeholder="Change your name" 
              label='New name'
              leftIcon={{ type: 'font-awesome', name: 'id-card' }}
              value={changedName} 
              onChangeText={(text) => setChangedName(text)} />
            <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%', bottom: -15 }}>
              <Button title='Submit' onPress={submitFunction}  buttonStyle={[styles.leftButton,{backgroundColor: color}]} />
              <Button title='Cancel' onPress={()=> closeModal()} buttonStyle={[styles.rightButton, {backgroundColor: color}]} />

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
        alignSelf:'center',
        width: 350,
        backgroundColor: "rgba(240,240,240,1)",
        borderRadius:20,
        paddingTop: 15,
        paddingBottom:15,
        zIndex: 10,
        borderColor:'black',
        borderWidth: 2

    },
    leftButton: {
      width: 150,
      height: 50,
      borderBottomLeftRadius: 17,
      borderTopRightRadius:40
    },
    rightButton: {
      width: 150,
      height: 50,
      borderTopLeftRadius: 40,
      borderBottomRightRadius:17
    }
})
