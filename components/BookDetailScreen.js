import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Button, FlatList } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../api/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { Alert } from 'react-native';
import ReviewItem from './ReviewItem';


const BookDetailScreen = ({ navigation, route }) => {
    const [bookDetails, setBookDetails] = useState(null);
    const auth = getAuth();
    const user = auth.currentUser;
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [books, setBooks] = useState([]);

    const { bookId } = route.params;

    useEffect(() => {
        if (!bookId) return;
        const reviewsQuery = query(collection(db, "reviews"), where("bookId", "==", bookId));
        const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
            const fetchedReviews = [];
            snapshot.forEach(doc => {
                fetchedReviews.push({ ...doc.data(), id: doc.id });
            });
            setReviews(fetchedReviews);

            if (fetchedReviews.length > 0) {
                const total = fetchedReviews.reduce((acc, item) => acc + (Number(item.rating) || 0), 0);
                const average = total / fetchedReviews.length;
                setAverageRating(average);
            } else {
                setAverageRating(0);
            }
        });

        return () => unsubscribe();
    }, [bookId]);

    console.log("Book ID in Detail Screen:", bookId);
    useEffect(() => {
        if (!user) {
            console.log("No user logged in");
            return;
        }
        const fetchBookDetails = async () => {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
            const json = await response.json();
            console.log("response:", json);
            setBookDetails(json);
        };

        fetchBookDetails();
    }, [bookId, user]);



    if (!bookDetails) {
        return <Text>Loading...</Text>;
    }

    const addToReadingList = async (bookId) => {
        if (!user) {
            console.log("No user logged in");
            return;
        }
        const existingDocQuery = query(collection(db, 'userBooks'), where("userId", "==", user.uid), where("bookId", "==", bookDetails.id));
        const querySnapshot = await getDocs(existingDocQuery);
        if (!querySnapshot.empty) {
            console.log("Kirja on jo lukulistalla!");
            Alert.alert("Error", "The book is already in your reading list.");
            return;
        }

        const bookToAdd = {
            userId: user.uid,
            bookId: bookId,
            title: bookDetails.volumeInfo.title,
            author: bookDetails.volumeInfo.authors?.join(', '),
            thumbnail: bookDetails.volumeInfo.imageLinks?.thumbnail,
            addedOn: new Date()
        };
        try {
            await addDoc(collection(db, 'userBooks'), bookToAdd);
            setBooks(prevBooks => [...prevBooks, bookToAdd]);
            console.log("Added book to reading list!");
            Alert.alert("Book Added", "The book has been successfully added to your reading list.");
        } catch (error) {
            console.error("Failed to add. ", error);
            Alert.alert("Failed", "Failed to add the book to your reading list. Please try again.");
        }
    };


    return (
        <ScrollView style={styles.container}>
            {bookDetails.volumeInfo.imageLinks && bookDetails.volumeInfo.imageLinks.thumbnail ? (
                <Image source={{ uri: bookDetails.volumeInfo.imageLinks.thumbnail }} style={styles.image} />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Text>No image available</Text>
                </View>
            )}
            <Text style={styles.description}>{bookDetails.volumeInfo.description}</Text>
            <Button
                title="Write a Review"
                onPress={() => {
                    console.log("Navigating to ReviewForm with bookId:", bookId);
                    navigation.navigate('ReviewForm', {
                        bookId: bookId,
                        bookTitle: bookDetails.volumeInfo.title
                    });
                }}
            />
            <Button
                title="Add to Reading List"
                onPress={() => addToReadingList(bookId)}
            />

            <View style={styles.reviewsContainer}>
                <Text style={styles.reviewHeader}>Reviews</Text>
                <Text style={styles.averageRating}>Average Rating: {averageRating.toFixed(1)}</Text>
                {reviews.map((item) => (
                    <ReviewItem key={item.createdAt ? item.createdAt.toString() : 'default-key'} review={item} onReviewUpdated={setReviews} />
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10
    },
    author: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10
    },
    description: {
        fontSize: 16,
        color: '#333'
    },
    imagePlaceholder: {
        width: '100%',
        height: 300,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    reviewsContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0'
    },
    reviewHeader: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    reviewItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    reviewText: {
        fontSize: 16
    },
    reviewRating: {
        fontSize: 14,
        color: '#666'
    },
    averageRating: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    }
});

export default BookDetailScreen;
