import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Animated, Platform, TouchableOpacity } from 'react-native'
import { Image } from "react-native-elements"
import ChangeName from '../components/AccountSettingsComponents/ChangeName'
import EditBio from '../components/AccountSettingsComponents/EditBio'
import ChangePassword from '../components/AccountSettingsComponents/ChangePassword'
import "firebase/firestore";
import { db, auth } from '../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountSettings = ({ navigation }) => {

	// TODO: styling bad & add shadow platform based
	// need problems with styling. 

	const COLOR_PALETTE_1 = ["FEF9A7", "FAC213", "F77E21", "D61C4E", "990000", "FF5B00", "D4D925", "FFEE63"]

	const [isChangeNameShown, setIsChangeNameShown] = useState(false)
	const [isEditBioShown, setIsEditBioShown] = useState(false)
	const [isChangePasswordShown, setIsChangePasswordShown] = useState(false)
	const [changedName, setChangedName] = useState("")
	const [platform, setPlatform] = useState("")
	const [shadowOptions, setShadowOptions] = useState({})

	const user = auth.currentUser

	let yAnim0FromTop = React.useRef(new Animated.Value(1000)).current
	let yAnim1FromTop = React.useRef(new Animated.Value(1000)).current
	let yAnim2FromTop = React.useRef(new Animated.Value(1000)).current
	let yAnim3FromTop = React.useRef(new Animated.Value(1000)).current
	let yAnim4FromTop = React.useRef(new Animated.Value(1000)).current
	let yAnim5FromTop = React.useRef(new Animated.Value(1000)).current

	// useEffect(async () => {      // get theme data from local storage (cache) ***HARDCODED***
	//     try {
	//         const value = await AsyncStorage.getItem('GLOBAL_THEME')
	//         if (value !== null) {
	//             setSelectedTheme(value)
	//             if (value == 'light') setTextColorDependingOnTheme('black')
	//             else setTextColorDependingOnTheme('white')
	//         }
	//     } catch (e) { console.log(e) }
	// }, [])

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

			<View style={styles.elevation}>
				<Animated.View style={[
					styles.buttonView,
					shadowOptions,
					{ transform: [{ translateY: yAnim0FromTop }] },
					{ backgroundColor: `#${COLOR_PALETTE_1[3]}` }
				]}>
					<TouchableOpacity onPress={() => setIsChangeNameShown(true)} style={{
						width: '100%', height: 50, justifyContent: 'center', alignItems: 'center'
					}}>
						<Text
							style={{ fontSize: 25, fontWeight: '800' }}>
							Change Name
						</Text>
					</TouchableOpacity>
				</Animated.View>
				<Animated.View style={[
					styles.buttonView,
					shadowOptions,
					{ transform: [{ translateY: yAnim1FromTop }] },
					{ backgroundColor: `#${COLOR_PALETTE_1[3]}` }
				]}>
					<TouchableOpacity onPress={() => setIsEditBioShown(true)} style={{
						width: '100%', height: 50, justifyContent: 'center', alignItems: 'center'
					}}>
						<Text
							style={{ fontSize: 25, fontWeight: '800' }}>
							Edit Bio
						</Text>
					</TouchableOpacity>
				</Animated.View>
				<Animated.View style={[
					styles.buttonView,
					shadowOptions,
					{ transform: [{ translateY: yAnim2FromTop }] },
					{ backgroundColor: `#${COLOR_PALETTE_1[5]}` }
				]}>
					<TouchableOpacity onPress={() => navigation.navigate("Upload Avatar")} style={{
						width: '100%', height: 50, justifyContent: 'center', alignItems: 'center'
					}}>
						<Text
							style={{ fontSize: 25, fontWeight: '800' }}>
							Upload Avatar
						</Text>
					</TouchableOpacity>
				</Animated.View>
				<Animated.View style={[
					styles.buttonView,
					shadowOptions,
					{ transform: [{ translateY: yAnim3FromTop }] },
					{ backgroundColor: `#${COLOR_PALETTE_1[6]}` }
				]}>
					<TouchableOpacity onPress={() => setIsChangePasswordShown(true)} style={{
						width: '100%', height: 50, justifyContent: 'center', alignItems: 'center'
					}}>
						<Text
							style={{ fontSize: 25, fontWeight: '800' }}>
							Change Password
						</Text>
					</TouchableOpacity>
				</Animated.View>
			</View>
			{isChangeNameShown ?
				<View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} >
					<ChangeName
						color={`#${COLOR_PALETTE_1[3]}`}
						setIsChangeNameShown={setIsChangeNameShown}
					/>
				</View> : null}

			{isEditBioShown ?
				<View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
					<EditBio
						color={`#${COLOR_PALETTE_1[3]}`}
						setIsEditBioShown={setIsEditBioShown}
					/>
				</View> : null}

			{isChangePasswordShown ?
				<View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
					<ChangePassword
						color={`#${COLOR_PALETTE_1[6]}`}
						setIsChangePasswordShown={setIsChangePasswordShown}
					/>
				</View> : null}

			<View style={styles.logoBottomContainer}>
				<Image source={require("../assets/w1logocrimson.png")} style={styles.logoBottom} />
			</View>
		</>

	)
}

export default AccountSettings

const styles = StyleSheet.create({
	accountButton: {
		width: 170,
		borderWidth: 0,
		backgroundColor: "transparent",
	},
	top: {
		alignItems: "flex-end"
	},
	// container: {
	//     alignItems:"center",
	//     justifyContent: "space-evenly",
	//     backgroundColor: "black",
	//     borderWidth: 1, 
	// },
	elevation: {
		position: 'absolute',
		width: "100%",
		height: "90%",
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
	logoBottom: {
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
		zIndex: 5
	},

})