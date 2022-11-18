import React, { useRef, useEffect } from 'react'
import { Text, View, StyleSheet, Alert, Animated } from 'react-native'
import { Button } from 'react-native-elements'
import { useState } from 'react'
import { auth } from '../../firebase'
import { db } from '../../firebase'
import { Input } from 'react-native-elements/dist/input/Input'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

function EditBio({ color, setIsEditBioShown, theme, textColorDependingOnTheme }) {

	const [bioText, setBioText] = useState("")
	const [currentBio, setCurrentBio] = useState('')

	const user = auth.currentUser

	const springAnim = useRef(new Animated.Value(1000)).current
	const backgroundAnim = useRef(new Animated.Value(0)).current

	useEffect(() => {           // animation
		Animated.spring(springAnim, {
			toValue: 0,
			duration: 1000,
			useNativeDriver: true,
		}).start()
		Animated.timing(backgroundAnim, {
			toValue: 0.3,
			duration: 700,
			useNativeDriver: false
		}).start()
	}, [])

	useEffect(async () => {
		const bio = await getDoc(doc(db, 'useruid', `${user.uid}`))
			.then((document) => {
				setCurrentBio(document.data().bio)
			})
	}, [])

	const submitFunction = async () => {     // submit bio to db and close modal
		if (bioText.length < 100) await updateDoc(doc(db, 'useruid', `${user.uid}`),
			{ bio: bioText })
			.then(() => { Alert.alert("Bio updated") })
		else if (bioText.length > 100) Alert.alert("Bio must be less than 100 characters")
		closeModal()
	}

	function closeModal() {      // closing the modal with the animation reversed
		Animated.spring(springAnim, {
			toValue: 1000,
			duration: 1000,
			useNativeDriver: true,
		}).start()
		Animated.timing(backgroundAnim, {
			toValue: 0,
			duration: 700,
			useNativeDriver: false
		}).start()
		setTimeout(() => { setIsEditBioShown(false) }, 1000)
	}

	return (
		<Animated.View style={[
			{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
			{
				backgroundColor: backgroundAnim.interpolate({
					inputRange: [0, 1],
					outputRange: [
						'rgba(0,0,0,0)',
						'rgba(0,0,0,1)'
					]
				})
			}
		]}>
			<Animated.View style={[
				styles.component,
				theme == 'dark' ? { backgroundColor: 'rgb(40,40,40)', borderColor: 'white' } : { backgroundColor: 'rgb(240,240,240)' },
				{ transform: [{ translateY: springAnim }] }]}>
				<Text style={{
					marginBottom: 20,
					textAlign: 'center',
					color: textColorDependingOnTheme,
					fontSize: 20,
				}}>Current bio:{'\n'} {currentBio}</Text>
				<Input
					placeholder="..."
					placeholderTextColor={textColorDependingOnTheme}
					labelStyle={{ color: textColorDependingOnTheme }}
					style={{ color: textColorDependingOnTheme }}
					label='Add bio'
					leftIcon={{ type: 'font-awesome', name: 'pencil', color: textColorDependingOnTheme }}
					selectionColor={textColorDependingOnTheme}
					value={bioText}
					onChangeText={(text) => setBioText(text)} />
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', bottom: -15, }}>
					<Button title='Submit' onPress={submitFunction} buttonStyle={[styles.leftButton, { backgroundColor: color }]} />
					<Button title='Cancel' onPress={() => closeModal()} buttonStyle={[styles.rightButton, { backgroundColor: color }]} />

				</View>
			</Animated.View>
		</Animated.View>
	)
}

export default EditBio

const styles = StyleSheet.create({
	component: {
		position: "absolute",
		justifyContent: "space-evenly",
		alignItems: "center",
		width: 350,
		backgroundColor: "rgba(240,240,240,1)",
		marginTop: 5,
		borderRadius: 20,
		paddingTop: 15,
		paddingBottom: 15,
		zIndex: 10,
		borderWidth: 2,
		borderColor: 'black'


	},
	leftButton: {
		width: 150,
		height: 50,
		borderBottomLeftRadius: 17,
		borderTopRightRadius: 40
	},
	rightButton: {
		width: 150,
		height: 50,
		borderTopLeftRadius: 40,
		borderBottomRightRadius: 17
	}
})
