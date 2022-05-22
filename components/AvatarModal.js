import { View, Text, StyleSheet, Animated } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';

export default function AvatarModal({ changeModalStatus }) {

    const navigation = useNavigation()

    const springAnim = useRef(new Animated.Value(-400)).current


    // TODO: STYLING NOT CENTERED AutOMATICALLY
    useEffect(() => {
        Animated.spring(springAnim, {
            toValue: -45,
            duration: 1000,
            useNativeDriver: true,
          }).start()
    }, [])

  return (
    <Animated.View style={[styles.avatarModalContainer, {transform: [{translateX: springAnim}]}]}>
        <TouchableOpacity onPress={()=> navigation.navigate('Upload Avatar')}>
            <Text>Change Avatar</Text>
        </TouchableOpacity>
    </Animated.View>
  )
}


const styles = StyleSheet.create({
    avatarModalContainer: {
        bottom: 0,
        height: 40,
        width: 150,
        backgroundColor: "rgba(255,255,255,1)",
        zIndex: 10,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    }
})