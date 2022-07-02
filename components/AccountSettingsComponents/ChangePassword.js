import React, { Component, useRef, useEffect, useState } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Alert, Animated } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config'
import { Button } from 'react-native-elements'
import { auth } from '../../firebase'
import { Input } from 'react-native-elements/dist/input/Input'
import { updatePassword } from 'firebase/auth'
import { Icon } from 'react-native-elements'

function ChangePassword({ color, setIsChangePasswordShown, theme, textColorDependingOnTheme }) {

  // TODO: find a way to get current password

    const user = auth.currentUser

    // const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isMatched, setIsMatched] = useState(false)
    const [lockIcon, setLockIcon] = useState("unlock")
    const [eyeIcon, setEyeIcon] = useState("eye-slash")
    const [isPasswordShown, setIsPasswordShown] = useState(false)

    const springAnim = useRef(new Animated.Value(1000)).current

    useEffect(() => {       // password show or not
      if (eyeIcon === "eye") { setIsPasswordShown(true) }
      else { setIsPasswordShown(false) }
    }, [eyeIcon])

    useEffect(() => {       // show "password matched or does not match" message
      if (confirmPassword === newPassword && confirmPassword.length > 3) {
        setIsMatched(true)
        setLockIcon("lock")
      } else {
        setIsMatched(false)
        setLockIcon("unlock")
      }
    }, [confirmPassword,newPassword])

    useEffect(() => {           // animation
        Animated.spring(springAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start()
    }, [])
    
    function closeModal(){      // closing the modal with the animation reversed
        Animated.spring(springAnim, {
            toValue: 1000,
            duration: 1000,
            useNativeDriver: true,
          }).start() 
        setTimeout(() => {setIsChangePasswordShown(false)}, 700)
    }

    function uploadPassword(){      // might need to add or change conditions
      if (confirmPassword.length >= 6 && isMatched) {
      updatePassword(user, confirmPassword)
      .then(() => {
        Alert.alert("Password updated")
        closeModal()
      }).catch((error) => console.log(error))
    } else {
        if (confirmPassword.length < 6) Alert.alert("Password must be at least 6 characters")
        else Alert.alert("Passwords do not match")
    }
    }



    return (
        <Animated.View style={[
          styles.component, 
          theme == 'dark' ? {backgroundColor:'rgb(40,40,40)', borderColor:'white'}: {backgroundColor:'rgb(240,240,240)'}, 
          {transform: [{translateY: springAnim}]}]}>
          {/* <Input placeholder="Current password" value={currentPassword} onChangeText={(text) => setCurrentPassword(text)} /> */}
          <Input 
            {...(isPasswordShown ? {secureTextEntry: false} : {secureTextEntry: true})}
            placeholder="New password" 
            placeholderTextColor={textColorDependingOnTheme}
            style={{color:textColorDependingOnTheme}}
            labelStyle={{color:textColorDependingOnTheme}}
            selectionColor={textColorDependingOnTheme}
            label='New password'
            leftIcon={{ 
              type: 'font-awesome', 
              name: lockIcon, 
              color:textColorDependingOnTheme }}
            rightIcon={{ 
              type: 'font-awesome', 
              name: eyeIcon, 
              color:textColorDependingOnTheme, 
              onPress: () => {setEyeIcon(eyeIcon === "eye-slash" ? "eye" : "eye-slash")} }}
            value={newPassword} 
            onChangeText={(text) => setNewPassword(text)} />
          <Input 
            {...(isPasswordShown ? {secureTextEntry: false} : {secureTextEntry: true})}
            placeholder="Confirm new password" 
            placeholderTextColor={textColorDependingOnTheme}
            style={{color:textColorDependingOnTheme}}
            labelStyle={{color:textColorDependingOnTheme}}
            selectionColor={textColorDependingOnTheme}label='Confirm new password' 
            leftIcon={{ 
              type: 'font-awesome', 
              name: lockIcon,
              color:textColorDependingOnTheme }}
            rightIcon={{ 
              type: 'font-awesome', 
              name: eyeIcon, 
              color:textColorDependingOnTheme,
              onPress: () => {setEyeIcon(eyeIcon === "eye-slash" ? "eye" : "eye-slash")} }}
            value={confirmPassword} 
            onChangeText={(text) => setConfirmPassword(text)} />
          {isMatched == true ? <Text style={{color:'green'}}>Passwords match</Text> : <Text style={{color: "red"}}>Passwords do not match</Text>}
          <View style={{flexDirection: 'row',justifyContent:'space-between',width:'100%', bottom: -15}}>
            <Button titleStyle={{color:'black'}} title='Submit' onPress={()=> uploadPassword()}  
              buttonStyle={[styles.leftButton, {backgroundColor:color}]} />
            <Button titleStyle={{color:'black'}} title='Cancel' onPress={()=> closeModal()} 
              buttonStyle={[styles.rightButton, {backgroundColor:color}]} />
          </View>
        </Animated.View>
    )
}

export default ChangePassword

const styles = StyleSheet.create({
    component: {
        position: "absolute",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: 350,
        backgroundColor: "rgba(240,240,240,1)",
        borderRadius:20,
        paddingTop: 15,
        paddingBottom: 15,
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
