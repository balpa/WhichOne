import { View, Text, StyleSheet, Animated } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import SmallProfile from '../SmallProfile'

function LikesModal({ setShowLikes, likes, height4postcontainer }) {

  const yAnim = useRef(new Animated.Value(0)).current
  const xAnim = useRef(new Animated.Value(0)).current


  useEffect(() => {       // animation for height of the modal
    Animated.spring(yAnim, {
      toValue: height4postcontainer - 100,
      tension: 2,
      friction: 3.5,
      useNativeDriver: false
    }).start()
  }, [])

  // useEffect(() => {       // animation for width of the modal
  //     Animated.spring(xAnim, {
  //         toValue: 400,
  //         duration: 500,
  //         useNativeDriver: false
  //     }).start()
  // }, [])

  function closeLikesModal() {     // closing the modal
    Animated.timing(yAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false
    }).start()
    // Animated.timing(xAnim, {
    //   toValue: 0,
    //   duration: 500,
    //   useNativeDriver: false
    // }).start()
    setTimeout(() => { setShowLikes(false) }, 500)
  }

  //TODO: check small profiles coloring on likes modal

  return (
    <Animated.View style={[
      styles.container,
      { height: yAnim }]}>
      <ScrollView>
        {likes && likes.map((userID, index) => {
          return (
            <SmallProfile key={index} userID={userID} />
          )
        })}
      </ScrollView>
      <View style={styles.closeButton}>
        <TouchableOpacity onPress={() => closeLikesModal()}>
          <Text style={{ color: 'black' }}>close</Text>
        </TouchableOpacity>
      </View>

    </Animated.View>
  )
}

export default LikesModal


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    width: "100%",
    height: 300,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 10,
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'rgba(0,0,0,0.25)',
    backgroundColor: 'white'
  },
  closeButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: "100%",
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }



})