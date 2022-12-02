import { View, Text } from 'react-native'
import React from 'react'
import SmallProfile from '../SmallProfile'

const FollowingSection = ({ followers }) => {
  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      {followers.map((followerID) => { return <SmallProfile key={followerID} userID={followerID} /> })}
    </View>
  )
}

export default FollowingSection