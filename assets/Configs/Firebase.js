import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCFkbG92jfSPP70jISxXaVLBwEJYVltuCs",
    authDomain: "sdmapp-77fea.firebaseapp.com",
    projectId: "sdmapp-77fea",
    storageBucket: "sdmapp-77fea.appspot.com",
    messagingSenderId: "198332897306",
    appId: "1:198332897306:web:bd04334a180ee0e9a019a3",
    measurementId: "G-SPSZNG4QQ0"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
})

export { auth };

export const firestore = getFirestore(app);