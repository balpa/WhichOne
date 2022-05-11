import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View, Text, KeyboardAvoidingView, Alert } from 'react-native'
import { Button, Input } from 'react-native-elements/'
import {useState, useLayoutEffect, useEffect} from "react"
import { auth } from "../firebase";
import { db } from '../firebase'
import { set } from 'react-native-reanimated'


const RegisterScreen = ({ navigation }) => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")
    const [isRight, setIsRight] = useState(null)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle:"Login",
        })
    }, [navigation])

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            authUser.user.updateProfile({
                displayName: name,
            })
        })

        .then(async () => {
            let loggedinUser = await auth.currentUser
            db.collection('usernames').doc(`${username}`)
            .set({
            name: `${name}`,
            username: `${username}`,
            email: `${email}`,
            following: [],
            followers: [],
            UID: `${loggedinUser.uid}`,
            postCount: 0,
            })
        } )
        .then(async () => {
            let loggedinUser = await auth.currentUser
            db.collection('useruid').doc(`${loggedinUser.uid}`)
            .set({
            name: `${name}`,
            username: `${username}`,
            email: `${email}`,
            following: [],
            followers: [],
            UID: `${loggedinUser.uid}`,
            postCount: 0,
            })
        } )
        
        .then(Alert.alert(
            "Successfully registered!",
        ))
        .catch((error) => alert(error.message));
    }

    const WrongPassword = () => {
        return <Text style={{color: "crimson", marginLeft: 65}}>Password does not match</Text>
    }
    const RightPassword = () => {
        return <Text style={{color: "green", marginLeft: 85}}>Password confirmed</Text>
    }

    useEffect(() => {
        if (confirmpassword.length > 0){
            if (confirmpassword === password){
                setIsRight(true)
            } else {
                setIsRight(false)
            }
    } else {
        null
    }
    },[confirmpassword]) 


    return (
        <View behavior="padding" style={styles.container}>
            <StatusBar style="light"/>
            <View style={styles.elevation}>
                <View style={{height: 20}}></View>
            <Text h1 style={{marginBottom: 50, fontSize: 25, color: "white"}}>Create an account</Text>
            <View style={styles.inputContainer}>
                <Input style={{color: "white"}} selectionColor="white"  autoFocus placeholder="Full Name" value={name} onChangeText={(text) => setName(text)}/>
                <Input style={{color: "white"}} selectionColor="white"  autoCapitalize="none" placeholder="Username" value={username} onChangeText={(text) => setUsername(text)}/>
                <Input style={{color: "white"}} selectionColor="white"  autoCapitalize="none" type="email" placeholder="Email" value={email} onChangeText={(text) => setEmail(text)}/>
                <Input style={{color: "white"}} selectionColor="white"  autoCapitalize="none" type="password" secureTextEntry placeholder="Password" value={password} onChangeText={(text) => setPassword(text)}/>
                <Input style={{color: "white"}} selectionColor="white"  autoCapitalize="none" type="password" secureTextEntry placeholder="Confirm password" value={confirmpassword} onChangeText={(text) => setConfirmPassword(text)}/>
                {isRight ? <RightPassword /> : <WrongPassword />}
            </View>
            <Button  title="Register" onPress={register} buttonStyle={styles.loginButton}/>
            <View style={{height: 100}}/>
            </View>
        </View>
    )
}

export default RegisterScreen

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
        backgroundColor: "#dc143c",
        marginTop: 10,
    },
    elevation:{
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "'rgba(255,255,255,0.1)'",
        borderRadius: 40,
    }

})
