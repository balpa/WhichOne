import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from 'react-native'
import { Button, Icon } from "react-native-elements"
import ProfilePage from './ProfilePage'
import StatsPage from './StatsPage'
import CreatePost from '../components/CreatePost'
import ProfileRecentPosts from '../components/ProfileRecentPosts'
import { auth } from "../firebase";
import { db } from '../firebase'
import * as firebase from 'firebase'
import username from "./RegisterScreen"

const HomePage = ({navigation}) => {
    const [isShown, setIsShown] = useState(false)
    const createPostFunc = () => {
        setIsShown(!isShown)
    }

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
        <View style={styles.container}>
            <StatusBar style="light"></StatusBar>
            <View style={styles.topSearch}>
                <Button onPress={() => navigation.navigate("Search")} titleStyle={{color: "white", fontSize: 15}} buttonStyle={styles.searchButton} title={
                    <Icon name="search" color="white" />
                }/>
            </View>
            <Image source={require("../assets/w1logowhite.png")}
            style={{width: 50, height: 50, position: "absolute"}}
            />
            <View style={{height: 50}}></View>
            <View style={styles.topProfile}>
                <Button onPress={ () => navigation.navigate("Profile") } titleStyle={{color: "white", fontSize: 15}} buttonStyle={styles.profileButton} title={
                    <Icon name="account-circle" color="white" />
                }/>
            </View>
            <ScrollView>
                <ProfileRecentPosts />
                <ProfileRecentPosts />
                <ProfileRecentPosts />
                <ProfileRecentPosts />
                <ProfileRecentPosts />
                <ProfileRecentPosts />
                <ProfileRecentPosts />
                <ProfileRecentPosts />
                <ProfileRecentPosts />
            </ScrollView>
            <Animated.View style={{position: "absolute", flex: 1, top: 150, opacity: fadeAnim}}>
                {isShown === true ? <CreatePost /> : null}
            </Animated.View>
            <TouchableOpacity style={styles.createButton}>
                <Button onPress={createPostFunc} icon={{name: "add-to-photos"}} buttonStyle={{borderRadius:40,backgroundColor: "crimson"}} />
            </TouchableOpacity>
          
        </View>
    )
}

export default HomePage

const styles = StyleSheet.create({
    createButton:{
        backgroundColor: "crimson", 
        justifyContent:"center", 
        alignItems: "center", 
        width: 50, 
        height:50, 
        position: "absolute", 
        zIndex: 100, 
        bottom: 30, 
        right: 30,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 5,
    },
    topSearch: {
        position: "absolute",
        alignItems: "flex-end",
        width: 85,
        left: 0,
        zIndex: 10,
  
    },
    profileButton: {
        marginTop: 5,
        width: 60,    
        borderWidth: 0,
        backgroundColor: "transparent",
    },
    searchButton: {
        marginTop: 5,
        width: 110,    
        borderWidth: 0,
        backgroundColor: "transparent",
    },
    topProfile: {
        position: "absolute",
        alignItems: "flex-end",
        width: 100,
        right: 0,
        zIndex: 10,

    },
    container: {
    flex: 1,
    backgroundColor: "#243447",
    alignItems: "center"
},
})