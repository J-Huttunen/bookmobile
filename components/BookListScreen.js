import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const BookListScreen = ({ navigation }) => {
    const [categories, setCategories] = useState(['Romance', 'Thriller', 'Science', 'History']);
    const [booksByCategory, setBooksByCategory] = useState({});

    useEffect(() => {
        categories.forEach(category => {
            fetchBooksByCategory(category);
        });
    }, []);

    const fetchBooksByCategory = async (category) => {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${category}`);
        const json = await response.json();
        setBooksByCategory(prevBooks => ({
            ...prevBooks,
            [category]: json.items || []
        }));
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}>
            <Image source={{ uri: item.volumeInfo.imageLinks?.thumbnail }} style={styles.thumbnail} />
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.volumeInfo.title}</Text>
                <Text style={styles.author}>{item.volumeInfo.authors?.join(', ')}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView>
                {categories.map(category => (
                    <View key={category} style={styles.categorySection}>
                        <Text style={styles.categoryHeader}>{category}</Text>
                        <FlatList
                            horizontal
                            data={booksByCategory[category]}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    categorySection: {
        marginBottom: 20
    },
    categoryHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10
    },
    itemContainer: {
        width: 140,
        marginRight: 10,
        marginLeft: 10
    },
    thumbnail: {
        width: 140,
        height: 210
    },
    infoContainer: {
        padding: 5
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    author: {
        fontSize: 12,
        color: '#666'
    }
});

export default BookListScreen;
