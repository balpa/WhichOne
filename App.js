/* eslint-disable no-unused-vars */
// @author: Berke Altıparmak
//  You may use, distribute and modify this code under the
//  terms of the Beerware license, which unfortunately won't be
//  written for another century.
//  ----------------------------------------------------------------------------
//  "THE BEER-WARE LICENSE" (Revision 42):
//  <berkealtiparmak@outlook.com> wrote this file.  As long as you retain this notice you
//  can do whatever you want with this stuff. If we meet some day, and you think
//  this stuff is worth it, you can buy me a beer in return.   Berke Altıparmak
//  ----------------------------------------------------------------------------

import 'react-native-gesture-handler';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import SearchPage from './pages/SearchPage';
import UserProfile from './pages/UserProfile';
import AccountSettings from './pages/AccountSettings';
import Create from './pages/Create';
import UploadAvatar from './pages/UploadAvatar';
import DMChatPage from './pages/DMChatPage';
import ThemePage from './pages/ThemePage';
import NotificationsPage from './pages/NotificationsPage';
import FollowersFollowingPage from './pages/FollowersFollowingPage';
import PAGE_NAMES from './enums/pageEnums';

const {
    LOGIN,
    REGISTER,
    PROFILE,
    FOLLOWERS,
    HOMEPAGE,
    STATS,
    SETTINGS,
    NOTIFICATIONS,
    ABOUT,
    THEME,
    USER_PROFILE,
    DM_CHAT_PAGE,
    SEARCH,
    ACCOUNT,
    UPLOAD_AVATAR,
    CREATE,
} = PAGE_NAMES;

LogBox.ignoreLogs(['Setting a timer for a long period of time']);
LogBox.ignoreLogs(['color']);

const Stack = createStackNavigator();

const globalScreenOptions = {
    gestureEnabled: Platform.OS === 'ios',
    headerShown: true,
};

const config = {
    animation: 'spring',
    config: {
        stiffness: 900,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
};

const genericOptions = {
    headerTitleStyle: {},
    headerStyle: {},
    headerTintColor: '',
    cardStyle: {
        backgroundColor: 'rgb(255,255,255)'
    },
    transitionSpec: {
        open: config,
        close: config
    },
};

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions = { globalScreenOptions } headerMode="screen">
                <Stack.Screen
                    name = { LOGIN }
                    options = {{ genericOptions }}
                    component = { LoginScreen }
                />
                <Stack.Screen
                    name = { REGISTER }
                    options = {{ genericOptions }}
                    component = { RegisterScreen }
                />
                <Stack.Screen
                    name = { PROFILE }
                    options = {{
                        headerBackTitle: 'Home',
                        genericOptions
                    }}
                    component = { ProfilePage }
                />
                <Stack.Screen
                    name = { FOLLOWERS }
                    options = {{
                        headerBackTitle: 'Profile',
                        genericOptions
                    }}
                    component = { FollowersFollowingPage }
                />
                <Stack.Screen
                    name = { HOMEPAGE }
                    options = {{
                        title: 'WhichOne',
                        genericOptions
                    }}
                    component = { HomePage }
                />
                <Stack.Screen
                    name = { STATS }
                    options = {{ genericOptions }}
                    component = { StatsPage }
                />
                <Stack.Screen
                    name = { SETTINGS }
                    options = {{ genericOptions }}
                    component = { SettingsPage }
                />
                <Stack.Screen
                    name = { NOTIFICATIONS }
                    options = {{ genericOptions }}
                    component = { NotificationsPage }
                />
                <Stack.Screen
                    name = { ABOUT }
                    options = {{ genericOptions }}
                    component = { AboutPage }
                />
                <Stack.Screen
                    name = { THEME }
                    options = {{ genericOptions }}
                    component = { ThemePage }
                />
                <Stack.Screen
                    name = { USER_PROFILE }
                    options = {({ route }) => ({
                        genericOptions,
                        title: route.params.name,
                    })}
                    component = { UserProfile }
                />
                <Stack.Screen
                    name = { DM_CHAT_PAGE }
                    options = {({ route }) => ({
                        genericOptions,
                        title: route.params.name,
                        headerBackTitle: 'Messages',
                    })}
                    component = { DMChatPage }
                />
                <Stack.Screen
                    name = { SEARCH }
                    options = {{
                        headerBackTitle: 'Home',
                        genericOptions
                    }}
                    component = { SearchPage }
                />
                <Stack.Screen
                    name = { ACCOUNT }
                    options = {{
                        headerBackTitle: 'Settings',
                        genericOptions
                    }}
                    component = { AccountSettings }
                />
                <Stack.Screen
                    name = { UPLOAD_AVATAR }
                    options = {{
                        headerBackTitle: 'Account',
                        genericOptions
                    }}
                    component = { UploadAvatar }
                />
                <Stack.Screen
                    name = { CREATE }
                    options = {{
                        headerBackTitle: 'Home',
                        genericOptions
                    }}
                    component = { Create }
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
