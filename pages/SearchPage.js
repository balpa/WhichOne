import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View, Text, KeyboardAvoidingView, Image } from 'react-native'
import { Button, Input, Icon } from 'react-native-elements/'
import { useState, useLayoutEffect } from "react"
import { auth } from "../firebase";
import { db } from "../firebase"
import { Alert } from 'react-native'
import firebase from 'firebase/compat/app'

const SearchPage = ({ navigation }) => {


    const [searchUsername, setSearchUsername] = useState("")
    const [isFollowing, setIsFollowing] = useState(false)
    const [exists, setExists] = useState(false)
    const [searchedUsersUID, setSearchedUsersUID] = useState("")
    const [followSituation, setFollowSituation] = useState(false)

    const loggedinUser = auth.currentUser


    // FOLLOW-UNFOLLOW WORKS BUT NEED TO ADD STATE CHECK BY QUERYING THE USER'S UID

    // follow button func
    function follow () {   
        const addToFollowingForFollowingUser = db.collection('useruid')
            .doc(`${loggedinUser.uid}`)
            .update({
                following: firebase.firestore.FieldValue.arrayUnion(searchedUsersUID)
            })
        const addToFollowersForSearchedUser = db.collection('useruid')
            .doc(`${searchedUsersUID}`)
            .update({
                followers: firebase.firestore.FieldValue.arrayUnion(loggedinUser.uid)
            })

        setFollowSituation(true)

    }
    // unfollow button func
    function unfollow () {
        const removeFromFollowingForFollowingUser = db.collection('useruid')
            .doc(`${loggedinUser.uid}`)
            .update({
                following: firebase.firestore.FieldValue.arrayRemove(searchedUsersUID)
        })
        const removeFromFollowersForSearchedUser = db.collection('useruid')
            .doc(`${searchedUsersUID}`)
            .update({
                followers: firebase.firestore.FieldValue.arrayRemove(loggedinUser.uid)
            })
        setFollowSituation(false)
    }


    // searched user's component
    const UserSearchProfile = () => {
        return (
            <View style={styles.component}>
                <View style={styles.userSearchProfile}>
                    <Image 
                    source={{
                        uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLfn6eqrsbTp6+zg4uOwtrnJzc/j5earsbW0uby4vcDQ09XGyszU19jd3+G/xMamCvwDAAAFLklEQVR4nO2d2bLbIAxAbYE3sDH//7WFbPfexG4MiCAcnWmnrzkjIRaD2jQMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMw5wQkHJczewxZh2lhNK/CBOQo1n0JIT74/H/qMV0Z7GU3aCcVPuEE1XDCtVLAhgtpme7H0s1N1U7QjO0L8F7llzGeh1hEG/8Lo7TUmmuSrOfns9xnGXpXxsONPpA/B6OqqstjC6Ax/0ujkNdYQQbKNi2k64qiiEZ+ohi35X+2YcZw/WujmslYewiAliVYrxgJYrdwUmwXsU+RdApUi83oNIE27YvrfB/ZPg8+BJETXnqh9CVzBbTQHgojgiCvtqU9thFJg/CKz3VIMKMEkIXxIWqIpIg2SkjYj+xC816mrJae2aiWGykxRNsW0UwiJghJDljYI5CD8GRiCtIsJxizYUPQ2pzItZy5pcisTRdk/a9m4amtNNfBuQkdVhSaYqfpNTSFGfb9GRIakrE2Pm+GFLaCQPqiu0OpWP+HMPQQcgQMiQprWXNmsVwIjQjYi/ZrhAqNTCgr2gu0Jnz85RSSjso0HkMFZ0YZjKkc26a/jlmh9JiDyDxi9oeorTYAzZkwwoMz19pzj9bnH/GP/+qbchjSGflneWYhtTuKdMOmNKZcJ5TjInQKcYXnESd/jQxy0ENpULTNGOGgxpap/oyw9pbUAqhfx2Dbkhovvfgz4iUzoM9+GlK6/Mh4q29hyC1mwro30hpVVLPF9wYQr71RazOeM5/cw81iBRD+A03aM9/C/obbrKjbYSpCmIVG3qT/Q8oeUo3Rz0IL7vI1tEbCB9pSiu8I/aV8x3Kg/BGWrWp4ZVs0nZfmAoEG4h/61yHYIJiFSl6Q0Vk6tTW1N8kYp8hdOkfHYYMXd2Qft+8CYwqYDSKvqIh+MCF8Wgca2u/cwdgeW3TtuVn6+1oBs3yLo5C2JpK6CvQzGpfUkz9UG/87gCsi5o2LIXolxN0FbwAsjOLEr+YJmXn7iR6N0BCt5p5cMxm7eAsfS+/CACQf4CTpKjzgkvr2cVarVTf96372yut7XLJ1sa7lv6VcfgYrWaxqr3Wlo1S6pvStr22sxOtTNPLzdY3nj20bPP+ejFdJYkLsjGLdtPBEbe/mr2bQKiXWJDroA+vtzc0p9aahuwqHMDYrQEXHEw9jwQl3drMpts9JBU1SdktPe5FBRdJQ6bwXBpa57ib2A8kukQDzMjh++Uo7Fo6Wd02Pkf4fknqoo4HtvAIjsqUcjx6DIPgWCaOML9rKI/oqD9/lgNrn+eF+p7j8tnzHBiR7+kdUGw/+V1Kzkc75mMy6U+FMaxjPibiM1U1uGM+puInHpmALZCgP4pt7i840MV8+0R1zPsRB6UTcqpizncYwZ89syDydfyWCwXB1l8/zRNGWbTG/GHKUm9AkxHMc/EGSk3z2+ArEhPEV5TUBLEvUGFcjEUH80J/jveTGOAJEljJbILWGQT3zRYiwuKsUXN1EEJAzBhRJFll7mBUG7KD8EqPkKekBREaL8hMDZLQSG6AQjtHPYmvTQnX0TtpC1SYCe2YdkkyLP3jj5BSbKiuR585eQhTgoje6yIb0Yb0C+mV6EYvebqw5SDy2WmubogZiF2AVxPC2FpDf8H2Q9QWo6IkjUxTWVEI3WY/wrCeSuqJ+eRWzXR/JXwgVjUMozbCOfoEZiSiKVGepqv5CJ8RyR4D7xBeamqa7z3BJ/z17JxuBPdv93d/a2Ki878MMAzDMAzDMAzDMAzDMF/KP09VUmxBAiI3AAAAAElFTkSuQmCC"
                    }}
                    style={{ width: 35, height: 35, borderRadius: 35/2}}
                    />
                    <Text style={{fontSize: 15}}> {searchUsername}</Text>
                    <Button onPress={followSituation === true ? unfollow : follow} buttonStyle={{ marginLeft: 20, width: 50, height: 30, borderRadius: 10}} titleStyle={{fontSize: 10}} title={followSituation === true ? "Unfollow" : "Follow"}/>
                </View>
            </View>
        )}


    // searching for a user
    const [searchVal, setSearchVal] = useState("")

    const search = () => {
        if (searchVal.length > 3 && searchVal.length < 15) {
            db.collection('usernames')
            .doc(`${searchVal.toLowerCase()}`)
            .get()
            .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
                setExists(true)
                let userData = documentSnapshot.data()
                setSearchUsername(userData.name)  // searched user's name
                setSearchedUsersUID(userData.UID) // searched user's UID
                console.log(userData)
        } else {
            Alert.alert("User not found!")
        }});
    } else {
        Alert.alert("Username must be between 3 and 15 characters.")
    }}



    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light"/>
            <View style={styles.elevation}>
                <View style={{height: 20}}></View>
            <View style={{width: 250}}>
                <Input autoCapitalize="none" style={{color: "white", width: 250}} selectionColor="white"  autoFocus placeholder="Search by username" value={searchVal} onChangeText={(text) => setSearchVal(text)}/>
            </View>
            <Button buttonStyle={{backgroundColor: "crimson", borderRadius: 15, width: 80, height: 35}} titleStyle={{fontSize: 15}} onPress={search} title={
                <Icon size={20} name="person-search" color="white" />
            }/>
            {searchUsername.length > 1 ? <UserSearchProfile /> : null}
            <View style={{height: 100}}/>
            </View>
        </KeyboardAvoidingView>
    )
}

export default SearchPage

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#243447",
        justifyContent: "center",
        alignItems: "center"
    },
    component: {
        width: 250,
        height: 50,
        backgroundColor: "#AEAEAE",
        marginTop: 20,
        marginBottom: 5,
        borderRadius:20,
        padding: 7
    },
    userSearchProfile: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"


    },
    elevation:{
        width: 300,
        height: 500,
        justifyContent: "center", alignItems: "center", 
        backgroundColor: "rgba(255,255,255,0.1)",
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 5,
        borderRadius: 40,
    },
})
