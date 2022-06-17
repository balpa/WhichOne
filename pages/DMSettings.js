import { View, Text, StyleSheet, Animated, useWindowDimensions, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Icon } from 'react-native-elements'
import React from 'react'

const DMSettings = ({ setShowDMSettings, setChatBalloonColor, chatBalloonColor, setTextColor, textColor }) => {

  // TODO: store chat setting local or on db to prevent color change to default on refresh
  // AsyncStorage did not work, do a research

  // spaghetti code inc

  const COLORS = ['#218AFF','#007400', '#aeb9cc','#FC3158'] // blue, green, gray, fuschia

  const heightAnim = React.useRef(new Animated.Value(0)).current
  const opacityAnim = React.useRef(new Animated.Value(0)).current

  const [selectedColor, setSelectedColor] = React.useState(chatBalloonColor)
  const [selectedTextColor, setSelectedTextColor] = React.useState(textColor)

  let windowHeight = useWindowDimensions().height

  React.useEffect(() => {     // animations
    Animated.timing(heightAnim, {
      toValue: 600,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }).start()
  }, [])}, [])


  async function applyAndClose(){

    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(()=>{
        setShowDMSettings(false)
      })})

    setChatBalloonColor(selectedColor)
    setTextColor(selectedTextColor)

    try {await AsyncStorage.setItem('chatBalloonColor', selectedColor)} // set color data to cache storage
    catch (e) {console.log(e)}

    try {await AsyncStorage.setItem('chatBalloonTextColor', selectedTextColor)} // set color data to cache storage
    catch (e) {console.log(e)}

  }
  function closeModal(){      // close modal without saving any data 
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(()=>{setShowDMSettings(false)})})
  }

  // COLOR PICKER HARDCODED

  return (
    <Animated.View style={[styles.container, {height: heightAnim}]}>
      <Animated.View style={{opacity: opacityAnim}}>
        <View style={{
          position:'absolute',
          right: 0,
          top: 0,
          zIndex:10
        }}>
          <Button 
            buttonStyle={{
              backgroundColor:'transparent',
              borderLeftWidth: 1.5,
              borderBottomWidth: 1.5,
              borderColor:'black',
              borderBottomLeftRadius: 15
            }}
            title='X' 
            titleStyle={{
              color:'black',
              fontSize: 15,
              fontWeight:'900'
            }}
            onPress={()=> closeModal()}/>
        </View>
        <View style={styles.colorSelectorContainer}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '800',
              margin: 5
            }}>Select message bubble color</Text>
          <View style={{width:100, height:50, borderRadius:10, backgroundColor:selectedColor, justifyContent:'center'}}>
            <Text style={{
              alignSelf:'center',
              color: selectedTextColor
            }}>Example text</Text>
          </View>
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
            <Text style={{
              fontSize: 15,
              fontWeight:'800',
              margin: 10
            }}>Select text color</Text>
            <View style={{flexDirection:'row', width:'50%', justifyContent:'space-evenly'}}>
              <Button 
                title='Black'
                titleStyle={{fontSize:12, fontWeight:'700', color:'black'}}
                buttonStyle={{backgroundColor:'crimson', borderRadius:7}}
                onPress={()=>setSelectedTextColor('black')}/>
              <Button 
                title='White'
                titleStyle={{fontSize:12,fontWeight:'700'}}
                buttonStyle={{backgroundColor:'crimson', borderRadius: 7}}
                onPress={()=>setSelectedTextColor('white')}/>
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
    height: 250,
    flexDirection:'column',
    justifyContent:'space-around',
    alignItems:'center'
  },

})