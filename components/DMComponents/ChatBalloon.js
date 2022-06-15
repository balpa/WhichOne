import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { registerVersion } from 'firebase/app'
import { auth, db } from '../../firebase'

const ChatBalloon = ({ message, sender, item }) => {

  const loggedinUser = auth.currentUser

  const [senderPosition, setSenderPosition] = React.useState(null)
  const [timeForChatBalloon, setTimeForChatBalloon] = React.useState("")
  const [borderSettings, setBorderSettings] = React.useState({})

  function dateAdjuster(dateFromItem){
    let forAdjust = new Date(dateFromItem).toString()
    let dateArray = forAdjust.split(' ')
    setTimeForChatBalloon(dateArray[4].slice(0,5))
  }

  useEffect(() => {
    dateAdjuster(item.time)
  }, [])

  useEffect(() => {
    if (item.sender === loggedinUser.uid) {
      setSenderPosition('flex-end')
      setBorderSettings({ borderTopLeftRadius: 15, borderBottomLeftRadius: 15 })
    } else {
      setSenderPosition('flex-start')
      setBorderSettings({ borderTopRightRadius: 15, borderBottomRightRadius: 15 })
    }
  }, [])

  return (
    <View style={[styles.container, borderSettings, {alignSelf: senderPosition}]}>
      <Text style={{
        color:'white',
        textAlign:'center',
        fontSize:15,
        fontWeight:'600'
      }}>{item.message}</Text>
      <View style={{
        position:'absolute',
        bottom: -15,
        right: 0,

      }}>
        <Text style={{fontSize: 8, fontWeight:'700'}}>{timeForChatBalloon}</Text>
      </View>
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

  },

})