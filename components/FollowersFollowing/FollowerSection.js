import { View, Text } from 'react-native'
import React from 'react'
import SmallProfile from '../SmallProfile'

const FollowingSection = ({followers, textColor, theme}) => {
  return (
    <View>
      {followers.map((followerID) => {return <SmallProfile textColor={textColor} theme={theme} key={followerID} userID={followerID}/>})} 
    </View> 
   )
}

export default FollowingSection