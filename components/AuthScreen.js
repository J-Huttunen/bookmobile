import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, } from 'firebase/auth';

const AuthScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const auth = getAuth();

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setMessage("User created successfully!");
            })
            .catch((error) => {
                setMessage(`Error: ${error.message}`);
            });
    };

    const handleSignIn = (navigation) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setMessage("User signed in successfully!");
                navigation.navigate('Home', { screen: 'BookList' });
            })
            .catch((error) => {
                setMessage(`Error: ${error.message}`);
            });
    };

    const user = auth.currentUser;
    if (user) {
        console.log(user.uid);
    }

    return (
        <View style={styles.container}>
            <TextInput placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                style={styles.input}
            />
            <TextInput placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <View style={styles.button}>
                <Button title="Sign Up" onPress={handleSignUp} />
            </View>
            <View style={[styles.button, styles.buttonSpacing]}>
                <Button
                    title="Sign In"
                    onPress={handleSignIn}
                />
            </View>
            <Text>{message}</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    input: {
        width: '80%',
        height: 50,
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
        borderColor: '#ccc',
        borderRadius: 5
    },
    button: {
        width: '80%',
        marginVertical: 10
    },
    buttonSpacing: {
        marginTop: 20
    }
});



export default AuthScreen;
