import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { registerVersion } from 'firebase/app'

const ChatBalloon = ({ message, sender, item }) => {

  return (
    <View style={[styles.container, sender == 'loggedinuser' ? {flexGrow: 1} : {}]}>
      <Text style={{
        color:'white',
        textAlign:'center',
        fontSize:15,
        fontWeight:'600'
      }}>{item.message}</Text>
    </View>
  )
}

export default ChatBalloon


const styles = StyleSheet.create({
  container: {

    width: 100,
    minHeight: 50,
    backgroundColor:'green',
    margin: 10,
  },

})