import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View, Text, KeyboardAvoidingView, Alert, Animated, Platform } from 'react-native'
import { Button, Input } from 'react-native-elements/'
import {useState, useLayoutEffect, useEffect, useRef} from "react"
import { auth } from "../firebase";
import { db } from '../firebase'
import { set } from 'react-native-reanimated'
import { setDoc, doc } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';


const RegisterScreen = ({ navigation }) => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")
    const [isRight, setIsRight] = useState(null)
    const [platform, setPlatform] = useState('')
    const [shadowOptions, setShadowOptions] = useState({})
    const [lockIcon, setLockIcon] = useState("eye-slash")
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [isNameNull, setIsNameNull] = useState(true)
    const [selectedTheme, setSelectedTheme] = useState('')
    const [textColorDependingOnTheme, setTextColorDependingOnTheme] = useState('rgba(0,0,0,0)')

    const scaleAnim = useRef(new Animated.Value(0)).current

    useEffect(async()=>{      // get theme data from local storage (cache) ***HARDCODED***
        try {
          const value = await AsyncStorage.getItem('GLOBAL_THEME')
          if(value !== null) {
            setSelectedTheme(value)
            if (value == 'light') setTextColorDependingOnTheme('black')
            else setTextColorDependingOnTheme('white')
          }
        } 
        catch(e) {
            console.log(e)
        }

    },[])

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

    useEffect(() => {
        if (lockIcon === "eye"){ setIsPasswordShown(true) }
        else { setIsPasswordShown(false) }
    }, [lockIcon])

    const register = () => {        // TODO: PASSWORD MIN CHAR SIZE

        if (name.length > 0) {

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

    useEffect(()=>{
        if (name.length == 0) setIsNameNull(true)
        else setIsNameNull(false)
    },[name])


    //TODO: mustnt be empty message 

    return (
        <View behavior="padding" style={[styles.container, selectedTheme == 'dark' ? {backgroundColor:'rgb(15,15,15)'} : {}]}>
            <StatusBar style="light"/>
            <Animated.View style={[
                styles.elevation, 
                shadowOptions, 
                selectedTheme == 'dark' ? {backgroundColor:'rgb(40,40,40)', borderColor:'rgba(255,255,255,0.2)'} : {backgroundColor:'rgb(240,240,240)'},
                {transform: [{scale: scaleAnim}]}]}>
                <View style={{height: 20}}></View>
            <Text h1 style={{marginBottom: 20, fontSize: 25, color: textColorDependingOnTheme}}>Create an account</Text>
            <View style={styles.inputContainer}>
                <Input 
                    label="Full Name"
                    labelStyle={{color: textColorDependingOnTheme, fontSize: 15}}
                    leftIcon={{ type: 'material', name: 'badge', color:textColorDependingOnTheme }}
                    style={{color: textColorDependingOnTheme}} 
                    selectionColor={textColorDependingOnTheme}  
                    autoFocus placeholder="Jack Smith" 
                    value={name} 
                    errorMessage={isNameNull ? 'Name must not be empty' : ''}
                    onChangeText={(text) => setName(text)}/>
                <Input 
                    label="Username"
                    labelStyle={{color: textColorDependingOnTheme, fontSize: 15}}
                    leftIcon={{ type: 'material', name: 'edit', color: textColorDependingOnTheme }}
                    style={{color: textColorDependingOnTheme}} 
                    selectionColor={textColorDependingOnTheme}  
                    autoCapitalize="none" 
                    placeholder="jacksmith" 
                    value={username} 
                    onChangeText={(text) => setUsername(text)}/>
                <Input 
                    label="E-Mail"
                    labelStyle={{color: textColorDependingOnTheme, fontSize: 15}}
                    leftIcon={{ type: 'material', name: 'email', color: textColorDependingOnTheme }}
                    style={{color: textColorDependingOnTheme}} 
                    selectionColor={textColorDependingOnTheme}
                    autoCapitalize="none" 
                    type="email" 
                    placeholder="jack@gmail.com" 
                    value={email} 
                    onChangeText={(text) => setEmail(text)}/>
                <Input 
                    label="Password"
                    labelStyle={{color: textColorDependingOnTheme, fontSize: 15}}
                    leftIcon={{ type: 'font-awesome',color:textColorDependingOnTheme, name: lockIcon, onPress: () => setLockIcon(lockIcon === "eye-slash" ? "eye" : "eye-slash") }}
                    {...(isPasswordShown ? {secureTextEntry: false} : {secureTextEntry: true})}
                    style={{color: textColorDependingOnTheme}} 
                    selectionColor={textColorDependingOnTheme} 
                    autoCapitalize="none" 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChangeText={(text) => setPassword(text)}/>
                <Input 
                    label="Confirm Password"
                    labelStyle={{color: textColorDependingOnTheme, fontSize: 15}}
                    leftIcon={{ type: 'font-awesome',color:textColorDependingOnTheme, name: lockIcon, onPress: () => setLockIcon(lockIcon === "eye-slash" ? "eye" : "eye-slash") }}
                    {...(isPasswordShown ? {secureTextEntry: false} : {secureTextEntry: true})}
                    style={{color: textColorDependingOnTheme}} 
                    selectionColor={textColorDependingOnTheme} 
                    autoCapitalize="none" 
                    type="password" 
                    placeholder="Confirm password" 
                    value={confirmpassword} 
                    onChangeText={(text) => setConfirmPassword(text)}/>
                {isRight ? <RightPassword /> : <WrongPassword />}
            </View>
            <Button  title="Register" onPress={register} buttonStyle={styles.loginButton}/>
            <Button  title="Cancel" titleStyle={{color:'crimson'}} onPress={()=> navigation.navigate("Login")} buttonStyle={styles.cancelButton}/>
            <View style={{height: 50}}/>
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
    cancelButton:{
        width: 250,
        borderRadius: 15,
        backgroundColor: "white",
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
