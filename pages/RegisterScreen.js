import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View, Text, KeyboardAvoidingView, Alert, Animated } from 'react-native'
import { Button, Input } from 'react-native-elements/'
import {useState, useLayoutEffect, useEffect, useRef} from "react"
import { auth } from "../firebase";
import { db } from '../firebase'
import { set } from 'react-native-reanimated'
import { setDoc, doc } from 'firebase/firestore'


const RegisterScreen = ({ navigation }) => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")
    const [isRight, setIsRight] = useState(null)

    const scaleAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }).start()
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle:"Login",
        })
    }, [navigation])

    const register = () => {        // TODO: PASSWORD MIN CHAR SIZE
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
            bio: ""
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
            bio: ""
            })
        } )
        .then(async ()=>{           // set postID to posts/useruid/postID for fetching posts
            let loggedinUser = await auth.currentUser
            db.collection('posts').doc(`${loggedinUser.uid}`)
            .set({
                postID: [],
            })
        })

        
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
            <Animated.View style={[styles.elevation, {transform: [{scale: scaleAnim}]}]}>
                <View style={{height: 20}}></View>
            <Text h1 style={{marginBottom: 50, fontSize: 25, color: "black"}}>Create an account</Text>
            <View style={styles.inputContainer}>
                <Input style={{color: "black"}} selectionColor="black"  autoFocus placeholder="Full Name" value={name} onChangeText={(text) => setName(text)}/>
                <Input style={{color: "black"}} selectionColor="black"  autoCapitalize="none" placeholder="Username" value={username} onChangeText={(text) => setUsername(text)}/>
                <Input style={{color: "black"}} selectionColor="black"  autoCapitalize="none" type="email" placeholder="Email" value={email} onChangeText={(text) => setEmail(text)}/>
                <Input style={{color: "black"}} selectionColor="black"  autoCapitalize="none" type="password" secureTextEntry placeholder="Password" value={password} onChangeText={(text) => setPassword(text)}/>
                <Input style={{color: "black"}} selectionColor="black"  autoCapitalize="none" type="password" secureTextEntry placeholder="Confirm password" value={confirmpassword} onChangeText={(text) => setConfirmPassword(text)}/>
                {isRight ? <RightPassword /> : <WrongPassword />}
            </View>
            <Button  title="Register" onPress={register} buttonStyle={styles.loginButton}/>
            <View style={{height: 100}}/>
            </Animated.View>
        </View>
    )
}

export default RegisterScreen

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
        marginTop: 10,
    },
    elevation:{
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "rgba(240,240,240,1)",
        borderRadius: 40,
        borderWidth:2,
        borderColor:'black'
    }

})
