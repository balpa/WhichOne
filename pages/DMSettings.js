import { View, Text, StyleSheet, Animated, useWindowDimensions } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import React from 'react'

const DMSettings = ({ setShowDMSettings, setChatBalloonColor, chatBalloonColor }) => {

  // TODO:  a lot to do xd

  const heightAnim = React.useRef(new Animated.Value(0)).current
  const opacityAnim = React.useRef(new Animated.Value(0)).current

  let windowHeight = useWindowDimensions().height

  React.useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: 600,
      duration: 700,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start()
  }, [])}, [])


  function applyAndClose(){
    setShowDMSettings(false) 
  }

  return (
    <Animated.View style={[styles.container, {height: heightAnim}]}>
      <Animated.View style={{opacity: opacityAnim}}>
        <View style={styles.colorSelectorContainer}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '800',
            }}>Select message bubble color</Text>
          <View style={{width:50, height:50, borderRadius:50/2, backgroundColor:chatBalloonColor}}></View>
          <Text style={{fontSize:20, fontWeight:'800'}}>^</Text>
          <View 
            style={{
              flexDirection:'row', 
              width:'80%',
              justifyContent:'space-around',
              }}>
            <View style={{width:50, height:50, borderRadius:50/2, backgroundColor:'yellow',}}></View>
            <View style={{width:50, height:50, borderRadius:50/2, backgroundColor:'brown'}}></View>
            <View style={{width:50, height:50, borderRadius:50/2, backgroundColor:'blue'}}></View>
            <View style={{width:50, height:50, borderRadius:50/2, backgroundColor:'red'}}></View>
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[{
        marginBottom: 25,
        width:'90%',
        alignSelf:'center',
      }, {opacity: opacityAnim}]}>
      <Button 
          onPress={() => applyAndClose()} 
          titleStyle={{
            color: "white", 
            fontSize: 15, 
          }} 
          buttonStyle={{
            borderRadius:15,
            backgroundColor:'crimson'
          }}
          title="Apply"/>
      </Animated.View>
    </Animated.View>
  )
}

export default DMSettings


const styles = StyleSheet.create({
  container: {
    position:'absolute',
    width:'100%',
    backgroundColor:'white',
    justifyContent:'space-between',
    borderBottomWidth:2,
    borderTopWidth:2,
  },
  colorSelectorContainer: {
    width:'100%',
    height: 225,
    flexDirection:'column',
    justifyContent:'space-around',
    alignItems:'center'
  }
})