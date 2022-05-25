import { View, Text } from 'react-native'
import React from 'react'

const SmallComment = ({ comment }) => {
  return (
    <View>
      <Text>{comment}</Text>
    </View>
  )
}

export default SmallComment