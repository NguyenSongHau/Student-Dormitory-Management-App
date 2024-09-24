import React, { useEffect, useState } from 'react';
import useFonts from '../Configs/Fonts';
import { NavigationContainer } from '@react-navigation/native';
import { useAccount } from '../Store/Contexts/AccountContext';
import AuthStack from '../Navigation/Stack/AuthStack';
import MainStack from '../Navigation/Stack/MainStack';
import Splash from '../Components/Common/Splash';

const Routers = () => {
    const fontsLoaded = useFonts();
    const account = useAccount();
    const [isSplashVisible, setIsSplashVisible] = useState(true);

    useEffect(() => {
        let timeoutId;

        if (fontsLoaded) {
            timeoutId = setTimeout(() => {
                setIsSplashVisible(false);
            }, 4000);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [fontsLoaded]);

    if (isSplashVisible) {
        return <Splash />;
    }

    return (
        <NavigationContainer>
            {!account.isLoggedIn ? <AuthStack /> : <MainStack />}
        </NavigationContainer>
    );
}

export default Routers;