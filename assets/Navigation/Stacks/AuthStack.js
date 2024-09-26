import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import SignIn from '../../Screens/Auth/SignIn';
import SignUp from '../../Screens/Auth/SignUp';
import Onboarding from '../../Screens/Onboarding/Onboarding';
import Loading from '../../Components/Common/Loading';

const Stack = createStackNavigator();

const AuthStack = () => {
    const [onboarding, setOnboarding] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const checkOnboardingDone = async () => {
        const onboardingDone = (await AsyncStorage.getItem('onboarding-done')) || null;
        if (onboardingDone) setOnboarding(false);
        setIsLoading(false);
    };

    useEffect(() => {
        checkOnboardingDone();
    }, []);

    if (isLoading) {
        return <Loading size={24} />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {onboarding && <Stack.Screen name="Onboarding" component={Onboarding} />}
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
    );
};

export default AuthStack;