import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import { db } from '../api/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../api/firebaseConfig'; // Oletetaan että auth-moduuli tuo autentikaation tiedot
import { getAuth } from 'firebase/auth';
import { deleteDoc, doc, onSnapshot } from 'firebase/firestore';


const ReadingList = ({ navigation }) => {
    const [books, setBooks] = useState([]);

    const auth = getAuth();
    const user = auth.currentUser;


    useEffect(() => {
        if (!user) return; // Varmista että käyttäjä on kirjautunut sisään

        const q = query(collection(db, 'userBooks'), where("userId", "==", user.uid));

        // Kuuntele muutoksia reaaliajassa
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedBooks = [];
            snapshot.forEach((doc) => {
                console.log("Document data: ", doc.data());
                loadedBooks.push({ ...doc.data(), id: doc.id });
            });
            setBooks(loadedBooks);
        });

        return () => unsubscribe(); // Siisti tilaukset, kun komponentti poistetaan käytöstä
    }, [user]);

    const removeBookFromList = async (docId) => {
        try {
            await deleteDoc(doc(db, 'userBooks', docId));
            setBooks(prevBooks => prevBooks.filter(book => book.id !== docId));  // Päivitä tila käyttäen edellistä tilaa
            console.log("Kirja poistettu lukulistalta!");
        } catch (error) {
            console.error("Virhe kirjan poistamisessa lukulistalta: ", error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('BookDetail', {
                bookId: item.bookId,
                bookImage: item.thumbnail,
                bookTitle: item.title,
                bookAuthor: item.author,
            })}>
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.author}>{item.author}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.button}>
                <Button title="Remove" onPress={() => removeBookFromList(item.id)} />
            </View>
        </View>
    );

    return (
        <FlatList
            data={books}
            keyExtractor={item => item.id || item.bookId}  // Käytä Firestore dokumentin ID:tä tai bookId:tä
            renderItem={renderItem}
        />
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'column',
        padding: 10,
        marginHorizontal: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    thumbnail: {
        width: 100,
        height: 150,
        resizeMode: 'cover'
    },
    infoContainer: {
        marginLeft: 10,
        marginTop: 5
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    author: {
        fontSize: 16,
        color: '#666'
    },
    button: {
        marginTop: 10
    },
});

export default ReadingList;