import React, { createRef, useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../firebase";
import { ScrollView } from "react-native-gesture-handler";
import PostComponent from "../components/PostComponent";
import { TouchableOpacity } from "react-native";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import AvatarModal from "../components/AvatarModal";
import { TapGestureHandler } from "react-native-gesture-handler";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  useWindowDimensions,
  Animated,
} from "react-native";
import {
  Button,
  Image,
  Icon,
} from "react-native-elements";

//TODO: change some getDoc's to onSnapshot for efficiency and realtime updates
//Change scrollview to flatlist
//Logout alert is not good. change yes no to confirm cancel etc 

const ProfilePage = ({ navigation }) => {
  const user = auth?.currentUser;
  const userUID = user?.uid;
  const storage = getStorage();
  const singleTapRef = createRef();
  const expandAnimation = useRef(new Animated.Value(120)).current;
  const window = useWindowDimensions();

  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [image, setImage] = useState(null);
  const [postIDs, setPostIDs] = useState([]);
  const [isShown, setIsShown] = useState(false);
  const [currentBio, setCurrentBio] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const getBiographyText = () =>  onSnapshot(doc(db, "useruid", `${ userUID }`), (doc) =>
      setCurrentBio(doc?.data()?.bio))

    const getAvatar = () => getDownloadURL(ref(storage, `Users/${ userUID }/avatars/avatar_image`))
      .then((url) => setImage(url))
      .catch((error) => console.log(`Error occured: `, error));

    const getTotalFollowerCount = () => onSnapshot(doc(db, "useruid", `${ userUID }`), (doc) =>
      setFollowerCount(doc.data().followers.length))

    const getTotalFollowingCount = () => onSnapshot(doc(db, "useruid", `${ userUID }`), (doc) =>
      setFollowingCount(doc.data().following.length)
    )

    const redirectIfAuthFails = () => auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        navigation.reset({
          index: 0,
          routes: [{
            name: "Login"
          }],
        })
      }
    })

    const getPostIds = async () => {
      const postIds = await getDoc(doc(db, "posts", `${ userUID }`))

      if (postIds) setPostIDs(postIds.data()?.postID)
    }

    getBiographyText();
    getAvatar();
    getTotalFollowerCount();
    getTotalFollowingCount();
    redirectIfAuthFails();
    getPostIds();
  }, [])

  const navigate = (destination) => navigation.navigate(destination);

  const showLogoutConfirm = () => {
    return Alert.alert(
      "Your second chance!",
      "Are you sure you want to logout?",
      [
        {
          text: "Yes",
          onPress: async () => await auth.signOut(),
        },
        {
          text: "No",
        },
      ]
    )
  }

  const expand = () => {
    if (!isExpanded) {
      setIsExpanded(true)

      Animated.timing(expandAnimation, {
        toValue: 190,
        duration: 500,
        useNativeDriver: false,
      }).start()
    } else {
      setIsExpanded(false)
      setIsShown(false)

      Animated.timing(expandAnimation, {
        toValue: 120,
        duration: 500,
        useNativeDriver: false,
      }).start()
    }
  }

  return (
    <>
      <TapGestureHandler
        onActivated={() => expand()}
        numberOfTaps={1}
        ref={singleTapRef}
      >
        <Animated.View
          style={[
            styles.container,
            { width: window.width - 5 },
            { height: expandAnimation },
          ]}
        >
          <StatusBar style="light"></StatusBar>
          <View style={ styles.header }>
            <Button
              onPress={ () => navigate("Settings") }
              titleStyle={{ color: 'black', fontSize: 15 }}
              buttonStyle={ styles.settingsButton }
              title={ <Icon name="settings" color='black' /> }
            />
            <View>
              <Text
                style={{
                  fontWeight: "800",
                  letterSpacing: 0.5,
                  color: 'black',
                }}
              >
                { user.displayName }
              </Text>
            </View>
            <Button
              onPress={ showLogoutConfirm }
              titleStyle={{ color: 'black', fontSize: 15 }}
              buttonStyle={ styles.logoutButton }
              title={ <Icon name="logout" color='black' /> }
            />
          </View>
          <View style={styles.profileTop}>
            <View style={{ flexDirection: "column" }}>
              { isShown && isExpanded ? <AvatarModal changeModalStatus={setIsShown} /> : null }
              <TouchableOpacity onPress={ () => setIsShown(!isShown) }>
                <Image
                  source={{ uri: image }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 60 / 2,
                    marginBottom: 15,
                  }}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                marginRight: 15,
                marginLeft: 15,
                textAlign: "center",
              }}
            >
              {currentBio}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity
                onPress={() => navigate("Followers & Following")}
              >
                <Text
                  style={[
                    styles.followersInfo,
                    { color: 'black' },
                  ]}
                >
                  {followerCount} Followers
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigate("Followers & Following")}
              >
                <Text
                  style={[
                    styles.followersInfo,
                    { color: 'black' },
                  ]}
                >
                  {followingCount} Following
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  styles.followersInfo,
                  { color: 'black' },
                ]}
              >
                {postIDs.length} Posts
              </Text>
            </View>
          </View>
        </Animated.View>
      </TapGestureHandler>
      <ScrollView contentContainerStyle={[{ flexGrow: 1, alignItems: "center" }]}>
        { postIDs.length
          ? postIDs.reverse().map((postID, index) => <PostComponent key={`${ index }`} postID={ postID } />)
          : <Text style={{ color: "white", fontSize: 20, marginTop: 25 }}>No Posts</Text>
        }
        <View style={{
            width: "100%",
            height: 60,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Image
            source={require("../assets/w1logocrimson.png")}
            style={ styles.logoBottom }
          />
        </View>
      </ScrollView>
    </>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  logoutButton: {
    marginTop: 5,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  settingsButton: {
    marginTop: 5,
    width: 45,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  topLogout: {
    position: "absolute",
    alignItems: "flex-end",
    right: 0,
    zIndex: 10,
  },
  topSettings: {
    position: "absolute",
    alignItems: "flex-end",
    width: 85,
    left: 0,
    zIndex: 10,
  },
  container: {
    backgroundColor: "#fff", // #222222 for dark
    overflow: "hidden",
    alignSelf: "center",
  },
  followersInfo: {
    color: "black",
    margin: 5,
    textAlign: "center",
    fontWeight: "700",
  },
  profileTop: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    height: 160,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  logoBottom: {
    width: 50,
    height: 50,
    zIndex: 10,
  },
});
