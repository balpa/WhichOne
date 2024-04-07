/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';
import ChangeName from '../components/AccountSettingsComponents/ChangeName';
import EditBio from '../components/AccountSettingsComponents/EditBio';
import ChangePassword from '../components/AccountSettingsComponents/ChangePassword';
import 'firebase/firestore';
import DEVICE_NAMES from '../enums/deviceEnums';
const {
    ANDROID
} = DEVICE_NAMES;

const AccountSettings = ({ navigation }) => {
    const COLOR_PALETTE = ['#FEF9A7', '#FAC213', '#F77E21', '#D61C4E', '#990000', '#FF5B00', '#D4D925', '#FFEE63'];
    const { CHANGE_NAME, EDIT_BIO, UPLOAD_AVATAR, CHANGE_PASSWORD } = {
        CHANGE_NAME: 'Change Name',
        EDIT_BIO: 'Edit Bio',
        UPLOAD_AVATAR: 'Upload Avatar',
        CHANGE_PASSWORD: 'Change Password',
    };

    const [isChangeNameShown, setIsChangeNameShown] = useState(false);
    const [isEditBioShown, setIsEditBioShown] = useState(false);
    const [isChangePasswordShown, setIsChangePasswordShown] = useState(false);
    const [changedName, setChangedName] = useState('');
    const [platform, setPlatform] = useState('');
    const [shadowOptions, setShadowOptions] = useState({});

    const yAnim0FromTop = useRef(new Animated.Value(1000)).current;
    const yAnim1FromTop = useRef(new Animated.Value(1000)).current;
    const yAnim2FromTop = useRef(new Animated.Value(1000)).current;
    const yAnim3FromTop = useRef(new Animated.Value(1000)).current;
    const yAnim4FromTop = useRef(new Animated.Value(1000)).current;
    const yAnim5FromTop = useRef(new Animated.Value(1000)).current;

    useEffect(() => {
        const { OS } = Platform;
        const genericSettings = {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
        };

        setTimeout(() => {
            Animated.spring(yAnim0FromTop, genericSettings).start();
        }, 400);
        setTimeout(() => {
            Animated.spring(yAnim1FromTop, genericSettings).start();
        }, 550);
        setTimeout(() => {
            Animated.spring(yAnim2FromTop, genericSettings).start();
        }, 700);
        setTimeout(() => {
            Animated.spring(yAnim3FromTop, genericSettings).start();
        }, 850);
        setTimeout(() => {
            Animated.spring(yAnim4FromTop, genericSettings).start();
        }, 1000);
        setTimeout(() => {
            Animated.spring(yAnim5FromTop, genericSettings).start();
        }, 1150);

        setPlatform(OS);
        setShadowOptions(OS === ANDROID
            ? { elevation: 0 }
            : {
                shadowColor: '#171717',
                shadowOffset: { width: -1, height: 3 },
                shadowOpacity: 0.4,
                shadowRadius: 5,
            });
    }, []);

    const createButtonStyle = (animation, color) => [
        styles.buttonView,
        shadowOptions,
        { transform: [{ translateY: animation }]},
        { backgroundColor: COLOR_PALETTE[color] }
    ];

    return (
        <>
            <View style={ styles.elevation }>
                <Animated.View style={ createButtonStyle(yAnim0FromTop, 3) }>
                    <TouchableOpacity onPress={() => setIsChangeNameShown(true)} style={ styles.optionsButton }>
                        <Text style={ styles.optionsText }>{ CHANGE_NAME }</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={createButtonStyle(yAnim1FromTop, 3)}>
                    <TouchableOpacity onPress={() => setIsEditBioShown(true)} style={ styles.optionsButton }>
                        <Text style={ styles.optionsText }>{ EDIT_BIO }</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={ createButtonStyle(yAnim2FromTop, 5) }>
                    <TouchableOpacity onPress={() => navigation.navigate('UploadAvatar')} style={ styles.optionsButton }>
                        <Text style={ styles.optionsText }>{ UPLOAD_AVATAR }</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={ createButtonStyle(yAnim3FromTop, 6) }>
                    <TouchableOpacity onPress={() => setIsChangePasswordShown(true)} style={ styles.optionsButton }>
                        <Text style={ styles.optionsText }>{ CHANGE_PASSWORD }</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
            { isChangeNameShown &&
                <View style={ styles.optionsPopup }>
                    <ChangeName color={ COLOR_PALETTE[3] } setIsChangeNameShown={ setIsChangeNameShown }/>
                </View>
            }
            { isEditBioShown &&
                <View style={ styles.optionsPopup }>
                    <EditBio color={ COLOR_PALETTE[3] } setIsEditBioShown={ setIsEditBioShown }/>
                </View>
            }
            { isChangePasswordShown &&
                <View style={ styles.optionsPopup }>
                    <ChangePassword color={ COLOR_PALETTE[6] } setIsChangePasswordShown={ setIsChangePasswordShown }/>
                </View>
            }
            <View style={ styles.logoBottomContainer }>
                <Image source={ require('../assets/w1logocrimson.png') } style={ styles.logoBottom } />
            </View>
        </>
    );
};

export default AccountSettings;

const styles = StyleSheet.create({
    optionsPopup: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center' },
    optionsText: {
        fontSize: 25,
        fontWeight: '800'
    },
    optionsButton: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    accountButton: {
        width: 170,
        borderWidth: 0,
        backgroundColor: 'transparent',
    },
    top: {
        alignItems: 'flex-end'
    },
    elevation: {
        position: 'absolute',
        width: '100%',
        height: '90%',
        alignItems: 'center',
    },
    buttonView: {
        margin: 10,
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    logoBottom: {
        width: 50,
        height: 50,
        bottom: 0,
        zIndex: 10
    },
    logoBottomContainer: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5
    },

});