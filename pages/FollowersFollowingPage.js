/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import { StyleSheet, useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FollowingSection from '../components/FollowersFollowing/FollowingSection';
import FollowerSection from '../components/FollowersFollowing/FollowerSection';

export default function FollowersFollowingPage() {
    const window = useWindowDimensions();
    const Tab = createMaterialTopTabNavigator();
    const user = auth.currentUser;
    const uid = user?.uid;

    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    //improve this
    useEffect(() => {
        const getFollowers = () => onSnapshot(doc(db, 'useruid', `${ uid }`), (document) => {
            const { followers } = document.data();

            setFollowers(followers);
            setFollowerCount(followers.length);
        });

        const getFollowing = () => onSnapshot(doc(db, 'useruid', `${ uid }`), (document) => {
            const { following } = document.data();

            setFollowing(following);
            setFollowingCount(following.length);
        });

        getFollowers();
        getFollowing();
    }, []);

    const globalOptions = {
        tabBarStyle: { backgroundColor: 'white' },
        tabBarIndicatorStyle: { backgroundColor: 'crimson' },
        tabBarActiveTintColor: 'crimson',
        tabBarInactiveTintColor: 'rgba(15,15,15,0.3)',
    };

    return (
        <Tab.Navigator screenOptions={ globalOptions } >
            <Tab.Screen
                name='followers'
                style={{ backgroundColor: 'red' }}
                children={() => <FollowerSection followers={followers} />}
            />
            <Tab.Screen
                name='following'
                children={() => <FollowingSection following={following} />}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15,15,15,1)',
        borderWidth: 1,
    },
});