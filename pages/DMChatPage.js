import { View, Text, StyleSheet, Animated, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { Input, Icon, Button } from 'react-native-elements'
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import useKeyboardHeight from 'react-native-use-keyboard-height'
import ChatBalloon from '../components/DMComponents/ChatBalloon'
import DMSettings from './DMSettings'
import AsyncStorage from '@react-native-async-storage/async-storage';

const DMChatPage = ({ route, navigation }) => {

  // TODO: PREVENT RE-RENDERING FOR ONSNAPSHOT LISTENER ( might be just a multiple rendering for console log not fetching data, check )

  const COLOR_PALETTE_1 = ["FAC213", "F77E21", "D61C4E", "990000", "FF5B00"]   // bright yellows cleared 

  const [isEmpty, setIsEmpty] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [messageData, setMessageData] = useState(null)
  const [whichUser, setWhichUser] = useState('')
  const [showDMSettings, setShowDMSettings] = useState(false)
  const [chatBalloonColor, setChatBalloonColor] = useState("#218AFF")
  const [textColor, setTextColor] = useState('white')
  const [isNameAboveBubbleEnabled, setIsNameAboveBubbleEnabled] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState('')
  const [textColorDependingOnTheme, setTextColorDependingOnTheme] = useState('')

  const { userID, name, userData } = route.params
  const loggedinUser = auth.currentUser

  const ref = React.useRef(null)    // try to implement this to remove delay on animation
  let keyboardHeight = useKeyboardHeight()
  let inputAnim = React.useRef(new Animated.Value(0)).current

  useEffect(async () => {      // get theme data from local storage (cache) ***HARDCODED***
    try {
      const value = await AsyncStorage.getItem('GLOBAL_THEME')
      if (value !== null) {
        setSelectedTheme(value)
        if (value == 'light') setTextColorDependingOnTheme('black')
        else setTextColorDependingOnTheme('white')
      }
    } catch (e) { console.log(e) }
  }, [])

  useEffect(() => {          // input animation for keyboard. TODO: animations starts after keyboard fully opened. Another solution might be using keyboardavoidingview
    Animated.timing(inputAnim, {
      toValue: keyboardHeight,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [ref, keyboardHeight])

  // USERID IS THE OTHER USER'S ID. (karşı kullanıcının idsi)
  useEffect(() => {     // check for message. id is converted so check both. ITS A GENIUS SOLUTION THO xd
    onSnapshot(doc(db, "messages", `bw${loggedinUser.uid}and${userID}`), (document) => {
      if (document.data() != undefined) {
        setWhichUser('loggedinuser')
        setMessageData(sorter(document.data()))
      }
      else {
        setWhichUser('otheruser')
        onSnapshot(doc(db, "messages", `bw${userID}and${loggedinUser.uid}`), (docu) => {
          if (docu.data() != undefined) { setMessageData(sorter(docu.data())) }
        })
      }
    })
  }, [])

  useEffect(async () => {      // get color data from local storage (cache) ***HARDCODED***
    try {
      const value = await AsyncStorage.getItem('chatBalloonColor')
      if (value !== null) setChatBalloonColor(value)
    } catch (e) { console.log(e) }

    try {
      const value = await AsyncStorage.getItem('chatBalloonTextColor')
      if (value !== null) setTextColor(value)
    } catch (e) { console.log(e) }

    try {
      const value = await AsyncStorage.getItem('isNameAboveBubbleEnabled')
      if (value !== null && value == 'true') setIsNameAboveBubbleEnabled(true)
      else if (value !== null && value == 'false') setIsNameAboveBubbleEnabled(false)
    } catch (e) { console.log(e) }

  }, [])

  function sorter(obj) {       // SORTING SEEMS WORKING! yuppi aq
    let objArr = Object.values(obj.data)
    let sortedArr = objArr.sort((a, b) => a.time - b.time)
    return sortedArr
  }

  async function sendMessage() {         // send message to firebase. same logic with the snapshot listener
    if (messageText.length > 0 && messageText.length < 150) {
      let date = new Date().getTime()
      let data = {
        [messageText]: {
          message: messageText,
          sender: loggedinUser.uid,
          receiver: userID,
          time: date,
        }
      }
      if (whichUser == 'loggedinuser') await setDoc(doc(db, 'messages', `bw${loggedinUser.uid}and${userID}`), { data }, { merge: true })
      else if (whichUser == 'otheruser') await setDoc(doc(db, 'messages', `bw${userID}and${loggedinUser.uid}`), { data }, { merge: true })

    } else alert("Message must be between 1 and 150 characters")
  }

  return (
    <View style={styles.container}>
      <View style={{
        borderBottomWidth: 0.2,
        borderTopWidth: 0.2,
        borderColor: 'black',
        alignItems: 'flex-end'
      }}>
        <Button
          onPress={() => { setShowDMSettings(true) }}
          titleStyle={{ color: textColorDependingOnTheme, fontSize: 15 }}
          buttonStyle={styles.settingsButton}
          title={<Icon name="settings" color={textColorDependingOnTheme} />} />
      </View>
      {messageData != null ?
        <FlatList
          data={messageData}
          renderItem={({ item }) => (
            <ChatBalloon
              item={item}
              isNameAboveBubbleEnabled={isNameAboveBubbleEnabled}
              otherUsersName={name}
              color={chatBalloonColor}
              textColor={textColor}
              textColorDependingOnTheme={textColorDependingOnTheme}
              theme={selectedTheme} />
          )}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => <Text style={styles.emptyText}>No messages yet</Text>}
        />
        : null}
      <Animated.View style={[styles.messageInputContainer, { bottom: inputAnim }]}>
        <Input
          ref={ref}
          placeholder='Message...'
          rightIcon={{ type: 'material-community', name: 'send', color: textColorDependingOnTheme, onPress: () => sendMessage() }}
          onChangeText={(text) => setMessageText(text)}
          inputStyle={{
            backgroundColor: selectedTheme == 'dark' ? 'rgb(40,40,40)' : 'white',
            borderRadius: 15,
            padding: 5,

          }}
          containerStyle={{
            backgroundColor: selectedTheme == 'dark' ? 'rgb(15,15,15)' : 'rgb(240,240,240)',
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
          textColor={textColor}
          setTextColor={setTextColor}
          setIsNameAboveBubbleEnabled={setIsNameAboveBubbleEnabled}
          theme={selectedTheme}
          textColorDependingOnTheme={textColorDependingOnTheme}
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
    width: '100%',
    height: '80%',
    flexDirection: 'column',
  },
  messageInputContainer: {
    width: '100%',
    alignContent: 'center',
    marginLeft: 5,

  },
  settingsButton: {
    marginTop: 5,
    width: 45,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
})