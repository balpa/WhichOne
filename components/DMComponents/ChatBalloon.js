import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { registerVersion } from 'firebase/app'
import { auth, db } from '../../firebase'

const ChatBalloon = ({ message, sender, item }) => {

  const loggedinUser = auth.currentUser

  const [senderPosition, setSenderPosition] = React.useState(null)

  useEffect(() => {
    if (item.sender === loggedinUser.uid) {
      setSenderPosition('flex-end')
    } else {
      setSenderPosition('flex-start')
    }
  }, [])

  return (
    <View style={[styles.container, {alignSelf: senderPosition}]}>
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
    padding: 10,
    maxWidth: 150,
    minHeight: 50,
    backgroundColor:'green',
    margin: 10,
    borderRadius:15,
  },

})