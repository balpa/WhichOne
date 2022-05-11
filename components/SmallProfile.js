import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, KeyboardAvoidingView, Image } from 'react-native'
import { Button, Input, Icon } from 'react-native-elements/'
import { auth } from "../firebase";
import { db } from "../firebase"
import firebase from 'firebase/compat/app'
import { doc, onSnapshot } from "firebase/firestore"
import { getStorage, ref, getDownloadURL } from "firebase/storage";


export default function SmallProfile({ userID }) {

    return (
        <View >
            <View >
                <Image style={{width: 70, height: 70, borderRadius: 70/2}}/>
                <Text style={{fontSize: 25, color:"white"}}></Text>
            </View>
            <View >
                <View style={{flexDirection: "row"}}>
                    <Text style={styles.followersInfo}>{"\n"}Followers</Text>
                    <Text style={styles.followersInfo}>{"\n"}Following</Text>
                    <Text style={styles.followersInfo}>0{"\n"}Posts</Text>
                </View>
            </View>
        </View>
    )}


    const styles = StyleSheet.create({
        
    })
    