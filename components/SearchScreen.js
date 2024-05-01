import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);

    const fetchBooks = async () => {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`);
        const json = await response.json();
        setBooks(json.items || []);
    };

    const handleSearch = () => {
        fetchBooks();
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
            <TextInput
                placeholder="Search for books"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                style={styles.searchBar}
            />
            <FlatList
                data={books}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    itemContainer: {
        flexDirection: 'column',
        padding: 5,
        marginHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    thumbnail: {
        width: 100,
        height: 150,
        resizeMode: 'cover'
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    author: {
        fontSize: 14,
        color: '#666666'
    },
    searchBar: {
        fontSize: 18,
        margin: 10,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1
    }
});

export default SearchScreen;
