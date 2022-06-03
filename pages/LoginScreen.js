import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, KeyboardAvoidingView, Animated, Platform } from 'react-native'
import { Button, Image, Input } from "react-native-elements"
import { auth } from '../firebase'

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [platform, setPlatform] = useState('')
    const [shadowOptions, setShadowOptions] = useState({})
    const [lockIcon, setLockIcon] = useState("eye-slash")
    const [isPasswordShown, setIsPasswordShown] = useState(false)

    const scaleAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {          // platform based shadow options
        if (Platform.OS === "android") {
          setPlatform("android")
          setShadowOptions({
            elevation: 20
          })
      }
        else if (Platform.OS === "ios") {
          setPlatform("ios")
          setShadowOptions({
            shadowColor: '#171717',
            shadowOffset: {width: -1, height: 3},
            shadowOpacity: 0.4,
            shadowRadius: 5, 
          })
        }
    
      }, [])

    useEffect(() => {
        if (lockIcon === "eye"){ setIsPasswordShown(true) }
        else { setIsPasswordShown(false) }
    }, [lockIcon])

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: true,
          }).start()
    }, [])

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                navigation.replace("HomePage");
            }
        });
        return unsubscribe;
    }, [])

    const signIn = () => {
        auth.signInWithEmailAndPassword(email,password)
        .then(() => {
            navigation.replace("HomePage");
        })
        .catch((error) => alert(error.message))

    }

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.elevation, shadowOptions, {transform: [{scale: scaleAnim}]}]}>
            <StatusBar style="light" ></StatusBar>
            <Image 
            source={require("../assets/w1logocrimson.png")}
            style={{ width: 200, height: 150, marginBottom: 25}}
            />
            <View style={styles.inputContainer}>
                <Input
                    label="Email"
                    labelStyle={{ color: "black", fontSize: 15 }}
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }} 
                    style={{color: "black"}} 
                    selectionColor="black"  
                    autoCapitalize="none" 
                    placeholder="example@gmail.com" 
                    autoFocus 
                    type="email" 
                    value={email} 
                    onChangeText={(text) => setEmail(text)} />
                <Input 
                    label="Password"
                    labelStyle={{ color: "black", fontSize: 15 }}
                    leftIcon={{ type: 'font-awesome', name: lockIcon, onPress: () => setLockIcon(lockIcon === "eye-slash" ? "eye" : "eye-slash") }}
                    style={{color: "black"}} 
                    selectionColor="black" 
                    autoCapitalize="none" 
                    placeholder="Password" 
                    {...(isPasswordShown ? {secureTextEntry: false} : {secureTextEntry: true})}
                    type="password" 
                    value={password} 
                    onChangeText={(text) => setPassword(text)} />
                <View style={{height:25}}></View>
            </View>
            <Button onPress={signIn} title="Login" buttonStyle={styles.loginButton}/>
            <Button onPress={() => navigation.navigate("Register")} title="Register" buttonStyle={styles.registerButton} type="outline"/>
            <View style={{height:100}}></View>
            </Animated.View>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems:"center",
        justifyContent: "center",
        backgroundColor: "#ffffff"
    },
    inputContainer: {
        width:300,
    },
    loginButton:{
        width: 250,
        borderRadius: 15,
        backgroundColor: "#dc143c",
    },
    registerButton:{
        width: 250,
        borderRadius: 15,
        borderWidth: 0,
    },
    elevation:{
        justifyContent: "center", alignItems: "center", 
        backgroundColor: "rgba(240,240,240,1)",
        borderWidth:2,
        borderColor:'black',
        borderRadius: 40,
    }
});
