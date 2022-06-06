import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import {auth,db} from '../firebase'
import { ScrollView } from 'react-native-gesture-handler'
import { Input } from 'react-native-elements'

const DMChatPage = ({ route, navigation }) => {

  // TODO: Create chatting page

  const { userID, name, userData } = route.params
  const user = auth.currentUser

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatMessagesContainer}>
        <Text>Chatting with {name}</Text>
        <Text>Chatting with {name}</Text>
        <Text>Chatting with {name}</Text>
        <Text>Chatting with {name}</Text>
        <Text>Chatting with {name}</Text>
        <Text>Chatting with {name}</Text>
      </ScrollView>
      <View style={styles.messageInputContainer}>
        <Input  placeholder="Type your message here" />
      </View>
    </View>
  )
}

export default DMChatPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center'
  },
  chatMessagesContainer: {
    width:'100%',
    height:'80%',
  },
  messageInputContainer: {
    width:'100%',
    height:'20%',
  }
})