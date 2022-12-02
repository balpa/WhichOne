import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
import { Button, Icon } from "react-native-elements"
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebase'
import { getDoc, doc, onSnapshot } from 'firebase/firestore'
import PostComponent from '../PostComponent'

const Home = ({ navigation }) => {

  const [dummy, setDummy] = useState(false)
  const [isShown, setIsShown] = useState(false)
  const [followingList, setFollowingList] = useState([])
  const [postComponentList, setPostComponentList] = useState({})
  const [components, setComponents] = useState([])
  const [allPostsFromFollowing, setAllPostsFromFollowing] = useState([])
  const [postIDsThatAlreadyRendered, setPostIDsThatAlreadyRendered] = useState([])

  const createPostFunc = () => { setIsShown(!isShown) }

  const user = auth.currentUser

  function reloadPage() { setDummy(!dummy) }

  useEffect(async () => {           // get list of people that logged in user follows
    await getDoc(doc(db, "useruid", `${user.uid}`)).then((doc) => setFollowingList(doc.data().following))
  }, [])

  // useEffect(async () => {

  //   if (allPostsFromFollowing.length > 0) {

  //     allPostsFromFollowing.map(async(postID, index) => {

  //       await getDoc(doc(db,'postInfo',`${postID}`)).then((docu)=>{

  //         if (docu.data() != undefined){

  //           let newComponent = <PostComponent key={postID} postID={postID} userID={docu.data().userID} name={docu.data().name} />

  //           if (components.length == 0) setComponents(old => [...old, newComponent])
  //           else if (components.length > 0){
  //             if (components.some((x) => x.key != postID)) setComponents(old => [...old, newComponent])
  //           }

  //         }})})
  //       }} , [allPostsFromFollowing])

  function setPosts() {
    followingList.map((id, index) => {
      onSnapshot(doc(db, "posts", `${id}`), (docu) => {
        if (docu.data() != undefined) docu.data().postID.map((item, index) => {
          if (allPostsFromFollowing.includes(item) === false) setAllPostsFromFollowing(old => [...old, item])
        })
      })
    })
  }

  useEffect(() => { setPosts() }, [followingList])

  console.log('ALL POSTS FROM FOLLOWING', allPostsFromFollowing)

  // TODO: big improvements done.

  return (
    <View style={styles.container}>
      {/* <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', backgroundColor: "#ffffff"  }}>
        {components}
      </ScrollView> */}
      {/* {allPostsFromFollowing && 
        <FlatList 
          data={allPostsFromFollowing}
          renderItem={({item}) => (<PostComponent key={item} postID={item}/>)} 
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => <Text style={styles.emptyText}>No messages yet</Text>}
          /> } */}
    </View>
  )
}

export default Home


const styles = StyleSheet.create({

  topSearch: {
    position: "absolute",
    alignItems: "flex-end",
    width: 85,
    left: 0,
    zIndex: 10,

  },
  profileButton: {
    marginTop: 5,
    width: 60,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  searchButton: {
    marginTop: 5,
    width: 110,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  topProfile: {
    position: "absolute",
    alignItems: "flex-end",
    width: 100,
    right: 0,
    zIndex: 10,

  },
  container: {
    backgroundColor: "#ffffff",
  },
})