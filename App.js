import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { searchBooks } from './api/googleBooks';  // Olettaen että polku on oikein
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './api/firebaseConfig';
import BottomTabNavigator from './components/BottomTabNavigator';
import BookListScreen from './components/BookListScreen';
import BookDetailScreen from './components/BookDetailScreen';
import ReviewForm from './components/ReviewForm';
import AuthScreen from './components/AuthScreen';

const Stack = createStackNavigator();
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;  // Muista peruuttaa tilaustapahtuma kun komponentti poistuu käytöstä
  }, []);


  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
