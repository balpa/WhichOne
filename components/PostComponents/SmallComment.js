import { View, Text, StyleSheet, Animated } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'

const SmallComment = ({ comment, name, theme, textColorDependingOnTheme }) => {

  const xAnim = useRef(new Animated.Value(600)).current

  useEffect(() => {   // spring animation for comments. 
    Animated.spring(xAnim, {
      toValue: 0,
      delay: 200,
      tension: 5,
      friction: 5,
      useNativeDriver: false
    }).start()
  },[])

  //TODO: might add profile visit, avatar needed etc.
  return (
    <Animated.View style={[styles.container, {transform: [{translateX: xAnim}]}]}>
      <Text style={{fontWeight: "bold", color: textColorDependingOnTheme}}>{name}{'  '}</Text>
      <Text style={{color: textColorDependingOnTheme}}>{comment}</Text>
    </Animated.View>
  )
}

export default SmallComment

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 20,
    flexDirection: "row",
    padding: 5
  }
})