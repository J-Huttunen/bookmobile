import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const AuthScreen = () => {
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

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setMessage("User signed in successfully!");
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
        <View>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Sign In" onPress={handleSignIn} />
            <Text>{message}</Text>
        </View>
    );
};

export default AuthScreen;
