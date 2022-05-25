import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const SmallComment = ({ comment, name }) => {

  //TODO: might add profile visit, avatar needed etc.
  return (
    <View style={styles.container}>
      <Text style={{fontWeight: "bold"}}>{name}{'  '}</Text>
      <Text>{comment}</Text>
    </View>
  )
}

export default SmallComment

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 20,
    flexDirection: "row",
    padding: 5
  }
})