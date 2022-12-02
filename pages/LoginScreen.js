import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { useState, useEffect, useRef } from "react"
import { View, StyleSheet, Animated } from 'react-native'
import { Button, Image, Input } from "react-native-elements"
import { auth } from '../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [shadowOptions, setShadowOptions] = useState({})
	const [lockIcon, setLockIcon] = useState("eye-slash")
	const [isPasswordShown, setIsPasswordShown] = useState(false)

	const scaleAnim = useRef(new Animated.Value(0)).current

	useEffect(() => {
		if (lockIcon === "eye") { setIsPasswordShown(true) }
		else { setIsPasswordShown(false) }
	}, [lockIcon])

	useEffect(() => {                // animations (fade-in)
		Animated.spring(scaleAnim, {
			toValue: 1,
			duration: 5000,
			useNativeDriver: true,
		}).start()
	}, [])

	useEffect(() => {           // go to homepage if sign in successful of already logged in
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) { navigation.replace("HomePage") }
		})
		return unsubscribe;
	}, [])

	const signIn = () => {         // sign in function
		if (email.length > 0 && password.length > 0) {
			auth.signInWithEmailAndPassword(email, password)
				.then(() => { navigation.replace("HomePage") })
				.catch((error) => alert(error.message))
		} else { alert("Please enter email and password") }
	}

	return (
		<View style={[styles.container]}>
			<Animated.View style={[
				styles.elevation,
				shadowOptions,
				{ transform: [{ scale: scaleAnim }] }]}>
				<StatusBar style="light" ></StatusBar>
				<Image
					source={require("../assets/w1logocrimson.png")}
					style={{ width: 200, height: 150, marginBottom: 25 }}
				/>
				<View style={styles.inputContainer}>
					<Input
						label="Email"
						labelStyle={{ color: 'black', fontSize: 15 }}
						leftIcon={{ type: 'font-awesome', name: 'envelope', color: 'black' }}
						style={{ color: 'black' }}
						selectionColor='black'
						autoCapitalize="none"
						placeholder="example@gmail.com"
						autoFocus
						type="email"
						value={email}
						onChangeText={(text) => setEmail(text)} />
					<Input
						label="Password"
						labelStyle={{ color: 'black', fontSize: 15 }}
						leftIcon={{ type: 'font-awesome', color: 'black', name: lockIcon, onPress: () => setLockIcon(lockIcon === "eye-slash" ? "eye" : "eye-slash") }}
						style={{ color: 'black' }}
						selectionColor='black'
						autoCapitalize="none"
						placeholder="Password"
						{...(isPasswordShown ? { secureTextEntry: false } : { secureTextEntry: true })}
						type="password"
						value={password}
						onChangeText={(text) => setPassword(text)} />
					<View style={{ height: 25 }}></View>
				</View>
				<Button onPress={signIn} title="Login" buttonStyle={styles.loginButton} />
				<Button onPress={() => navigation.navigate("Register")} title="Register" buttonStyle={styles.registerButton} type="outline" />
				<View style={{ height: 100 }}></View>
			</Animated.View>
		</View>
	)
}

export default LoginScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#ffffff"
	},
	inputContainer: {
		width: 300,
	},
	loginButton: {
		width: 250,
		borderRadius: 15,
		backgroundColor: "#dc143c",
	},
	registerButton: {
		width: 250,
		borderRadius: 15,
		borderWidth: 0,
	},
	elevation: {
		justifyContent: "center", alignItems: "center",
		backgroundColor: "rgba(240,240,240,1)",
		borderWidth: 2,
		borderColor: 'black',
		borderRadius: 40,
	}
});
