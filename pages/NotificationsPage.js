import React from 'react'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Switch } from 'react-native'
import { Image, } from "react-native-elements"
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationsPage = ({ navigation }) => {

  const [selectedTheme, setSelectedTheme] = useState('')
  const [textColorDependingOnTheme, setTextColorDependingOnTheme] = useState('')
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(async () => {      // get theme data from local storage (cache) ***HARDCODED***
    try {
      const value = await AsyncStorage.getItem('GLOBAL_THEME')
      if (value !== null) {
        setSelectedTheme(value)
        if (value == 'light') setTextColorDependingOnTheme('black')
        else setTextColorDependingOnTheme('white')
      }
    } catch (e) { console.log(e) }
  }, [])

  return (
    <>
      <View
        style={[
          styles.container,
          selectedTheme == 'dark' ? { backgroundColor: 'rgb(15,15,15)' } : { backgroundColor: 'white' }
        ]}>

        <View style={styles.switchLineStyle}>
          <Text style={styles.notificationTextStyle}>
            Show message notifications
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "crimson" }}
            thumbColor={isEnabled ? "white" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setIsEnabled(!isEnabled)}
            value={isEnabled}
          />
        </View>
        <View style={styles.switchLineStyle}>
          <Text style={styles.notificationTextStyle}>
            Show post notifications
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "crimson" }}
            thumbColor={isEnabled ? "white" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setIsEnabled(!isEnabled)}
            value={isEnabled}
          />
        </View>
        <View style={styles.switchLineStyle}>
          <Text style={styles.notificationTextStyle}>
            Show bişiy notifications
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "crimson" }}
            thumbColor={isEnabled ? "white" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setIsEnabled(!isEnabled)}
            value={isEnabled}
          />
        </View>

      </View>
      <View style={styles.logoBottomContainer}>
        <Image source={require("../assets/w1logocrimson.png")} style={styles.logoBottom} />
      </View>
    </>

  )
}

export default NotificationsPage

const styles = StyleSheet.create({
  logoutButton: {
    width: 170,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "center",
    backgroundColor: "rgba(15,15,15,1)",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  switchLineStyle: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    padding: 10
  },
  logoBottom: {
    width: 50,
    height: 50,
    bottom: 0,
    zIndex: 10
  },
  logoBottomContainer: {
    position: 'absolute',
    bottom: 10,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5
  },
  notificationTextStyle: {
    fontSize: 17,
    fontWeight: '700'
  }

})