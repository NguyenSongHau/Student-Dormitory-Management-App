import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import useFonts from '../Configs/Fonts';
import Splash from '../Components/Common/Splash';
import Onboarding from '../Screens/Onboarding/Onboarding';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const Routers = () => {
    const fontsLoaded = useFonts();
    const [isSplashVisible, setIsSplashVisible] = useState(true);

    const handleSplashEnd = () => {
        setIsSplashVisible(false);
    };

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isSplashVisible ? (
                    <Stack.Screen name="Splash">
                        {() => <Splash onAnimationEnd={handleSplashEnd} />}
                    </Stack.Screen>
                ) : (
                    <Stack.Screen name="Onboarding" component={Onboarding} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Routers;