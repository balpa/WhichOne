import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'


const EditPost = ({ postID, setIsEditPostShown }) => {
  return (
    <View style={styles.container}>
      <Text>EditPost</Text>
      <TouchableOpacity onPress={()=> setIsEditPostShown(false)}>
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EditPost

const styles = StyleSheet.create({
  container: {
    position:'absolute',
    bottom:0,
    width: '95%',
    height: '50%',
    backgroundColor: 'red'
  },
})