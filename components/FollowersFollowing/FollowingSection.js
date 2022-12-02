import { View } from 'react-native'
import React from 'react'
import SmallProfile from '../SmallProfile'

const FollowingSection = ({ following }) => {
  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      {following.map((followingID) => { return <SmallProfile key={followingID} userID={followingID} /> })}
    </View>
  )
}

export default FollowingSection