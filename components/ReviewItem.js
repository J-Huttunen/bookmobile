import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../api/firebaseConfig';
import { getAuth } from 'firebase/auth';

const ReviewItem = ({ review }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [editMode, setEditMode] = useState(false);
    const [editedReview, setEditedReview] = useState(review.review);
    const [editedRating, setEditedRating] = useState(review.rating.toString());

    const handleUpdate = async () => {
        const reviewRef = doc(db, "reviews", review.id);
        try {
            await updateDoc(reviewRef, {
                review: editedReview,
                rating: parseInt(editedRating, 10)
            });
            setEditMode(false);
            Alert.alert("Review updated successfully!");
        } catch (error) {
            console.error("Error updating review: ", error);
            Alert.alert("Failed to update review.");
        }
    };

    const handleDelete = async () => {
        const reviewRef = doc(db, "reviews", review.id);
        try {
            await deleteDoc(reviewRef);
            Alert.alert("Review deleted successfully!");
        } catch (error) {
            console.error("Error deleting review: ", error);
            Alert.alert("Failed to delete review.");
        }
    };

    return (
        <View style={styles.reviewItem}>
            {editMode ? (
                <>
                    <TextInput
                        value={editedReview}
                        onChangeText={setEditedReview}
                        style={styles.input}
                    />
                    <TextInput
                        value={editedRating}
                        onChangeText={setEditedRating}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <Button title="Save" onPress={handleUpdate} />
                    <Button title="Cancel" onPress={() => setEditMode(false)} />
                </>
            ) : (
                <>
                    <Text style={styles.reviewText}>{review.review}</Text>
                    <Text style={styles.reviewRating}>Rating: {review.rating}</Text>
                    {user && user.uid === review.userId && (
                        <>
                            <Button title="Edit" onPress={() => setEditMode(true)} />
                            <Button title="Delete" onPress={handleDelete} />
                        </>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    reviewItem: {
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
    },
    reviewText: {
        fontSize: 16,
    },
    reviewRating: {
        fontSize: 14,
    },
});

export default ReviewItem;
