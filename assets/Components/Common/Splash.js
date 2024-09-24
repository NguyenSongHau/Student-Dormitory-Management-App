import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import StaticStyle from '../../Styles/StaticStyle';

const Splash = ({ onAnimationEnd }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }
            ),
            Animated.timing(
                fadeAnim,
                {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }
            )
        ]).start(() => {
            // When animation finishes, call the callback
            if (onAnimationEnd) {
                onAnimationEnd();  // Notify parent to trigger navigation
            }
        });
    }, [fadeAnim]);

    return (
        <View style={StaticStyle.Container}>
            <Animated.Image
                style={{
                    width: '100%',
                    height: '100%',
                    opacity: fadeAnim,
                }}
                source={require('../../Assets/Images/Splash/Splash.jpg')}
            />
        </View>
    );
}

export default Splash;