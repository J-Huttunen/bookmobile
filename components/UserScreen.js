import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { db } from '../api/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ReviewItem from './ReviewItem';  // Olettaen, että sinulla on tämä komponentti arvosteluiden näyttämiseen
import UserReviews from './UserReviews';

const UserScreen = ({ navigation }) => {
    const [reviews, setReviews] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;

    //useEffect(() => {
    //    const fetchReviews = async () => {
    //        if (user) {
    //            const reviewsQuery = query(collection(db, "reviews"), where("userId", "==", user.uid));
    //            const querySnapshot = await getDocs(reviewsQuery);
    //            const fetchedReviews = [];
    //            querySnapshot.forEach((doc) => {
    //                fetchedReviews.push({ id: doc.id, ...doc.data() });
    //            });
    //            setReviews(fetchedReviews);
    //        }
    //    };
    //
    //    fetchReviews();
    //}, [user]);

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
    //<FlatList
    //    data={reviews}
    //    keyExtractor={item => item.id}
    //    renderItem={({ item }) => <ReviewItem review={item} />}
    //>
    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Reviews</Text>
            <UserReviews />
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
