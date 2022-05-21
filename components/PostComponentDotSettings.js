import { View, Text, StyleSheet, Animated, Button } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'

function PostComponentDotSettings ({ setShowDotSettings }){

    const scaleYanimation = useRef(new Animated.Value(0)).current
    const scaleXanimation = useRef(new Animated.Value(0)).current

    useEffect(() => {       // animation for height of the modal
        Animated.timing(scaleYanimation, {
            toValue: 150,
            duration: 500,
            useNativeDriver: false
        }).start()
    }, [])

    useEffect(() => {       // animation for width of the modal
        Animated.timing(scaleXanimation, {
            toValue:100,
            duration: 500,
            useNativeDriver: false
        }).start()
    }, [])


    function closeModal (){     // animation for closing the modal and setting showDotSettings to false
        Animated.timing(scaleYanimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start()
        Animated.timing(scaleXanimation, {
            toValue:0,
            duration: 500,
            useNativeDriver: false
        }).start()
        
        setTimeout(() => {
            setShowDotSettings(false)
        }, 500)

    }

  return (
    <Animated.View style={[styles.container,{height: scaleYanimation, width: scaleXanimation}]}>
      <Text style={{fontSize: 15}}>Edit</Text>
      <Text style={{fontSize: 15}}>Delete</Text>
      <Text style={{fontSize: 15}}>Copy Link</Text>
      <Button onPress={()=> closeModal()} title='close'/>
    </Animated.View>
  )
}

export default PostComponentDotSettings

const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 150,
        backgroundColor: 'white',
        position:'absolute',
        top:10,
        right: 10,
        borderRadius: 15,
        padding: 5,
        justifyContent:'space-evenly',
        alignItems:'center'
    
    }
})