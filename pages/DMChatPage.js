import { View, Text, StyleSheet, KeyboardAvoidingView, Animated } from 'react-native'
import React, { useEffect } from 'react'
import {auth,db} from '../firebase'
import { ScrollView } from 'react-native-gesture-handler'
import { Input } from 'react-native-elements'
import { doc, onSnapshot, getDoc, setDoc, updateDoc } from "firebase/firestore";
import useKeyboardHeight from 'react-native-use-keyboard-height'
import ChatBalloon from '../components/DMComponents/ChatBalloon'

const DMChatPage = ({ route, navigation }) => {

  // TODO: Create chatting page

  const [isEmpty, setIsEmpty] = React.useState(false)
  const [messageText, setMessageText] = React.useState('')
  const [messageData, setMessageData] = React.useState(null)

  const { userID, name, userData } = route.params
  const loggedinUser = auth.currentUser

  const ref = React.useRef(null)    // try to implement this to remove delay on animation
  let keyboardHeight = useKeyboardHeight()
  let inputAnim = React.useRef(new Animated.Value(0)).current  

  useEffect(() => {          // input animation for keyboard. TODO: animations starts after keyboard fully opened. Another solution might be using keyboardavoidingview
    Animated.timing(inputAnim, {
      toValue: keyboardHeight,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [ref, keyboardHeight])

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "messages",`bw${loggedinUser.uid}and${userID}` ), (doc) => {
      setMessageData(doc.data())
  })
 }, [])

 // console.log(Object.keys(messageData.data).map(key => messageData.data[key].message))

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
      } else alert("Message must be between 1 and 150 characters")
    }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatMessagesContainer}>
        {messageData != null ? Object.keys(messageData.data).map(key => {
          if (messageData.data[key].sender === loggedinUser.uid) {
            return (
              <ChatBalloon message={messageData.data[key].message} sender={"loggedinuser"} />
            )}
          else {
            return (
              <ChatBalloon message={messageData.data[key].message} sender={"otheruser"} />
            )}
        }) : null}
      </ScrollView>
      <Animated.View style={[styles.messageInputContainer, {bottom: inputAnim}]}>
        <Input  
          ref={ref}
          placeholder="Type your message here"
          rightIcon={{ type: 'material-community', name: 'send', color: 'black', onPress: () => sendMessage()}} 
          onChangeText={(text) => setMessageText(text)}
          />
      </Animated.View>
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
    flexDirection:'column',
  },
  messageInputContainer: {
    width:'100%',
  }
})