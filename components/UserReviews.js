import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../api/firebaseConfig';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const UserReviews = ({ navigation }) => {
    const [reviews, setReviews] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            const q = query(collection(db, 'reviews'), where("userId", "==", user.uid));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const loadedReviews = [];
                snapshot.forEach((doc) => {
                    loadedReviews.push({ id: doc.id, ...doc.data() });
                });
                setReviews(loadedReviews);
            });

            return () => unsubscribe();
        }
    }, [user]);

    return (
        <View style={styles.container}>
            <FlatList
                data={reviews}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.reviewItem}
                        onPress={() => navigation.navigate('BookDetail', { bookId: item.bookId })}
                    >
                        <Text style={styles.reviewText}> {item.bookTitle}</Text>
                        <Text style={styles.reviewText}>Rating: {item.rating}</Text>
                        <Text style={styles.reviewText}>{item.review}</Text>
                    </TouchableOpacity>
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
