import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MessagePerson from '../DMComponents/MessagePerson'
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from '../../firebase'

const DMPage = () => {

  const COLOR_PALETTE_1 = ["FEF9A7","FAC213", "F77E21", "D61C4E", "990000", "FF5B00", "D4D925", "FFEE63"]

  const user = auth.currentUser

  const [following, setFollowing] = React.useState([])
  const [followers, setFollowers] = React.useState([])

  React.useEffect(() => {     // get follower and following list
    const getFollowers = onSnapshot(doc(db, "useruid", `${user.uid}`), 
    (doc) => setFollowers(doc.data().followers))

    const getFollowing = onSnapshot(doc(db, "useruid", `${user.uid}`), 
    (doc) => setFollowing(doc.data().following))
  }, [])

  return (
    <View style={styles.DMContainer}>
      <View style={styles.messagesTextTop}>
        <Text style={{fontSize:20,fontWeight:'800', fontStyle:'italic'}}>Messages</Text>
      </View>
      <View style={styles.messagePersonContainer}>
        {following.map((userID, index)=> {
          if (followers.includes(userID) && following.includes(userID)) {
          return <MessagePerson key={index} userID={userID} color={COLOR_PALETTE_1[Math.floor(Math.random()*COLOR_PALETTE_1.length)]}/>
          }
        })}
      </View>
    </View>
  )
}

export default DMPage


const styles = StyleSheet.create({
  DMContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width:'100%',
    height:'100%'
  },
  messagesTextTop: {
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    height:40,
    top: 0,
    borderBottomColor: 'black',
    borderTopColor:'black',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
  },
  messagePersonContainer: {
    width:'100%',
    height:'95%',
  }
})