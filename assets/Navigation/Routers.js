import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import useFonts from '../Configs/Fonts';
import Splash from '../Components/Common/Splash';
import Onboarding from '../Screens/Onboarding/Onboarding';

const Stack = createStackNavigator();

const Routers = () => {
    const fontsLoaded = useFonts();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        if (fontsLoaded) {
            const timer = setTimeout(() => {
                setShowSplash(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [fontsLoaded]);

    if (showSplash) {
        return <Splash />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Onboarding" 
                    component={Onboarding} 
                    options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Routers;
