import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, KeyboardAvoidingView, Animated } from 'react-native'
import { Button, Image, Input } from "react-native-elements"
import { auth } from '../firebase'

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const scaleAnim = useRef(new Animated.Value(0)).current

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
            <Animated.View style={[styles.elevation, {transform: [{scale: scaleAnim}]}]}>
            <StatusBar style="light" ></StatusBar>
            <Image 
            source={require("../assets/w1logocrimson.png")}
            style={{ width: 200, height: 150, marginBottom: 25}}
            />
            <View style={styles.inputContainer}>
                <Input style={{color: "white"}} selectionColor="white"  autoCapitalize="none" placeholder="Email" autoFocus type="email" value={email} onChangeText={(text) => setEmail(text)} />
                <Input style={{color: "white"}} selectionColor="white" autoCapitalize="none" placeholder="Password" secureTextEntry type="password" value={password} onChangeText={(text) => setPassword(text)} />
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
        backgroundColor: "rgba(15,15,15,1)"
    },
    inputContainer: {
        width:300,
    },
    loginButton:{
        width: 250,
        borderRadius: 15,
        backgroundColor: "#dc143c"
    },
    registerButton:{
        width: 250,
        borderRadius: 15,
        borderWidth: 0,
    },
    elevation:{
        justifyContent: "center", alignItems: "center", 
        backgroundColor: "'rgba(255,255,255,0.1)'",

        borderRadius: 40,
    }
});
