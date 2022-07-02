import { View, Text } from 'react-native'
import React from 'react'
import SmallProfile from '../SmallProfile'

const FollowingSection = ({following, theme, textColor}) => {
  return (
    <View style={theme == 'dark' ? {height: '100%', backgroundColor:'rgb(15,15,15)'} : {height:'100%', backgroundColor:'rgb(240,240,240)'}}>
      {following.map((followingID) => {return <SmallProfile key={followingID} theme={theme} textColor={textColor} userID={followingID}/>})} 
    </View> 
   )
}

export default FollowingSection