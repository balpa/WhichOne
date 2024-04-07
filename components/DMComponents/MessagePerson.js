/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, useWindowDimensions, Animated, Platform } from 'react-native';
import { auth, db } from '../../firebase';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import DEVICE_ENUMS from '../../enums/deviceEnums';
const {
    ANDROID
} = DEVICE_ENUMS;

export default function MessagePerson({ userID, color }) {
    const rightToLeftAnim = React.useRef(new Animated.Value(300)).current;
    const leftToRightAnim = React.useRef(new Animated.Value(-300)).current;
    const loggedinUser = auth.currentUser;
    const navigation = useNavigation();
    const window = useWindowDimensions();
    const storage = getStorage();

    const [shadowOptions, setShadowOptions] = useState({});
    const [followSituation, setFollowSituation] = useState(false);
    const [userIDData, setUserIDData] = useState({});
    const [image, setImage] = useState(null);

    useEffect(() => {
        const docRef = db.collection('useruid').doc(userID);

        docRef.get().then((doc) => {
            if (doc.exists) {
                setUserIDData(doc.data());
            } else {
                console.log('No such document!');
            }

        }).catch((error) => console.log('Error getting document:', error));

        setShadowOptions(Platform.OS === ANDROID
            ? { elevation: 0 }
            : {
                shadowColor: '#171717',
                shadowOffset: { width: -1, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
            });

        Animated.spring(rightToLeftAnim, {
            toValue: 0,
            friction: 7,
            tension: 40,
            useNativeDriver: false
        }).start();
        Animated.spring(leftToRightAnim, {
            toValue: 0,
            friction: 7,
            tension: 40,
            useNativeDriver: false
        }).start();
    }, []);

    getDownloadURL(ref(storage, `Users/${ userID }/avatars/avatar_image`))
        .then((url) => setImage(url))
        .catch((error) => setImage('https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png'));

    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: window.width - 5,
            height: 70,
            backgroundColor: 'rgba(255,255,255,0)',
            paddingLeft: 10,
            paddingRight: 10,
        }}>
            <Animated.View style={[
                styles.nameAndImage,
                //{borderColor:textColorDependingOnTheme}, 
                shadowOptions,
                { transform: [{ translateX: leftToRightAnim }]}
            ]} >
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50 / 2,
                        marginRight: 10
                    }}
                    source={{ uri: image }} />
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('UserProfile', { name: `${ userIDData.name }`, userID: `${ userID }` });
                    }}>
                    <Text
                        style={{
                            fontSize: 17,
                            color: 'black',
                            fontWeight: '500'
                        }}
                    >{userIDData.name}</Text>
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[shadowOptions, { transform: [{ translateX: rightToLeftAnim }]}]}>
                <View style={{
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 30,
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: 'black',
                    width: 100,
                    height: 50,
                    backgroundColor: `#${ color }`,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('DMChatPage', { userID: `${ userID }`, name: `${ userIDData.name }`, userData: userIDData })}
                        style={{
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        {/* <Icon name="paper-plane" type='font-awesome' color="black" /> */}
                        <Text>Message</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    nameAndImage: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //borderWidth: 0.5,
        //borderBottomRightRadius: 30,
        //borderTopRightRadius: 10,
        paddingRight: 20,
        paddingLeft: 10,
        paddingTop: 3,
        paddingBottom: 3

    },
    followButton: {
        width: 100,
        backgroundColor: 'white',
    },
    unfollowButton: {
        width: 100,
        backgroundColor: 'crimson',
    }
});
