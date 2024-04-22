/* eslint-disable no-unused-vars */
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text, Alert, Animated, Platform } from 'react-native';
import { Button, Input } from 'react-native-elements/';
import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { db } from '../firebase';
import alert from '../functions/general';

const RegisterScreen = ({ navigation }) => {
    const { container, elevation, inputContainer, loginButton, cancelButton } = styles;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [isRight, setIsRight] = useState(null);
    const [shadowOptions, setShadowOptions] = useState({});
    const [lockIcon, setLockIcon] = useState('eye-slash');
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isNameNull, setIsNameNull] = useState(true);

    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const setPlatformBasedShadowOptions = () => {
            if (Platform.OS === 'android') {
                setShadowOptions({
                    elevation: 20
                });
            } else if (Platform.OS === 'ios') {
                setShadowOptions({
                    shadowColor: '#171717',
                    shadowOffset: { width: -1, height: 3 },
                    shadowOpacity: 0.4,
                    shadowRadius: 5,
                });
            }
        };

        const triggerScaleAnimation = () => {
            Animated.spring(scaleAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }).start();
        };

        setPlatformBasedShadowOptions();
        triggerScaleAnimation();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: 'Login',
        });
    }, [navigation]);

    useEffect(() => {
        if (lockIcon === 'eye') {
            setIsPasswordShown(true);
        } else {
            setIsPasswordShown(false);
        }
    }, [lockIcon]);

    // do the same in one then
    const register = () => {
        if (name.length > 2 && !name.includes(' ')) {
            auth.createUserWithEmailAndPassword(email, password)
                .then((authUser) => {
                    authUser.user.updateProfile({
                        displayName: name,
                    });
                })
                .then(async () => {
                    const loggedinUser = await auth.currentUser;

                    db.collection('usernames').doc(`${ username }`)
                        .set({
                            name: `${ name }`,
                            username: `${ username }`,
                            email: `${ email }`,
                            following: [],
                            followers: [],
                            UID: `${ loggedinUser.uid }`,
                            postCount: 0,
                            bio: ''
                        });
                })
                .then(async () => {
                    const loggedinUser = await auth.currentUser;

                    db.collection('useruid').doc(`${ loggedinUser.uid }`)
                        .set({
                            name: `${ name }`,
                            username: `${ username }`,
                            email: `${ email }`,
                            following: [],
                            followers: [],
                            UID: `${ loggedinUser.uid }`,
                            postCount: 0,
                            bio: ''
                        });
                })
                .then(async () => { // set postID to posts/useruid/postID for fetching posts
                    const loggedinUser = await auth.currentUser;

                    db.collection('posts').doc(`${ loggedinUser.uid }`)
                        .set({
                            postID: [],
                        });
                })
                .then(alert('Successfully registered!'))
                .catch((error) => alert(error.message));
        }
    };

    const WrongPassword = () => <Text style={{ color: 'crimson', marginLeft: 65 }}>Password does not match</Text>;
    const RightPassword = () => <Text style={{ color: 'green', marginLeft: 85 }}>Password confirmed</Text>;

    useEffect(() => {
        if (confirmpassword.length > 0) {
            if (confirmpassword === password) {
                setIsRight(true);
            } else {
                setIsRight(false);
            }
        } else {
            null;
        }
    }, [confirmpassword]);

    useEffect(() => {
        if (name.length === 0) {
            setIsNameNull(true);
        } else {
            setIsNameNull(false);
        }
    }, [name]);

    return (
        <View behavior="padding" style={ container }>
            <StatusBar style="light" />
            <Animated.View style={[
                elevation,
                shadowOptions,
                { transform: [{ scale: scaleAnim }]}
            ]}>
                <View style={{ height: 20 }}></View>
                <Text h1 style={{ marginBottom: 20, fontSize: 25, color: 'black' }}>Create an account</Text>
                <View style={ inputContainer }>
                    <Input
                        label="Full Name"
                        labelStyle={{ color: 'black', fontSize: 15 }}
                        leftIcon={{ type: 'material', name: 'badge', color: 'black' }}
                        style={{ color: 'black' }}
                        selectionColor={ 'black' }
                        autoFocus placeholder="Jack Smith"
                        value={ name }
                        errorMessage={ isNameNull ? 'Name must not be empty' : '' }
                        onChangeText={ (text) => setName(text)} />
                    <Input
                        label="Username"
                        labelStyle={{ color: 'black', fontSize: 15 }}
                        leftIcon={{ type: 'material', name: 'edit', color: 'black' }}
                        style={{ color: 'black' }}
                        selectionColor={ 'black' }
                        autoCapitalize="none"
                        placeholder="jacksmith"
                        value={ username }
                        onChangeText={ (text) => setUsername(text)} />
                    <Input
                        label="E-Mail"
                        labelStyle={{ color: 'black', fontSize: 15 }}
                        leftIcon={{ type: 'material', name: 'email', color: 'black' }}
                        style={{ color: 'black' }}
                        selectionColor={ 'black' }
                        autoCapitalize="none"
                        type="email"
                        placeholder="jack@gmail.com"
                        value={ email }
                        onChangeText={ (text) => setEmail(text)} />
                    <Input
                        label="Password"
                        labelStyle={{ color: 'black', fontSize: 15 }}
                        leftIcon={{ type: 'font-awesome', color: 'black', name: lockIcon, onPress: () => setLockIcon(lockIcon === 'eye-slash' ? 'eye' : 'eye-slash') }}
                        secureTextEntry={ !isPasswordShown }
                        style={{ color: 'black' }}
                        selectionColor={ 'black' }
                        autoCapitalize="none"
                        type="password"
                        placeholder="Password"
                        value={ password }
                        onChangeText={ (text) => setPassword(text)} />
                    <Input
                        label="Confirm Password"
                        labelStyle={{ color: 'black', fontSize: 15 }}
                        leftIcon={{ type: 'font-awesome', color: 'black', name: lockIcon, onPress: () => setLockIcon(lockIcon === 'eye-slash' ? 'eye' : 'eye-slash') }}
                        secureTextEntry={ !isPasswordShown }
                        style={{ color: 'black' }}
                        selectionColor={ 'black' }
                        autoCapitalize="none"
                        type="password"
                        placeholder="Confirm password"
                        value={ confirmpassword }
                        onChangeText={ (text) => setConfirmPassword(text)} />
                    { isRight ? <RightPassword /> : <WrongPassword /> }
                </View>
                <Button title="Register" onPress={ register } buttonStyle={ loginButton } />
                <Button title="Cancel" titleStyle={{ color: 'crimson' }} onPress={() => navigation.navigate('Login')} buttonStyle={ cancelButton } />
                <View style={{ height: 50 }} />
            </Animated.View>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    inputContainer: {
        width: 300,
    },
    loginButton: {
        width: 250,
        borderRadius: 15,
        backgroundColor: '#dc143c',
        marginTop: 10,
    },
    cancelButton: {
        width: 250,
        borderRadius: 15,
        backgroundColor: 'white',
        marginTop: 10,
    },
    elevation: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(240,240,240,1)',
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'black'
    }

});
