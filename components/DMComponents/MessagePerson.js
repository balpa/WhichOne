import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image, useWindowDimensions, Animated, Platform } from 'react-native'
import { auth, db } from "../../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function MessagePerson({ userID, color }) {

  const [shadowOptions, setShadowOptions] = React.useState({})
  const [textColorDependingOnTheme, setTextColorDependingOnTheme] = React.useState('')
  const [selectedTheme, setSelectedTheme] = React.useState('')

  const rightToLeftAnim = React.useRef(new Animated.Value(300)).current
  const leftToRightAnim = React.useRef(new Animated.Value(-300)).current

  const navigation = useNavigation()

  const loggedinUser = auth.currentUser

  const window = useWindowDimensions()    // hook to get the window dimensions

  const [followSituation, setFollowSituation] = useState(false)
  const [userIDData, setUserIDData] = useState({}) // store the user's data 
  const [image, setImage] = useState(null) // store the user's avatar

  const storage = getStorage()

  React.useEffect(async () => {      // get theme data from local storage (cache) ***HARDCODED***
    try {
      const value = await AsyncStorage.getItem('GLOBAL_THEME')
      if (value !== null) {
        setSelectedTheme(value)
        if (value == 'light') setTextColorDependingOnTheme('black')
        else setTextColorDependingOnTheme('white')
      }
    } catch (e) { console.log(e) }
  }, [])

  useEffect(() => {          // platform based shadow options
    if (Platform.OS === "android") {
      setShadowOptions({
        elevation: 0
      })
    }
    else if (Platform.OS === "ios") {
      setShadowOptions({
        shadowColor: '#171717',
        shadowOffset: { width: -1, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      })
    }
  }, [])


  getDownloadURL(ref(storage, `Users/${userID}/avatars/avatar_image`))    // get the user's avatar
    .then((url) => setImage(url))
    .catch((error) => setImage("https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png"))

  useEffect(() => {
    Animated.spring(rightToLeftAnim, {
      toValue: 0,
      friction: 7,
      tension: 40,
      useNativeDriver: false
    }).start()
    Animated.spring(leftToRightAnim, {
      toValue: 0,
      friction: 7,
      tension: 40,
      useNativeDriver: false
    }).start()
  }, [])

  // get the user's data. id is passed through component props
  useEffect(() => {
    var docRef = db.collection("useruid").doc(userID);
    docRef.get().then((doc) => {

      if (doc.exists) setUserIDData(doc.data())
      else console.log("No such document!")

    }).catch((error) => console.log("Error getting document:", error))
  }, [])



  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: window.width - 5,
      height: 70,
      backgroundColor: 'rgba(255,255,255,0)',
      paddingLeft: 10,
      paddingRight: 10,
    }}>
      <Animated.View style={[
        styles.nameAndImage,
        //{borderColor:textColorDependingOnTheme}, 
        shadowOptions,
        { transform: [{ translateX: leftToRightAnim }] }]} >
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 50 / 2,
            marginRight: 10
          }}
          source={{ uri: image }} />
        <TouchableOpacity
          onPress={() => { navigation.navigate("UserProfile", { name: `${userIDData.name}`, userID: `${userID}` }) }}>
          <Text
            style={{
              fontSize: 17,
              color: textColorDependingOnTheme,
              fontWeight: '500'
            }}
          >{userIDData.name}</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[shadowOptions, { transform: [{ translateX: rightToLeftAnim }] }]}>
        <View style={{
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 30,
          flexDirection: "row",
          borderWidth: 1,
          borderColor: 'black',
          width: 100,
          height: 50,
          backgroundColor: `#${color}`,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("DMChatPage", { userID: `${userID}`, name: `${userIDData.name}`, userData: userIDData })}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            {/* <Icon name="paper-plane" type='font-awesome' color="black" /> */}
            <Text>Message</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}


const styles = StyleSheet.create({
  nameAndImage: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 0.5,
    //borderBottomRightRadius: 30,
    //borderTopRightRadius: 10,
    paddingRight: 20,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3

  },
  followButton: {
    width: 100,
    backgroundColor: "white",
  },
  unfollowButton: {
    width: 100,
    backgroundColor: "crimson",
  }
})
