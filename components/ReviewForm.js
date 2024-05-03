import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../api/firebaseConfig';
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const ReviewForm = ({ route }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log("Received bookId in ReviewForm:", bookId);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState('');
    const { bookId, bookTitle } = route.params;
    console.log("Received bookId in ReviewForm:", bookId);

    const submitReview = async () => {
        if (!bookId || !bookTitle) {
            console.error("Book ID or title is undefined");
            Alert.alert("Error", "Book information is missing. Please try again.");
            return;
        }
        if (!user) {
            console.log("No user logged in");
            return; 
        }
        try {
            if (!bookId) {
                console.error("Book ID is undefined");
                return;
            }
            await addDoc(collection(db, 'reviews'), {
                userId: user.uid,
                bookId: bookId, 
                bookTitle: bookTitle,
                review: review,
                rating: rating,
                createdAt: serverTimestamp()
            });
            console.log("Review added successfully!");
            setReview('');
            setRating('');
            Alert.alert("Review Submitted", "Your review has been submitted successfully!");
        } catch (error) {
            console.error("Virhe arvostelun lisäämisessä: ", error);
            Alert.alert("Error", "Failed to submit review.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Write a review"
                value={review}
                onChangeText={setReview}
                style={styles.input}
            />
            <TextInput
                placeholder="Rating (1-5)"
                value={rating}
                onChangeText={setRating}
                keyboardType="numeric"
                style={styles.input}
            />
            <Button title="Submit Review" onPress={submitReview} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    input: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10
    },

});

export default ReviewForm;
