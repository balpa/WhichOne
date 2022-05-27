import { View, Text } from 'react-native'
import React from 'react'
import SmallProfile from '../SmallProfile'

const FollowingSection = ({following}) => {
  return (
    <View>
      {following.map((followingID) => {return <SmallProfile key={followingID} userID={followingID}/>})} 
    </View> 
   )
}

export default FollowingSection