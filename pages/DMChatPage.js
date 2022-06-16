import { View, Text, StyleSheet, KeyboardAvoidingView, Animated, FlatList } from 'react-native'
import React, { Children, useEffect } from 'react'
import {auth,db} from '../firebase'
import { ScrollView } from 'react-native-gesture-handler'
import { Input, Icon, Button } from 'react-native-elements'
import { doc, onSnapshot, getDoc, setDoc, updateDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import useKeyboardHeight from 'react-native-use-keyboard-height'
import ChatBalloon from '../components/DMComponents/ChatBalloon'
import DMSettings from './DMSettings'

const DMChatPage = ({ route, navigation }) => {

  // TODO: PREVENT RE-RENDERING FOR ONSNAPSHOT LISTENER ( might be just a multiple rendering for console log not fetching data, check )

  // TODO: SORTING MESSAGES BY TIMESTAMP

  const COLOR_PALETTE_1 = ["FAC213", "F77E21", "D61C4E", "990000", "FF5B00"]   // bright yellows cleared 

  const [isEmpty, setIsEmpty] = React.useState(false)
  const [messageText, setMessageText] = React.useState('')
  const [messageData, setMessageData] = React.useState(null)
  const [whichUser, setWhichUser] = React.useState('')
  const [showDMSettings, setShowDMSettings] = React.useState(false)
  const [chatBalloonColor, setChatBalloonColor] = React.useState("#218AFF")

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

  // USERID IS THE OTHER USER'S ID. karşı kullanıcının idsi
  useEffect(() => {     // check for message. id is converted so check both. ITS A GENIUS SOLUTION THO xd
    onSnapshot(doc(db, "messages",`bw${loggedinUser.uid}and${userID}` ), (document) => {
      if (document.data() != undefined) { 
        setWhichUser('loggedinuser')
        setMessageData(sorter(document.data()))
      }
      else {
        setWhichUser('otheruser')
        onSnapshot(doc(db, "messages",`bw${userID}and${loggedinUser.uid}` ), (docu) => {
          if (docu.data() != undefined) {
            setMessageData(sorter(docu.data()))
          }
        })
      }
  })
 }, [])

  useEffect(()=>{
     async () => {
      try {
        const value = await AsyncStorage.getItem('chatBalloonColor')
        if(value !== null) setChatBalloonColor(value)
      } catch(e) {console.log(e)}
    }
  },[])



  function sorter(obj) {       // SORTING SEEMS WORKING! yuppi aq
    let objArr =  Object.values(obj.data)
    let sortedArr = objArr.sort((a,b) => a.time - b.time)
    return sortedArr
  }

  async function sendMessage(){         // send message to firebase. same logic with the snapshot listener

    if (messageText.length > 0 && messageText.length < 150) {

      let date = new Date().getTime()
      let data = {[messageText]: {
        message: messageText,
        sender: loggedinUser.uid,
        receiver: userID,
        time: date, 
      }}

      if (whichUser == 'loggedinuser') await setDoc(doc(db,'messages', `bw${loggedinUser.uid}and${userID}`), {data},{merge: true})
      else if (whichUser == 'otheruser') await setDoc(doc(db,'messages', `bw${userID}and${loggedinUser.uid}`), {data},{merge: true})

      } else alert("Message must be between 1 and 150 characters")
    }



  return (
    <View style={styles.container}>
      <View style={{
        borderBottomWidth: 0.2,
        borderTopWidth: 0.2,
        borderColor:'black',
        alignItems:'flex-end'
      }}>
        <Button 
          onPress={() => {setShowDMSettings(true)}} 
          titleStyle={{color: "black", fontSize: 15}} 
          buttonStyle={styles.settingsButton}
          title={<Icon name="settings" color="black" />}/>
      </View>
      {messageData != null ? 
        <FlatList 
          data={messageData} 
          renderItem={({item}) => (<ChatBalloon item={item} color={chatBalloonColor} />)} 
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => <Text style={styles.emptyText}>No messages yet</Text>}
          /> 
        : null}
      <Animated.View style={[styles.messageInputContainer, {bottom: inputAnim}]}>
        <Input  
          ref={ref}
          placeholder='Message...'
          rightIcon={{ type: 'material-community', name: 'send', color: 'black', onPress: () => sendMessage()}} 
          onChangeText={(text) => setMessageText(text)}
          inputStyle={{
            backgroundColor: 'white',
            borderRadius: 15,
            padding: 5,

          }}
          containerStyle={{
            backgroundColor: 'rgb(235,235,235)',
            height: 60
          }}
          inputContainerStyle={{
            borderBottomWidth: 0,

          }}
          />
      </Animated.View>
      {showDMSettings && 
        <DMSettings 
          setShowDMSettings={setShowDMSettings}
          setChatBalloonColor={setChatBalloonColor}
          chatBalloonColor={chatBalloonColor}
          
          />}
    </View>
  )
}

export default DMChatPage

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  chatMessagesContainer: {
    width:'100%',
    height:'80%',
    flexDirection:'column',
  },
  messageInputContainer: {
    width:'100%',
    alignContent:'center',
  },
  settingsButton: {
    marginTop: 5,
    width: 45,
    borderWidth: 0,
    backgroundColor: "transparent",
},
})