import { View, Text, StyleSheet, Image, Animated } from 'react-native'
import { Button } from 'react-native-elements' 
import React from 'react'

const ThemePage = () => {

  const applyButtonAnim = React.useRef(new Animated.Value(500)).current
  const themeSectionAnim = React.useRef(new Animated.Value(-300)).current

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


  function applyAndClose(){


  }

  //TODO: styling (page is too empty)

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
            paddingRight: 70,
            paddingLeft: 70,
            paddingTop:30,
            paddingBottom: 30,
            borderRadius: 15}}>
          <Button 
          titleStyle={{
            color: "white", 
            fontSize: 15, 
          }} 
          buttonStyle={{
            borderRadius:15,
            backgroundColor:'black',
            marginRight: 10
          }}
          title="Dark"/>
          <Button 
          titleStyle={{
            color: "black", 
            fontSize: 15, 
          }} 
          buttonStyle={{
            borderRadius:15,
            backgroundColor:'white',
            marginLeft:10
          }}
          title="Light"/>
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