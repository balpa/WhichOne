import { View, Text } from 'react-native'
import React from 'react'
import SmallProfile from '../SmallProfile'

const FollowingSection = ({followers, textColor, theme}) => {
  return (
    <View style={theme == 'dark' ? {height: '100%', backgroundColor:'rgb(15,15,15)'} : {height:'100%', backgroundColor:'rgb(240,240,240)'}}>
      {followers.map((followerID) => {return <SmallProfile textColor={textColor} theme={theme} key={followerID} userID={followerID}/>})} 
    </View> 
   )
}

export default FollowingSection