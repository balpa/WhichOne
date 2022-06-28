import { View, Text } from 'react-native'
import React from 'react'
import SmallProfile from '../SmallProfile'

const FollowingSection = ({following, theme, textColor}) => {
  return (
    <View>
      {following.map((followingID) => {return <SmallProfile key={followingID} theme={theme} textColor={textColor} userID={followingID}/>})} 
    </View> 
   )
}

export default FollowingSection