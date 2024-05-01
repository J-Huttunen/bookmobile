import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import UserReviews from './UserReviews';

const UserScreen = ({ navigation }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            Alert.alert("Logged out", "You have been logged out successfully.");
            navigation.navigate('AuthScreen');
        } catch (error) {
            console.error("Error signing out: ", error);
            Alert.alert("Error", "Failed to sign out.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Reviews</Text>
            <UserReviews navigation={navigation} />
            <Button title="Sign Out" onPress={handleSignOut} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    }
});

export default UserScreen;
