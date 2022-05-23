import { View, Text, StyleSheet, Animated } from 'react-native'
import React, {useRef, useEffect,useState} from 'react'
import { BottomSheet } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'

const CommentsModal = ({ setShowComments }) => {

    const yAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {       // animation for height of the modal (opening)
        Animated.spring(yAnim, {
            toValue: 425,
            duration: 300,
            useNativeDriver: false
        }).start()
    }, [])

    // TODO: use interpolate function for animation value based on percentage


    function closeComments(){  // animation for closing the modal and setting showComments to false 

        Animated.timing(yAnim, {              
            toValue: 0,
            duration: 300,
            useNativeDriver: false
        }).start()

        setTimeout(()=>{
            setShowComments(false)
        },500)

        console.log('works')
    }


  return (
    <Animated.View style={[styles.container, {height: yAnim}]}>
      <View style={styles.commentsSection}>
        <Text>Comments</Text>
        <Text>Comments</Text>
        <Text>Comments</Text>
        <Text>Comments</Text>
        <Text>Comments</Text>
        <Text>Comments</Text>
        <Text>Comments</Text>
      </View>
      <View style={styles.closeButtonSection}>
      <TouchableOpacity onPress={()=> closeComments()} style={styles.closeButton}>
          <Text style={{color:'black'}}>Close</Text>
      </TouchableOpacity>
      </View>      
    </Animated.View>
  )
}

export default CommentsModal


const styles = StyleSheet.create({
    container: {
        position:'absolute',
        width: "100%",
        // height: "100%",
        backgroundColor:'white',
        bottom: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 5
    },
    closeButton:{
        width: 300,
        height: 25,
        justifyContent:'center',
        alignItems:'center',
    },
    closeButtonSection: {
        position:'absolute',
        bottom: 0,
        width: "100%",
        justifyContent:'center',
        alignItems:'center',

    },
    commentsSection: {
        width: '100%',
        height: '90%',
    }
})