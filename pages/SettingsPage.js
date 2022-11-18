import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, Animated, Platform, TouchableOpacity } from 'react-native'
import { Icon } from "react-native-elements"
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsPage = ({ navigation }) => {

	const COLOR_PALETTE_1 = ["FEF9A7", "FAC213", "F77E21", "D61C4E", "990000", "FF5B00", "D4D925", "FFEE63"]

	const [platform, setPlatform] = useState("")
	const [shadowOptions, setShadowOptions] = useState({})
	const [selectedTheme, setSelectedTheme] = useState('')

	let yAnim0FromTop = React.useRef(new Animated.Value(1000)).current
	let yAnim1FromTop = React.useRef(new Animated.Value(1000)).current
	let yAnim2FromTop = React.useRef(new Animated.Value(1000)).current
	let yAnim3FromTop = React.useRef(new Animated.Value(1000)).current
	let yAnim4FromTop = React.useRef(new Animated.Value(1000)).current
	let yAnim5FromTop = React.useRef(new Animated.Value(1000)).current

	useEffect(async () => {      // get theme data from local storage (cache) ***HARDCODED***
		try {
			const value = await AsyncStorage.getItem('GLOBAL_THEME')
			if (value !== null) setSelectedTheme(value)
		} catch (e) { console.log(e) }
	}, [])

	useEffect(() => {       // spesific animation timings for each menu item
		setTimeout(() => {
			Animated.spring(yAnim0FromTop, {
				toValue: 0,
				friction: 8,
				tension: 40,
				useNativeDriver: true,
			}).start();
		}, 400)
		setTimeout(() => {
			Animated.spring(yAnim1FromTop, {
				toValue: 0,
				friction: 8,
				tension: 40,
				useNativeDriver: true,
			}).start();
		}, 550)
		setTimeout(() => {
			Animated.spring(yAnim2FromTop, {
				toValue: 0,
				friction: 8,
				tension: 40,
				useNativeDriver: true,
			}).start();
		}, 700)
		setTimeout(() => {
			Animated.spring(yAnim3FromTop, {
				toValue: 0,
				friction: 8,
				tension: 40,
				useNativeDriver: true,
			}).start();
		}, 850)
		setTimeout(() => {
			Animated.spring(yAnim4FromTop, {
				toValue: 0,
				friction: 8,
				tension: 40,
				useNativeDriver: true,
			}).start();
		}, 1000)
		setTimeout(() => {
			Animated.spring(yAnim5FromTop, {
				toValue: 0,
				friction: 8,
				tension: 40,
				useNativeDriver: true,
			}).start();
		}, 1150)
	}, [])

	useEffect(() => {          // platform based shadow options
		if (Platform.OS === "android") {
			setPlatform("android")
			setShadowOptions({
				elevation: 0
			})
		}
		else if (Platform.OS === "ios") {
			setPlatform("ios")
			setShadowOptions({
				shadowColor: '#171717',
				shadowOffset: { width: -1, height: 3 },
				shadowOpacity: 0.4,
				shadowRadius: 5,
			})
		}
	}, [])

	return (
		<>
			<View style={[styles.elevation, selectedTheme == 'light' ? {} : { backgroundColor: 'rgb(15,15,15)' }]}>
				<Animated.View style={[
					styles.buttonView,
					shadowOptions,
					{ transform: [{ translateY: yAnim0FromTop }] },
					{ backgroundColor: `#${COLOR_PALETTE_1[3]}` }
				]}>
					<TouchableOpacity onPress={() => navigation.navigate('Account')} style={{
						width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
					}}>
						<Icon name="person" color="black" />
						<Text
							style={{ fontSize: 25, fontWeight: '800' }}>
							Account
						</Text>
					</TouchableOpacity>
				</Animated.View>
				<Animated.View style={[
					styles.buttonView,
					shadowOptions,
					{ transform: [{ translateY: yAnim1FromTop }] },
					{ backgroundColor: `#${COLOR_PALETTE_1[3]}` }
				]}>
					<TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={{
						width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
					}}>
						<Icon name='notifications' color="black" />
						<Text
							style={{ fontSize: 25, fontWeight: '800' }}>
							Notifications
						</Text>
					</TouchableOpacity>
				</Animated.View>
				<Animated.View style={[
					styles.buttonView,
					shadowOptions,
					{ transform: [{ translateY: yAnim2FromTop }] },
					{ backgroundColor: `#${COLOR_PALETTE_1[5]}` }
				]}>
					<TouchableOpacity onPress={() => navigation.navigate('Theme')} style={{
						width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
					}}>
						<Icon name='palette' color="black" />
						<Text
							style={{ fontSize: 25, fontWeight: '800' }}>
							Theme
						</Text>
					</TouchableOpacity>
				</Animated.View>
				<Animated.View style={[
					styles.buttonView,
					shadowOptions,
					{ transform: [{ translateY: yAnim3FromTop }] },
					{ backgroundColor: `#${COLOR_PALETTE_1[6]}` }
				]}>
					<TouchableOpacity style={{
						width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
					}}>
						<Icon name='lock' color="black" />
						<Text
							style={{ fontSize: 25, fontWeight: '800' }}>
							Security
						</Text>
					</TouchableOpacity>
				</Animated.View>
				<Animated.View style={[
					styles.buttonView,
					shadowOptions,
					{ transform: [{ translateY: yAnim4FromTop }] },
					{ backgroundColor: `#${COLOR_PALETTE_1[7]}` }
				]}>
					<TouchableOpacity style={{
						width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
					}}>
						<Icon name='help' color="black" />
						<Text
							style={{ fontSize: 25, fontWeight: '800' }}>
							Help
						</Text>
					</TouchableOpacity>
				</Animated.View>
				<Animated.View style={[
					styles.buttonView,
					shadowOptions,
					{ transform: [{ translateY: yAnim5FromTop }] },
					{ backgroundColor: `#${COLOR_PALETTE_1[0]}` }
				]}>
					<TouchableOpacity onPress={() => navigation.navigate('About')} style={{
						width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
					}}>
						<Icon name='info' color="black" />
						<Text
							style={{ fontSize: 25, fontWeight: '800' }}>
							About
						</Text>
					</TouchableOpacity>
				</Animated.View>
			</View>

			<View style={styles.logoBottomContainer}>
				<Image source={require("../assets/w1logocrimson.png")} style={styles.logoBottom} />
			</View>

		</>

	)
}

export default SettingsPage

const styles = StyleSheet.create({
	logoutButton: {
		width: "50%",
		borderWidth: 0,
		backgroundColor: "green",
		justifyContent: "flex-start",
	},
	settingsButton: {
		borderWidth: 0,
		backgroundColor: "transparent",
		justifyContent: "flex-start",
	},
	buttonIconWrapper: {
		flexDirection: "row",
		width: "50%",
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",

	},
	top: {
		alignItems: "flex-end"
	},
	logoBottom: {
		position: 'absolute',
		width: 50,
		height: 50,
		bottom: 0,
		zIndex: 10
	},
	logoBottomContainer: {
		position: 'absolute',
		bottom: 10,
		width: "100%",
		justifyContent: 'center',
		alignItems: 'center',
	},
	elevation: {
		position: 'absolute',
		width: "100%",
		height: "100%",
		alignItems: "center",
	},
	buttonView: {
		margin: 10,
		width: '90%',
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10
	},

})