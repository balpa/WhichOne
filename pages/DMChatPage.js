import { View, Text } from 'react-native'
import React from 'react'
import {auth,db} from '../firebase'

const DMChatPage = ({ route, navigation }) => {

  // TODO: Create chatting page

  const { userID, name, userData } = route.params
  const user = auth.currentUser

  return (
    <View>
      <Text>DMChatPage</Text>
    </View>
  )
}

export default DMChatPage