/* eslint-disable no-unused-vars */
import { View, Text, StyleSheet, Animated, FlatList } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '../firebase';
import { Input } from 'react-native-elements';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import useKeyboardHeight from 'react-native-use-keyboard-height';
import ChatBalloon from '../components/DMComponents/ChatBalloon';

const DMChatPage = ({ route, navigation }) => {
    const [messageText, setMessageText] = useState('');
    const [messageData, setMessageData] = useState(null);
    const [whichUser, setWhichUser] = useState('');

    const { userID, name } = route.params;
    const loggedinUser = auth.currentUser;
    const ref = useRef(null);
    const keyboardHeight = useKeyboardHeight();
    const inputAnimation = useRef(new Animated.Value(0)).current;

    const sorter = (obj = {}) => {
        const objArr = Object.values(obj.data);
        const sortedArr = objArr.sort((a, b) => a.time - b.time);

        return sortedArr;
    };

    useEffect(() => {
        Animated.timing(inputAnimation, {
            toValue: keyboardHeight,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [ref, keyboardHeight]);

    //improve this
    useEffect(() => {
        onSnapshot(doc(db, 'messages', `bw${ loggedinUser.uid }and${ userID }`), (document) => {
            if (document.data()) {
                setWhichUser('loggedinuser');
                setMessageData(sorter(document.data()));
            } else {
                setWhichUser('otheruser');
                onSnapshot(doc(db, 'messages', `bw${ userID }and${ loggedinUser.uid }`), (docm) => {
                    if (docm.data()) {
                        setMessageData(sorter(docm.data()));
                    }
                });
            }
        });
    }, []);

    const sendMessage = async () => {
        if (messageText.length > 0 && messageText.length < 150) {
            const date = new Date().getTime();
            const payload = {
                [messageText]: {
                    message: messageText,
                    sender: loggedinUser.uid,
                    receiver: userID,
                    time: date,
                }
            };

            await setDoc(doc(db, 'messages', whichUser === 'loggedinuser'
                ? `bw${ loggedinUser.uid }and${ userID }`
                : `bw${ userID }and${ loggedinUser.uid }`), { payload }, { merge: true });
        } else {
            alert('Message must be between 1 and 150 characters');
        }
    };

    return (
        <View style={ styles.container }>
            <View style={ styles.topSeperator }></View>
            {messageData &&
                <FlatList
                    data={ messageData }
                    renderItem={({ item }) =>
                        <ChatBalloon
                            item={ item }
                            isNameAboveBubbleEnabled={ true }
                            otherUsersName={ name }
                        />}
                    keyExtractor={ (_, index) => index.toString() }
                    ListEmptyComponent={ () => <Text style={ styles.emptyText }>No messages yet</Text> }
                />
            }
            <Animated.View style={[styles.messageInputContainer, { bottom: inputAnimation }]}>
                <Input
                    ref={ ref }
                    placeholder='Message...'
                    rightIcon={{ type: 'material-community', name: 'send', color: 'black', onPress: () => sendMessage() }}
                    onChangeText={ (text) => setMessageText(text) }
                    inputStyle={ styles.messageInput }
                    containerStyle={ styles.inputContainer }
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                />
            </Animated.View>
        </View>

    );
};

export default DMChatPage;

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: 'rgb(240,240,240)',
        height: 60
    },
    messageInput: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 5,

    },
    topSeperator: {
        borderBottomWidth: 0.2,
        borderTopWidth: 0.2,
        borderColor: 'black',
        alignItems: 'flex-end'
    },
    container: {
        flex: 1,
    },
    chatMessagesContainer: {
        width: '100%',
        height: '80%',
        flexDirection: 'column',
    },
    messageInputContainer: {
        width: '100%',
        alignContent: 'center',
        marginLeft: 5,
    },
    settingsButton: {
        marginTop: 5,
        width: 45,
        borderWidth: 0,
        backgroundColor: 'transparent',
    },
});