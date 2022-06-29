import { View, Text, StyleSheet, Animated } from 'react-native'
import React, { useEffect } from 'react'
import { registerVersion } from 'firebase/app'
import { auth, db } from '../../firebase'
import { TouchableOpacity } from 'react-native-gesture-handler'

const ChatBalloon = ({ 
  message, 
  sender, 
  item, 
  color, 
  textColor, 
  otherUsersName, 
  isNameAboveBubbleEnabled,
  theme,
  textColorDependingOnTheme }) => {

  const loggedinUser = auth.currentUser

  const chatBalloonAnimation = item.sender === loggedinUser.uid ?  React.useRef(new Animated.Value(300)).current : React.useRef(new Animated.Value(-300)).current
  const username = item.sender === loggedinUser.uid ? loggedinUser.displayName : otherUsersName

  const [senderPosition, setSenderPosition] = React.useState(null)
  const [borderSettings, setBorderSettings] = React.useState({})
  const [timeForChatBalloon, setTimeForChatBalloon] = React.useState("")
  const [detailedTimeForChatBalloon, setDetailedTimeForChatBalloon] = React.useState("")
  const [showDetailedDate, setShowDetailedDate] = React.useState(false)

  function dateAdjuster(dateFromItem){        // date adjust func
    let forAdjust = new Date(dateFromItem).toString()
    let dateArray = forAdjust.split(' ')
    let detailedDate = dateArray[0] + ", " + dateArray[1] + " " + dateArray[2] + ", " + dateArray[3] + " " + dateArray[4].slice(0,5)
    setDetailedTimeForChatBalloon(detailedDate)
    setTimeForChatBalloon(dateArray[4].slice(0,5))
  }

  useEffect(() => {       // chat balloon animation with conditions
      Animated.spring(chatBalloonAnimation, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: false,
      }).start()
  }, [])

  useEffect(() => {         // on first render, run date adjuster func
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
    <Animated.View style={[
      styles.container, 
      {backgroundColor:color}, 
      borderSettings, 
      {alignSelf: senderPosition}, 
      {transform: [{translateX: chatBalloonAnimation}]}]}>
      <Text
        style={
          item.sender === loggedinUser.uid ? 
          {
            position:'absolute', 
            top: -15, 
            right: 0,
            fontSize: 7,
            fontWeight: '700',
            color: textColorDependingOnTheme
          } 
        : 
          {
            position:'absolute', 
            top:-15, 
            left: 0,
            fontSize: 7,
            fontWeight: '700',
            color:textColorDependingOnTheme
          }
          }>{isNameAboveBubbleEnabled ? username : null}</Text>
      <Text style={{
        color:textColor,
        textAlign:'center',
        fontSize:15,
        fontWeight:'600'
      }}>{item.message}</Text>
      <View style={item.sender === loggedinUser.uid ? {position:'absolute', bottom: -15, right: 0} : {position:'absolute', bottom:-15, left: 0}}>
        <TouchableOpacity 
          style={{
            width:'100%',
            height:'100%'
          }}
          onPress={() => setShowDetailedDate(!showDetailedDate)}
          >
          <Text style={{
            fontSize: 8, 
            fontWeight:'700', 
            color:textColorDependingOnTheme
            }}>{showDetailedDate == false ? timeForChatBalloon : detailedTimeForChatBalloon}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

export default ChatBalloon


const styles = StyleSheet.create({
  container: {
    padding: 10,
    maxWidth: 150,
    minHeight: 50,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 5
  },

})