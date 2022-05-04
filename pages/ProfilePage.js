import React from 'react'
import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { Button, Image, Input, TouchableHighlight, Icon } from "react-native-elements"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/native';
import firebase from 'firebase/app';
import { auth } from '../firebase'
import { db } from '../firebase'
import { ScrollView } from 'react-native-gesture-handler'
import ProfileRecentPosts from '../components/ProfileRecentPosts'
import { TouchableOpacity } from 'react-native'
import { doc, onSnapshot } from "firebase/firestore";

const ProfilePage = ({ navigation }) => {

    const [followerCount, setFollowerCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)

    const user = auth.currentUser;

    // get total follower count
    const getTotalFollowerCount = onSnapshot(doc(db, "useruid", `${user.uid}`), (doc) => {
      setFollowerCount(doc.data().followers.length)
    })
    // get total following count
    const getTotalFollowingCount = onSnapshot(doc(db, "useruid", `${user.uid}`), (doc) => {
      setFollowingCount(doc.data().following.length)
    })

    const showLogoutConfirm = () => {
    return Alert.alert(
      "Your second chance!",
      "Are you sure you want to logout?",
      [
        {
          text: "Yes",
          onPress: async () => {
            await auth.signOut()
            console.log(auth)
          },
        },
        {
          text: "No",
        },
      ]
    );
    };

    const logout = async () => {
      await auth.signOut()
      console.log(auth)
    }

    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (!authUser) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
        }
    });
    }, [])

    return (
        <>
        <View style={styles.container}>
            <StatusBar style="light"></StatusBar>
            <View style={styles.topSettings}>
                <Button onPress={() => navigation.navigate("Settings")} titleStyle={{color: "white", fontSize: 15}} buttonStyle={styles.settingsButton} title={
                  <Icon name="settings" color="white" />
                }/>
            </View>
            <View style={styles.topLogout}>
                <Button onPress={showLogoutConfirm} titleStyle={{color: "white", fontSize: 15}} buttonStyle={styles.logoutButton} title={
                  <Icon name="logout" color="white" />
                }/>
            </View>
            <View style={{justifyContent: "center", alignItems: "center", marginTop: 10}}>
                <Image 
                source={{
                    uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLfn6eqrsbTp6+zg4uOwtrnJzc/j5earsbW0uby4vcDQ09XGyszU19jd3+G/xMamCvwDAAAFLklEQVR4nO2d2bLbIAxAbYE3sDH//7WFbPfexG4MiCAcnWmnrzkjIRaD2jQMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMw5wQkHJczewxZh2lhNK/CBOQo1n0JIT74/H/qMV0Z7GU3aCcVPuEE1XDCtVLAhgtpme7H0s1N1U7QjO0L8F7llzGeh1hEG/8Lo7TUmmuSrOfns9xnGXpXxsONPpA/B6OqqstjC6Ax/0ujkNdYQQbKNi2k64qiiEZ+ohi35X+2YcZw/WujmslYewiAliVYrxgJYrdwUmwXsU+RdApUi83oNIE27YvrfB/ZPg8+BJETXnqh9CVzBbTQHgojgiCvtqU9thFJg/CKz3VIMKMEkIXxIWqIpIg2SkjYj+xC816mrJae2aiWGykxRNsW0UwiJghJDljYI5CD8GRiCtIsJxizYUPQ2pzItZy5pcisTRdk/a9m4amtNNfBuQkdVhSaYqfpNTSFGfb9GRIakrE2Pm+GFLaCQPqiu0OpWP+HMPQQcgQMiQprWXNmsVwIjQjYi/ZrhAqNTCgr2gu0Jnz85RSSjso0HkMFZ0YZjKkc26a/jlmh9JiDyDxi9oeorTYAzZkwwoMz19pzj9bnH/GP/+qbchjSGflneWYhtTuKdMOmNKZcJ5TjInQKcYXnESd/jQxy0ENpULTNGOGgxpap/oyw9pbUAqhfx2Dbkhovvfgz4iUzoM9+GlK6/Mh4q29hyC1mwro30hpVVLPF9wYQr71RazOeM5/cw81iBRD+A03aM9/C/obbrKjbYSpCmIVG3qT/Q8oeUo3Rz0IL7vI1tEbCB9pSiu8I/aV8x3Kg/BGWrWp4ZVs0nZfmAoEG4h/61yHYIJiFSl6Q0Vk6tTW1N8kYp8hdOkfHYYMXd2Qft+8CYwqYDSKvqIh+MCF8Wgca2u/cwdgeW3TtuVn6+1oBs3yLo5C2JpK6CvQzGpfUkz9UG/87gCsi5o2LIXolxN0FbwAsjOLEr+YJmXn7iR6N0BCt5p5cMxm7eAsfS+/CACQf4CTpKjzgkvr2cVarVTf96372yut7XLJ1sa7lv6VcfgYrWaxqr3Wlo1S6pvStr22sxOtTNPLzdY3nj20bPP+ejFdJYkLsjGLdtPBEbe/mr2bQKiXWJDroA+vtzc0p9aahuwqHMDYrQEXHEw9jwQl3drMpts9JBU1SdktPe5FBRdJQ6bwXBpa57ib2A8kukQDzMjh++Uo7Fo6Wd02Pkf4fknqoo4HtvAIjsqUcjx6DIPgWCaOML9rKI/oqD9/lgNrn+eF+p7j8tnzHBiR7+kdUGw/+V1Kzkc75mMy6U+FMaxjPibiM1U1uGM+puInHpmALZCgP4pt7i840MV8+0R1zPsRB6UTcqpizncYwZ89syDydfyWCwXB1l8/zRNGWbTG/GHKUm9AkxHMc/EGSk3z2+ArEhPEV5TUBLEvUGFcjEUH80J/jveTGOAJEljJbILWGQT3zRYiwuKsUXN1EEJAzBhRJFll7mBUG7KD8EqPkKekBREaL8hMDZLQSG6AQjtHPYmvTQnX0TtpC1SYCe2YdkkyLP3jj5BSbKiuR585eQhTgoje6yIb0Yb0C+mV6EYvebqw5SDy2WmubogZiF2AVxPC2FpDf8H2Q9QWo6IkjUxTWVEI3WY/wrCeSuqJ+eRWzXR/JXwgVjUMozbCOfoEZiSiKVGepqv5CJ8RyR4D7xBeamqa7z3BJ/z17JxuBPdv93d/a2Ki878MMAzDMAzDMAzDMAzDMF/KP09VUmxBAiI3AAAAAElFTkSuQmCC"
                }}
                style={{ width: 60, height: 60, borderRadius: 60/2, marginBottom: 15}}
                />
                <Text style={{fontWeight: "900", letterSpacing: 1, color: "white"}}>{user.displayName}</Text>
                <View style={{flexDirection: "row"}}>
                  <Text style={styles.followersInfo}>Followers{"\n"}{followerCount}</Text>
                  <Text style={styles.followersInfo}>Following{"\n"}{followingCount}</Text>
                  <Text style={styles.followersInfo}>Posts{"\n"}</Text>
                </View>
            </View>
            
        </View>
        <View style={{height: 2, backgroundColor: "white"}}></View>
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', backgroundColor: "#243447",  }} style={styles.profileBody}>
                <ProfileRecentPosts />
                <ProfileRecentPosts />
                <ProfileRecentPosts />
                <ProfileRecentPosts />
                <ProfileRecentPosts />
                <ProfileRecentPosts />
                <ProfileRecentPosts />
        </ScrollView>
        </>

    )
}

export default ProfilePage

const styles = StyleSheet.create({
    logoutButton: {
        marginTop: 5,
        width: 45,
        borderWidth: 0,
        backgroundColor: "transparent",
    },
    settingsButton: {
      marginTop: 5,
      width: 120,
      borderWidth: 0,
      backgroundColor: "transparent",
  },
    topLogout: {
        position: "absolute",
        alignItems: "flex-end",
        width: 100,
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
        height: 150,
        backgroundColor: "#243447",
        overflow: "hidden",
    },
    profileBody: {
    },
    followersInfo: {
      color: "white",
      margin: 5, 
      textAlign:"center"
    }


})