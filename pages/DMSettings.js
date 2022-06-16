import { View, Text, StyleSheet, Animated, useWindowDimensions, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Icon } from 'react-native-elements'
import React from 'react'

const DMSettings = ({ setShowDMSettings, setChatBalloonColor, chatBalloonColor }) => {

  // TODO: store chat setting local or on db to prevent color change to default on refresh
  // AsyncStorage did not work, do a research

  const COLORS = ['#218AFF','#007400', '#aeb9cc','#FC3158'] // blue, green, gray, fuschia

  const heightAnim = React.useRef(new Animated.Value(0)).current
  const opacityAnim = React.useRef(new Animated.Value(0)).current

  const [selectedColor, setSelectedColor] = React.useState(chatBalloonColor)

  let windowHeight = useWindowDimensions().height

  React.useEffect(() => {     // animations
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


  async function applyAndClose(){
    setShowDMSettings(false) 
    setChatBalloonColor(selectedColor)

    try {await AsyncStorage.setItem('chatBalloonColor', selectedColor)} // set color data to cache storage
    catch (e) {console.log(e)}

  }

  // COLOR PICKER HARDCODED

  return (
    <Animated.View style={[styles.container, {height: heightAnim}]}>
      <Animated.View style={{opacity: opacityAnim}}>
        <View style={styles.colorSelectorContainer}>
          <Text
            style={{
              fontSize: 17,
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
            <TouchableOpacity onPress={()=> setSelectedColor(COLORS[0])}>
              <View style={selectedColor == COLORS[0] ? 
              {width:50, 
                height:50, 
                borderRadius:50/2, 
                backgroundColor:COLORS[0],
                borderWidth:3
              }
              :
              {width:50, 
                height:50, 
                borderRadius:50/2, 
                backgroundColor:COLORS[0]
              }
              }></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> setSelectedColor(COLORS[1])}>
              <View style={selectedColor == COLORS[1] ?
              {width:50, 
                height:50, 
                borderRadius:50/2, 
                backgroundColor:COLORS[1],
                borderWidth:3
              }
              :
              {width:50, 
                height:50, 
                borderRadius:50/2, 
                backgroundColor:COLORS[1]
              }
              }></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> setSelectedColor(COLORS[2])}>
              <View style={selectedColor == COLORS[2] ?
              {width:50, 
                height:50, 
                borderRadius:50/2, 
                backgroundColor:COLORS[2],
                borderWidth:3
              }
              :
              {width:50, 
                height:50, 
                borderRadius:50/2, 
                backgroundColor:COLORS[2],
              }
              }></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> setSelectedColor(COLORS[3])}>
              <View style={selectedColor == COLORS[3] ?
              {width:50, 
                height:50, 
                borderRadius:50/2, 
                backgroundColor:COLORS[3],
                borderWidth:3
              }
              :
              {width:50, 
                height:50, 
                borderRadius:50/2, 
                backgroundColor:COLORS[3],
              }
              }></View>
            </TouchableOpacity>
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
  },

})