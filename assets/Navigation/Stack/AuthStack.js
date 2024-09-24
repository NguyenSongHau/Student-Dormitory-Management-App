import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import SignIn from '../../Screens/Auth/SignIn';
import Onboarding from '../../Screens/Onboarding/Onboarding';

const Stack = createStackNavigator();

const AuthStack = () => {
    const [onboarding, setOnboarding] = useState(true);

    const checkOnboardingDone = async () => {
        const onboardingDone = (await AsyncStorage.getItem('onboarding-done')) || null;
        if (onboardingDone) setOnboarding(false);
    };

    useEffect(() => {
        checkOnboardingDone();
    }, []);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {onboarding && <Stack.Screen name="Onboarding" component={Onboarding} />}
            <Stack.Screen name="SignIn" component={SignIn} />
        </Stack.Navigator>
    )
}

export default AuthStack;