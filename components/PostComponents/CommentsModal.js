import { View, Text, StyleSheet, Animated } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { Input, Icon } from 'react-native-elements'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import SmallComment from './SmallComment'
import { auth } from '../../firebase'
import { db } from '../../firebase'
import { setDoc, doc, onSnapshot } from 'firebase/firestore'

const CommentsModal = ({ postID, setShowComments, height4postcontainer }) => {

	const user = auth.currentUser

	const [commentText, setCommentText] = useState("")
	const [commentsOnDB, setCommentsOnDB] = useState([])

	const yAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {       // animation for height of the modal (opening)
		Animated.spring(yAnim, {
			toValue: height4postcontainer - 50,
			duration: 300,
			useNativeDriver: false
		}).start()
	}, [])

	// TODO: GET COMMENTS ON PARENT COMPONENT TO SHOW COUNT NUMBER
	useEffect(() => {         // get comments from DB
		const os = onSnapshot(doc(db, "postInfo", `${postID}`, "comments", "commentsUserID"), (document) => {
			setCommentsOnDB(document.data())
		})

	}, [])

	// console.log("comments: ",commentsOnDB)

	// TODO: use interpolate function for animation value based on percentage


	function closeComments() {  // animation for closing the modal and setting showComments to false 
		Animated.timing(yAnim, {
			toValue: 0,
			duration: 350,
			useNativeDriver: false
		}).start()
		setTimeout(() => { setShowComments(false) }, 300)
	}

	// TODO: can add comments but need to structure like an object to save date etc.
	// and need to display comments with username and avatar.
	// styling

	async function sendComment() {      // send comment to db. each user can send only one comment per post atm. 
		let date = new Date()          // will add date
		await setDoc(doc(db, "postInfo", `${postID}`, "comments", "commentsUserID"), {
			[user.displayName]: commentText
		}, { merge: true })

		setCommentText("")          // TODO: doesnt clear the input field
	}


	//TODO: swipe close modal 

	return (
		<Animated.View style={[
			styles.container,
			{ backgroundColor: 'white', borderColor: '#0007' },
			{ height: yAnim }]}>
			<ScrollView style={styles.commentsSection}>
				{commentsOnDB && Object.keys(commentsOnDB).map((key, index) => {
					return <SmallComment
						comment={commentsOnDB[key]}
						name={key}
						key={index} />
				})}
			</ScrollView>
			<View style={styles.inputSection}>
				<Input
					autoCapitalize='none'
					placeholder='Write a comment...'
					style={{ color: 'black' }}
					selectionColor={'black'}
					onChangeText={(text) => setCommentText(text)}>
				</Input>
				<TouchableOpacity onPress={() => sendComment()}>
					<Icon size={22} name="send" color={'black'} />
				</TouchableOpacity>
			</View>
			<View style={styles.closeButtonSection}>
				<TouchableOpacity onPress={() => closeComments()} style={styles.closeButton}>
					<Text style={{ color: 'black' }}>Close</Text>
				</TouchableOpacity>
			</View>
		</Animated.View>
	)
}

export default CommentsModal


const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		width: "100%",
		// height: "100%",
		bottom: 0,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 5,
		borderWidth: 2,
		borderColor: 'rgba(255,255,255,0.3)',
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	},
	closeButton: {
		width: 300,
		height: 25,
		justifyContent: 'center',
		alignItems: 'center',
	},
	closeButtonSection: {
		position: 'absolute',
		bottom: 0,
		width: "100%",
		justifyContent: 'center',
		alignItems: 'center',

	},
	commentsSection: {
		width: '100%',
		height: '90%',
	},
	inputSection: {
		position: 'absolute',
		width: '100%',
		height: 20,
		bottom: 40,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',

	}
})