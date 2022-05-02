import React, { Component } from 'react'
import { useState , useEffect} from 'react'
import { Text, View, StyleSheet, ScrollView, Image, Animated } from 'react-native'
import { Icon } from 'react-native-elements'
import { BackgroundImage } from 'react-native-elements/dist/config'
import { useSharedValue } from 'react-native-reanimated'

function ProfileRecentPosts(){

    const [isPressed, setIsPressed] = useState(false)
    const [likeColor, setLikeColor] = useState("black")

    // FAV BUTTON FUNCTIONALITY
    const favColor = () => {
        setIsPressed(!isPressed)
    }

    // FAV COLOR CHANGE
    useEffect(() => {
        if (isPressed) {
            setLikeColor("red")
        } else {
            setLikeColor("black")
        }

    }, [favColor])

    // ANIMATION
    let fadeAnim = new Animated.Value(0)
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          }
        ).start();


        return (
            <View style={styles.component}>
                <ScrollView horizontal={true} minimumZoomScale={1} maximumZoomScale={2}>
                    <Image source={require("../assets/1.jpg")} style={{borderRadius: 20, width: 100, height: 100, margin: 5}}></Image>
                    <Image source={require("../assets/2.jpg")} style={{borderRadius: 20,width: 100, height: 100, margin: 5}}></Image>
                    <Image source={require("../assets/3.jpg")} style={{borderRadius: 20,width: 100, height: 100, margin: 5}}></Image>
                    <Image source={require("../assets/1.jpg")} style={{borderRadius: 20,width: 100, height: 100, margin: 5}}></Image>
                </ScrollView>
                <View style={{flexDirection: "row"}}>
                    <Text style={{margin: 5}}>Likes</Text>
                    <Text style={{margin: 5}}>Comments</Text>
                    <Icon onPress={favColor} name="favorite" color={likeColor} />
                </View>
            </View>
        )
}

export default ProfileRecentPosts

const styles = StyleSheet.create({
    component: {
        justifyContent: "center",
        alignItems: "center",
        width: 350,
        height: 200,
        backgroundColor: "#AEAEAE",
        marginTop: 5,
        marginBottom: 5,
        borderRadius:20,
        padding: 5

    }
})
