/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';

const AboutPage = ({ navigation }) => (
    <>
        <View style={ styles.container }>
            <Text>WhichOne</Text>
        </View>
        <View style={ styles.logoBottomContainer }>
            <Image source={ require('../assets/w1logocrimson.png') } style={ styles.logoBottom } />
        </View>
    </>
);

export default AboutPage;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    logoBottom: {
        width: 50,
        height: 50,
        bottom: 0,
        zIndex: 2
    },
    logoBottomContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    },
});
