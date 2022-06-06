import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Home from '../components/HomePageNavigationPages/Home'
import CreateFromNav from '../components/HomePageNavigationPages/CreateFromNav'
import DMPage from '../components/HomePageNavigationPages/DMPage'
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native'
import { Button, Icon } from "react-native-elements"
import React, {useEffect,useState} from 'react'
import { StatusBar } from 'expo-status-bar'
import { auth, db } from '../firebase'



const HomePage = ({navigation}) => {

    const [activePage, setActivePage] = React.useState('Home')
    const [homeIcon, setHomeIcon] = React.useState("home-outline")
    const [createIcon, setCreateIcon] = React.useState("plus-outline")
    const [dmIcon, setDmIcon] = React.useState("message-outline")

    const Tab = createMaterialBottomTabNavigator()

    React.useEffect(() => {             // icon changes but in a very bad way tho
        if(activePage === "Home") {
            setHomeIcon("home")
            setCreateIcon("plus-outline")
            setDmIcon("message-outline")
        }
        else if (activePage === "Create") {
            setCreateIcon("plus")
            setHomeIcon("home-outline")
            setDmIcon("message-outline")
        }
        else if (activePage === "DM") {
            setDmIcon("message")
            setHomeIcon("home-outline")
            setCreateIcon("plus-outline")
        }
        else {
            console.log("what's happening bro")
        }
    }, [activePage])

    //TODO: hide label not working somehow. find a solution (found by creating the nav bar manually)
    
    return (
    <>
        <View style={styles.top}>
            <StatusBar style="light"></StatusBar>
            <View style={styles.topSearch}>
                <Button onPress={() => navigation.navigate("Search")} titleStyle={{color: "white", fontSize: 15}} buttonStyle={styles.searchButton} title={
                    <Icon name="search" color="black" />
                }/>
            </View>
            <TouchableOpacity style={{width: 50, height: 50, position: "absolute"}} onPress={()=> reloadPage()}>
                <Image source={require("../assets/w1logocrimson.png")}
                style={{width: 50, height: 50, position: "absolute"}}
                />
            </TouchableOpacity>
            <View style={{height: 50}}></View>
            <View style={styles.topProfile}>
                <Button onPress={ () => navigation.navigate("Profile") } titleStyle={{color: "white", fontSize: 15}} buttonStyle={styles.profileButton} title={
                    <Icon name="account-circle" color="black" />
                }/>
            </View>
        </View>
        <View style={styles.bottom}>

            <View style={styles.bottomContents}>
                {activePage == 'Home' ? <Home /> : (activePage == 'Create') ? <CreateFromNav /> : (activePage == 'DM') ? <DMPage /> : null}
            </View>

        </View>
        <View style={styles.bottomNavBar}>
            <Animated.View style={styles.TO}>
                <TouchableOpacity onPress={()=>setActivePage('Home')} style={styles.TO}>
                    <Icon name={homeIcon} type='material-community' color="black" />
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={styles.TO}>
                <TouchableOpacity onPress={()=>setActivePage('Create')} style={styles.TO}>
                    <Icon name={createIcon} type='material-community' color="black" />
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={styles.TO}>    
                <TouchableOpacity onPress={()=>setActivePage('DM')} style={styles.TO}>
                    <Icon name={dmIcon} type='material-community' color="black" />
                </TouchableOpacity>
            </Animated.View>    
        </View>
    </>
    )
}

export default HomePage


const styles = StyleSheet.create({

    TO: {
        width: "33%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    bottomNavBar: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "7%",
        backgroundColor: "#ffffff",
        justifyContent: 'space-around',
        alignItems:'center',
        flexDirection:'row'
    },
    topSearch: {
        position: "absolute",
        alignItems: "flex-end",
        width: 85,
        left: 0,
        zIndex: 10,
  
    },
    profileButton: {
        marginTop: 5,
        width: 60,    
        borderWidth: 0,
        backgroundColor: "transparent",
    },
    searchButton: {
        marginTop: 5,
        width: 110,    
        borderWidth: 0,
        backgroundColor: "transparent",
    },
    topProfile: {
        position: "absolute",
        alignItems: "flex-end",
        width: 100,
        right: 0,
        zIndex: 10,
  
    },
    top: {
        height: 50,
        alignItems: "center"
  },
    bottom: {
        height: "86%",
        zIndex: 10
    }
  })