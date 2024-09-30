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
        backgroundColor: Theme.WhiteColor,
    },
    BottomSheetView: {
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#273238',
    },
    BottomSheetItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    BottomSheetItemText: {
        fontFamily: Theme.SemiBold,
        fontSize: 20,
        color: Theme.WhiteColor,
        marginLeft: 16,
    },
    HeaderButton: {
        height: 40,
        minWidth: 80,
        padding: 8,
        marginRight: 12,
        borderRadius: 16,
        backgroundColor: '#eee',
    },
    HeaderButtonText: {
        color: Theme.BlackColor,
        fontFamily: Theme.Bold,
    },
});

export default StaticStyle;