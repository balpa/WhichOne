import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config'

export class ProfileRecentPosts extends Component {
    render() {
        return (
            <View style={styles.component}>
               
            </View>
        )
    }
}

export default ProfileRecentPosts

const styles = StyleSheet.create({
    component: {
        justifyContent: "center",
        alignItems: "center",
        width: 350,
        height: 200,
        backgroundColor: "#AEAEAE",
        marginTop: 5,
        marginBottom: 5,
        borderRadius:20,
        padding: 5

    }
})
