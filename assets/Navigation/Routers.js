import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import useFonts from '../Configs/Fonts';
import Splash from '../Components/Common/Splash';

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

        </NavigationContainer>
    );
}

export default Routers;