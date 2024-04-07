/* eslint-disable no-unused-vars */
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Home from '../components/HomePageNavigationPages/Home';
import CreateFromNav from '../components/HomePageNavigationPages/CreateFromNav';
import DMPage from '../components/HomePageNavigationPages/DMPage';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { auth, db } from '../firebase';

const HomePage = ({ navigation }) => {
    const Tab = createMaterialBottomTabNavigator();

    const [activePage, setActivePage] = useState('Home');
    const [homeIcon, setHomeIcon] = useState('home-outline');
    const [createIcon, setCreateIcon] = useState('plus-outline');
    const [dmIcon, setDmIcon] = useState('message-outline');
    const [selectedTheme, setSelectedTheme] = useState('');
    const [textColorDependingOnTheme, setTextColorDependingOnTheme] = useState('');

    //improve this
    useEffect(() => {
        if (activePage === 'Home') {
            setHomeIcon('home');
            setCreateIcon('plus-outline');
            setDmIcon('message-outline');
        } else if (activePage === 'Create') {
            setCreateIcon('plus');
            setHomeIcon('home-outline');
            setDmIcon('message-outline');
        } else if (activePage === 'DM') {
            setDmIcon('message');
            setHomeIcon('home-outline');
            setCreateIcon('plus-outline');
        } else {
            console.log('what\'s happening bro');
        }
    }, [activePage]);

    const iconComponent = (icon) => <Icon name={ icon } type='material-community' color={ textColorDependingOnTheme } />;

    return (
        <>
            <View style={[styles.top, selectedTheme === 'dark' ? { backgroundColor: 'rgb(15,15,15)' } : {}]}>
                <StatusBar style="light"></StatusBar>
                <View style={ styles.topSearch }>
                    <Button
                        onPress={ () => navigation.navigate('Search') }
                        titleStyle={{ color: 'white', fontSize: 15 }}
                        buttonStyle={ styles.searchButton }
                        title={ <Icon name="search" color={textColorDependingOnTheme} /> }/>
                </View>
                <TouchableOpacity style={ styles.reloadIcon }>
                    <Image
                        source={ require('../assets/w1logocrimson.png') }
                        style={ styles.reloadIconImage }
                    />
                </TouchableOpacity>
                <View style={{ height: 50 }}></View>
                <View style={ styles.topProfile }>
                    <Button
                        onPress={() => navigation.navigate('Profile')}
                        titleStyle={{ color: 'white', fontSize: 15 }}
                        buttonStyle={ styles.profileButton }
                        title={ <Icon name="account-circle" color={textColorDependingOnTheme} /> }/>
                </View>
            </View>
            <View style={[styles.bottom, selectedTheme === 'dark' ? { backgroundColor: 'rgb(15,15,15)' } : {}]}>
                <View style={ styles.bottomContents }>
                    {{
                        Home: <Home />,
                        Create: <CreateFromNav />,
                        DM: <DMPage />
                    }[activePage]}
                </View>
            </View>
            <View style={[styles.bottomNavBar, selectedTheme === 'dark' ? { backgroundColor: 'rgb(15,15,15)' } : {}]}>
                <Animated.View style={ styles.TO }>
                    <TouchableOpacity onPress={ () => setActivePage('Home') } style={ styles.TO }>
                        { iconComponent(homeIcon) }
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={ styles.TO }>
                    <TouchableOpacity onPress={ () => setActivePage('Create') } style={ styles.TO }>
                        { iconComponent(createIcon) }
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={ styles.TO }>
                    <TouchableOpacity onPress={ () => setActivePage('DM') } style={ styles.TO }>
                        { iconComponent(dmIcon) }
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </>
    );
};

export default HomePage;

const styles = StyleSheet.create({
    reloadIconImage: {
        width: 50,
        height: 50,
        position: 'absolute'
    },
    reloadIcon: {
        width: 50,
        height: 50,
        position: 'absolute'
    },
    TO: {
        width: '33%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomNavBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '7%',
        backgroundColor: '#ffffff',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    topSearch: {
        position: 'absolute',
        alignItems: 'flex-end',
        width: 85,
        left: 0,
        zIndex: 10,

    },
    profileButton: {
        marginTop: 5,
        width: 60,
        borderWidth: 0,
        backgroundColor: 'transparent',
    },
    searchButton: {
        marginTop: 5,
        width: 110,
        borderWidth: 0,
        backgroundColor: 'transparent',
    },
    topProfile: {
        position: 'absolute',
        alignItems: 'flex-end',
        width: 100,
        right: 0,
        zIndex: 10,

    },
    top: {
        height: 50,
        alignItems: 'center'
    },
    bottom: {
        height: '87%',
        zIndex: 10
    }
});