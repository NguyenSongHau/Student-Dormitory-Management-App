import { Dimensions, StyleSheet } from 'react-native';
import Theme from './Theme';

export const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const StaticStyle = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    BackGround: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
    }
});

export default StaticStyle;