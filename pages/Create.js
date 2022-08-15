import React from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import CreatePost from '../components/CreatePost';

const Create = ({ navigation }) => {

    return (
        <>
        <View style={styles.container}>
            <CreatePost navigation={navigation}/> 
        </View>
        </>

    )
}

export default Create

const styles = StyleSheet.create({
    logoutButton: {
        width: 170,
        borderWidth: 0,
        backgroundColor: "transparent",
    },
    top: {
        alignItems: "flex-end"
    },
    container: {
        flex: 1,
        alignItems:"center",
        justifyContent: "center",
        backgroundColor: "rgba(15,15,15,1)",
        borderWidth: 1, 
    },
    profileBody: {
    }

})