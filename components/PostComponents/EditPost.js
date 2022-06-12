import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const EditPost = () => {
  return (
    <View style={styles.container}>
      <Text>EditPost</Text>
    </View>
  )
}

export default EditPost

const styles = StyleSheet.create({
  container: {
    width: '95%',
    height: '50%',
    backgroundColor: 'red'
  },
})