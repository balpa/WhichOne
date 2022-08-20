import { View, Text, StyleSheet, Animated, useWindowDimensions } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';

export default function AvatarModal({ changeModalStatus }) {

    const window = useWindowDimensions();
    const navigation = useNavigation()
    const springAnim = useRef(new Animated.Value(-400)).current

    useEffect(() => {
        Animated.spring(springAnim, {
            toValue: -175,
            duration: 1000,
            useNativeDriver: true,
          }).start()
    }, [])

    return (
        <Animated.View 
            style={[
                styles.avatarModalContainer,
                {left: (window.width-window.width + 20)}, 
                {transform: [{translateX: springAnim}]}]}>
            <TouchableOpacity onPress={()=> navigation.navigate('Upload Avatar')}>
                <Text style={{textAlign:'center'}}>Change Avatar</Text>
            </TouchableOpacity>
        </Animated.View>
    )
    }


const styles = StyleSheet.create({
    avatarModalContainer: {
        bottom: 0,
        height: 100,
        width: 70,
        top:10,
        backgroundColor: "rgba(240,240,240,1)",
        zIndex: 10,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth:2,
        borderColor:'black'
    }
})