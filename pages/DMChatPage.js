import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import {auth,db} from '../firebase'
import { ScrollView } from 'react-native-gesture-handler'
import { Input } from 'react-native-elements'
import { doc, onSnapshot, getDoc, setDoc, updateDoc } from "firebase/firestore";

const DMChatPage = ({ route, navigation }) => {

  // TODO: Create chatting page

  const [isEmpty, setIsEmpty] = React.useState(false)
  const [messageText, setMessageText] = React.useState('')

  const { userID, name, userData } = route.params
  const loggedinUser = auth.currentUser

  async function sendMessage(){

    if (messageText.length > 0 && messageText.length < 150) {
      let date = new Date().toLocaleString()
      let data = {[messageText]: {
        message: messageText,
        sender: loggedinUser.uid,
        receiver: userID,
        timestamp: date, 
      }}
        await setDoc(doc(db,'messages', `bw${loggedinUser.uid}and${userID}`), {data},{merge: true})
      } else {
          alert("Message must be between 1 and 150 characters")
      }
    }

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
        <Input  
          placeholder="Type your message here"
          rightIcon={{ type: 'material-community', name: 'send', color: 'black', onPress: () => sendMessage()}} 
          onChangeText={(text) => setMessageText(text)}
          />
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