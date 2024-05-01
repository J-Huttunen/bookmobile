import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../api/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const UserReviews = () => {
    const [reviews, setReviews] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchReviews = async () => {
            if (!user) {
                console.log("No user logged in");
                return;
            }
            const q = query(collection(db, 'reviews'), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const loadedReviews = [];
            querySnapshot.forEach((doc) => {
                loadedReviews.push({ id: doc.id, ...doc.data() });
            });
            setReviews(loadedReviews);
            console.log("Loaded reviews:", loadedReviews);
        };

        fetchReviews();
    }, [user]);

    return (
        <View style={styles.container}>
            <FlatList
                data={reviews}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.reviewItem}>
                        <Text style={styles.reviewText}> {item.bookTitle}</Text>
                        <Text style={styles.reviewText}>Rating: {item.rating}</Text>
                        <Text style={styles.reviewText}>{item.review}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    reviewItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    reviewText: {
        fontSize: 16
    }
});

export default UserReviews;
