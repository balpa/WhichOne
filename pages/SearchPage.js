import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Animated,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { Input } from "react-native-elements/";
import { useState } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import { Alert } from "react-native";
import firebase from "firebase/compat/app";
import { doc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import UserSearchProfile from "../components/UserSearchProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchPage = ({ navigation }) => {
  const [searchUsername, setSearchUsername] = useState("")
  const [isFollowing, setIsFollowing] = useState(false)
  const [exists, setExists] = useState(false)
  const [searchedUsersUID, setSearchedUsersUID] = useState("")
  const [followSituation, setFollowSituation] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [isSearchedMyself, setIsSearchedMyself] = useState(false)
  const [image, setImage] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSearchedAndNoUser, setIsSearchedAndNoUser] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState("")
  const [textColorDependingOnTheme, setTextColorDependingOnTheme] = useState("")
  const [showActivityIndicator, setShowActivityIndicator] = useState(false)
  const [searchButtonPressed, setSearchButtonPressed] = useState(false)
  const [searchVal, setSearchVal] = useState("")

  const windowDim = useWindowDimensions()

  const searchBarWidthAnim = React.useRef(new Animated.Value(0)).current

  const loggedinUser = auth.currentUser

  const storage = getStorage()


  useEffect(() => {
    Animated.timing(searchBarWidthAnim, {
      toValue: windowDim.width,
      duration: 700,
      useNativeDriver: false,
    }).start()
  }, [])

  // get searched user's avatar
  useEffect(() => {
    getDownloadURL(
      ref(storage, `Users/${searchedUsersUID}/avatars/avatar_image`)
    )
      .then((url) => { if (url) setImage(url) })
      .catch((error) => {
        setImage(null); console.log(error)
      })
  }, [searchedUsersUID])

  // FOLLOW-UNFOLLOW WORKS BUT NEED TO ADD STATE CHECK BY QUERYING THE USER'S UID

  function follow() {
    if (searchedUsersUID !== loggedinUser.uid) {
      const addToFollowingForFollowingUser = db
        .collection("useruid")
        .doc(`${loggedinUser.uid}`)
        .update({
          following: firebase.firestore.FieldValue.arrayUnion(searchedUsersUID),
        });
      const addToFollowersForSearchedUser = db
        .collection("useruid")
        .doc(`${searchedUsersUID}`)
        .update({
          followers: firebase.firestore.FieldValue.arrayUnion(loggedinUser.uid),
        });
    }
  }
  // unfollow button func
  function unfollow() {
    if (searchedUsersUID !== loggedinUser.uid) {
      const removeFromFollowingForFollowingUser = db
        .collection("useruid")
        .doc(`${loggedinUser.uid}`)
        .update({
          following: firebase.firestore.FieldValue.arrayRemove(searchedUsersUID),
        })
      const removeFromFollowersForSearchedUser = db
        .collection("useruid")
        .doc(`${searchedUsersUID}`)
        .update({
          followers: firebase.firestore.FieldValue.arrayRemove(
            loggedinUser.uid
          ),
        })
    }
  }

  // get searched user's follower and following count depending on searcheced user's uid.
  useEffect(() => {
    if (searchedUsersUID !== "") {
      // get total follower count
      const getTotalFollowerCount = onSnapshot(
        doc(db, "useruid", `${searchedUsersUID}`),
        (doc) => { setFollowerCount(doc.data().followers.length) }
      )
      // get total following count
      const getTotalFollowingCount = onSnapshot(
        doc(db, "useruid", `${searchedUsersUID}`),
        (doc) => { setFollowingCount(doc.data().following.length) }
      )
    }
  }, [searchedUsersUID])

  // search for if the user searched for themselves
  useEffect(() => {
    if (loggedinUser.uid === searchedUsersUID) setIsSearchedMyself(true)
    else setIsSearchedMyself(false)
  }, [searchedUsersUID])

  // check if the user is following the searched user
  useEffect(() => {
    if (searchedUsersUID !== "") {
      const isFollowingSearchedUser = onSnapshot(
        doc(db, "useruid", `${searchedUsersUID}`),
        (doc) => {
          if (searchedUsersUID === loggedinUser.uid) setFollowSituation(true)
          else setFollowSituation(doc.data().followers.includes(loggedinUser.uid))
        }
      )
    }
  }, [searchedUsersUID])

  // searched user's component
  // const UserSearchProfile = React.memo(() => {

  //     const springAnim = useRef(new Animated.Value(1000)).current

  //     useEffect(() => {
  //         Animated.spring(springAnim, {
  //             toValue: 0,
  //             duration: 1000,
  //             useNativeDriver: true,
  //           }).start()
  //     }, [])

  //     return (
  //         <Animated.View style={[styles.component, {transform: [{translateY: springAnim}]}]}>
  //             <View style={styles.imageNameField}>
  //                 <Image source={{uri: image}} style={{width: 70, height: 70, borderRadius: 70/2}}/>
  //                 <Text style={{fontSize: 25, color:"white"}}> {searchUsername}</Text>
  //             </View>
  //             <View style={styles.userSearchProfile}>
  //                 <View style={{flexDirection: "row"}}>
  //                     <Text style={styles.followersInfo}>{followerCount}{"\n"}Followers</Text>
  //                     <Text style={styles.followersInfo}>{followingCount}{"\n"}Following</Text>
  //                     <Text style={styles.followersInfo}>0{"\n"}Posts</Text>
  //                 </View>

  //                 {!followSituation && <Button onPress={follow} buttonStyle={styles.followButton} titleStyle={{fontSize: 10}} title={"Follow"}/>}
  //                 {followSituation && <Button onPress={unfollow} buttonStyle={styles.followButton} titleStyle={{fontSize: 10}} title={"Following"}/>}
  //             </View>
  //         </Animated.View>
  //     )})

  // searching for a user

  const search = () => {
    if (searchVal.length > 3 && searchVal.length < 15) {
      db.collection("usernames")
        .doc(`${searchVal.toLowerCase()}`)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            setIsSearchedAndNoUser(false)
            setExists(true)
            let userData = documentSnapshot.data()
            setSearchUsername(userData.name) // searched user's name
            setSearchedUsersUID(userData.UID) // searched user's UID

          } else { console.log("No user"); setIsSearchedAndNoUser(true) } // searched and no user found
        })
    } else { Alert.alert("Username must be between 3 and 15 characters.") }
  }

  // TODO: activity icon fix

  return (
    <View behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <View
        style={styles.elevation}
      >
        <Animated.View
          style={[styles.searchBar, { width: searchBarWidthAnim }]}
        >
          <Input
            label="Search by username"
            labelStyle={{ color: 'black', fontSize: 15 }}
            leftIcon={{
              type: "font-awesome",
              name: "search",
              color: 'black',
              onPress: () => search(),
            }}
            returnKeyType="search"
            onSubmitEditing={() => search()}
            // onKeyPress={({ nativeEvent }) => {
            //   console.log(nativeEvent.key);
            //   if (nativeEvent.key === "Enter") search();
            // }}
            autoCapitalize="none"
            style={{
              color: 'black',
              width: "100%",
            }}
            selectionColor={'black'}
            placeholder="Jackqt"
            errorMessage={isSearchedAndNoUser == true ? "No user" : ""}
            onChangeText={(text) => setSearchVal(text)}
          />
          {/* <Button buttonStyle={{backgroundColor: "transparent", borderRadius: 15, width: "auto", height: "auto"}} titleStyle={{fontSize: 15}} 
                            onPress={search} title={<Icon size={30} name="search" color="black" />}/> */}
        </Animated.View>

        {exists == true ? (
          <UserSearchProfile
            searchedUsersUID={searchedUsersUID}
            loggedinUser={loggedinUser}
            image={image}
            searchUsername={searchUsername}
            followerCount={followerCount}
            followingCount={followingCount}
            followSituation={followSituation}
          />
        ) : (
          <ActivityIndicator size="large" color="crimson" />
        )}

        <Image
          source={require("../assets/w1logocrimson.png")}
          style={styles.logoBottom}
        />
      </View>
    </View>
  );
};

export default SearchPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  imageNameField: {
    height: "50%",
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  searchBar: {
    width: "100%",
    height: 100,
    left: 0,
    position: "absolute",
    top: "1%",
    display: "flex",
    flexDirection: "row",
  },
  component: {
    width: "100%",
    height: 250,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    top: -200,
  },
  userSearchProfile: {
    width: "100%",
    height: "50%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  followersInfo: {
    color: "white",
    margin: 10,
    textAlign: "center",
  },
  elevation: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", //rgba(255,255,255,0.1)
    elevation: 5,
  },
  followButton: {
    width: 100,
    backgroundColor: "crimson",
  },
  logoBottom: {
    position: "absolute",
    width: 50,
    height: 50,
    bottom: 10,
    zIndex: 10,
  },
});
