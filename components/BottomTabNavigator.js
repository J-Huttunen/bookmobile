import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../api/firebaseConfig';

import BookListScreen from './BookListScreen';
import ReadingList from './ReadingList';
import ReviewForm from './ReviewForm';
import AuthScreen from './AuthScreen';
import BookDetailScreen from './BookDetailScreen';
import UserReviews from './UserReviews';
import UserScreen from './UserScreen';
import SearchScreen from './SearchScreen';


const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeStackNavigator() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="BookList" component={BookListScreen} />
            <HomeStack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Book Details' }} />
            <HomeStack.Screen name="ReviewForm" component={ReviewForm} />
            <HomeStack.Screen name="AuthScreen" component={AuthScreen} />
            <HomeStack.Screen name="UserScreen" component={UserScreen} />
        </HomeStack.Navigator>
    );
}

function BottomTabNavigator() {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("User signed out!");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeStackNavigator}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Reading List"
                component={ReadingList}
                options={{
                    tabBarLabel: 'Reading List',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="book-open-variant" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="book-search" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen name="User" component={UserScreen} options={{
                tabBarLabel: 'My Profile',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="account" color={color} size={26} />
                ),
            }} />
        </Tab.Navigator>
    );
}
export default BottomTabNavigator;