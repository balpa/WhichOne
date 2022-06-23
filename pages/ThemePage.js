import { View, Text, StyleSheet, Image, Animated } from 'react-native'
import { Button, Icon } from 'react-native-elements' 
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemePage = () => {

  const [selectedTheme, setSelectedTheme] = React.useState('light')

  const applyButtonAnim = React.useRef(new Animated.Value(500)).current
  const themeSectionAnim = React.useRef(new Animated.Value(-300)).current
  const arrowAnim = React.useRef(new Animated.Value(27)).current

  React.useEffect(()=>{     // apply button animation
    Animated.spring(applyButtonAnim, {
      toValue: 0,
      friction: 8,
      tension: 30,
      useNativeDriver: false
    }).start()
    Animated.spring(themeSectionAnim,{
      toValue: 0,
      friction: 8,
      tension: 30,
      useNativeDriver: false
    }).start()
  },[])

  React.useEffect(()=> {
    if (selectedTheme == 'dark') {
      Animated.spring(arrowAnim, {
        toValue: 27,
        friction: 8,
        tension: 30,
        useNativeDriver: false
      }).start()
    } else if (selectedTheme == 'light') {
      Animated.spring(arrowAnim, {
        toValue: 85,
        friction: 8,
        tension: 30,
        useNativeDriver: false
      }).start() 
    }
  },[selectedTheme])


  async function applyAndClose(){


    try {await AsyncStorage.setItem('GLOBAL_THEME', selectedTheme)} // set color data to cache storage
    catch (e) {console.log(e)}

  }

  //TODO: styling (page is too empty)

  // 27 to 85 arrow

  return (
    <>
    <View style={styles.container}>
      <Animated.View style={{transform: [{translateY: themeSectionAnim}]}}>
        <Text 
          style={{
            fontSize:20,
            fontWeight:'900',
            margin: 10,
            textAlign:'center' 
            }}>Choose theme</Text>
        <View 
          style={{
            flexDirection:'row', 
            alignItems:'center', 
            justifyContent:'center',
            backgroundColor:'crimson',
            marginTop: 20,
            paddingRight: 70,
            paddingLeft: 70,
            paddingTop:30,
            paddingBottom: 30,
            borderRadius: 15}}>
          <Animated.View 
            style={[
              {position:'absolute',
              width: 40, 
              height: 50,
              left: 0},
              {top: arrowAnim}
              ]}>
                <Icon name='play-arrow' type='material' color='white' size={40}/>
          </Animated.View>
          <View style={{flexDirection:'column'}}>
            <Button 
            onPress={()=> setSelectedTheme('dark')}
            titleStyle={{
              color: "white", 
              fontSize: 15, 
            }} 
            buttonStyle={{
              borderRadius:15,
              backgroundColor:'black',
              width: 100,
              marginBottom: 10
            }}
            title="Dark"/>
            <Button 
            onPress={()=> setSelectedTheme('light')}
            titleStyle={{
              color: "black", 
              fontSize: 15, 
            }} 
            buttonStyle={{
              borderRadius:15,
              backgroundColor:'white',
              width: 100,
              marginTop: 10
            }}
            title="Light"/>
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[
        {marginBottom: 25,
        width:'90%',
        alignSelf:'center'}, 
        {transform: [{translateY: applyButtonAnim}]}]}>
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
    </View>
      <View style={styles.logoBottomContainer}>
        <Image source={require("../assets/w1logocrimson.png")} style={styles.logoBottom}/>
      </View>
    </>
  )
}

export default ThemePage


const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent:'space-around',
    alignItems:'center'
  },
  logoBottomContainer:{
    bottom: 10,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'red'
},
  logoBottom:{
    position: 'absolute',
    width: 50,
    height: 50,
    bottom: 0,
    zIndex: 10
},
  
})