import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config'

export class ProfileRecentPosts extends Component {
    render() {
        return (
            <View style={styles.component}>
                <Text>Choose file</Text>
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
        height: 400,
        backgroundColor: "rgba(250,250,250,0.9)",
        marginTop: 5,
        marginBottom: 5,
        borderRadius:20,
        padding: 5,
        zIndex: 10

    }
})
