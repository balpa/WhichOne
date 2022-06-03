import { View, Text, StyleSheet, Animated } from 'react-native'
import React, {useRef, useEffect,useState} from 'react'
import { Input, Icon } from 'react-native-elements'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import SmallComment from './SmallComment'
import { auth } from '../../firebase'
import { db } from '../../firebase' 
import { setDoc, doc, getDoc, getDocs, arrayUnion, onSnapshot, query } from 'firebase/firestore'

const CommentsModal = ({ postID, setShowComments }) => {

    const user = auth.currentUser

    const [commentText, setCommentText] = useState("")
    const [commentsOnDB, setCommentsOnDB] = useState([])

    const yAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {       // animation for height of the modal (opening)
        Animated.spring(yAnim, {
            toValue: 425,
            duration: 300,
            useNativeDriver: false
        }).start()
    }, [])

    // TODO: sometimes it doesn't get all data from the db. CHECK
    // COMMENTS SHOWING ON WRONG POSTS (weird cuz fetching by postid, might be a rendering issue or sorting the postID array)
    useEffect(()=>{         // get comments from DB
        const os = onSnapshot(doc(db,"postInfo", `${postID}`, "comments","commentsUserID"),(document)=>{
            setCommentsOnDB(document.data())
        })

    },[])

    // console.log("comments: ",commentsOnDB)


    // TODO: use interpolate function for animation value based on percentage


    function closeComments(){  // animation for closing the modal and setting showComments to false 
        Animated.timing(yAnim, {              
            toValue: 0,
            duration: 350,
            useNativeDriver: false
        }).start()
        setTimeout(()=>{ setShowComments(false) },300)
    }

    // TODO: can add comments but need to structure like an object to save date etc.
    // and need to display comments with username and avatar.
    // styling

    async function sendComment(){      // send comment to db. each user can send only one comment per post atm. 
        let date = new Date()          // will add date
        await setDoc(doc(db,"postInfo", `${postID}`, "comments", "commentsUserID"), {
            [user.displayName]: commentText
        },{ merge: true })

        setCommentText("")          // TODO: doesnt clear the input field
    }

  return (
    <Animated.View style={[styles.container, {height: yAnim}]}>
      <ScrollView style={styles.commentsSection}>
        {commentsOnDB && Object.keys(commentsOnDB).map((key, index) => {
            return <SmallComment comment={commentsOnDB[key]} name={key} key={index} />
        })}
      </ScrollView>
      <View style={styles.inputSection}>
        <Input
          autoCapitalize='none'
          placeholder='Write a comment...'
          onChangeText={(text) => setCommentText(text)}>
        </Input>
        <TouchableOpacity onPress={() => sendComment()}>
            <Icon size={22} name="send" color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.closeButtonSection}>
      <TouchableOpacity onPress={()=> closeComments()} style={styles.closeButton}>
          <Text style={{color:'black'}}>Close</Text>
      </TouchableOpacity>
      </View>      
    </Animated.View>
  )
}

export default CommentsModal


const styles = StyleSheet.create({
    container: {
        position:'absolute',
        width: "100%",
        // height: "100%",
        backgroundColor:'rgba(240,240,240,1)',
        bottom: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 5,
        borderWidth:2,
        borderColor:'black'
    },
    closeButton:{
        width: 300,
        height: 25,
        justifyContent:'center',
        alignItems:'center',
    },
    closeButtonSection: {
        position:'absolute',
        bottom: 0,
        width: "100%",
        justifyContent:'center',
        alignItems:'center',

    },
    commentsSection: {
        width: '100%',
        height: '90%',
    },
    inputSection: {
        position:'absolute',
        width: '100%',
        height: 20,
        bottom: 40,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',

    }
})