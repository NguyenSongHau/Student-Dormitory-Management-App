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
    BackButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 20,
        padding: 8,
    },
    Button: {
        marginTop: 20,
        backgroundColor: Theme.PrimaryColor,
        borderRadius: 16,
    },
    ButtonText: {
        fontSize: 16,
        fontFamily: Theme.Bold,
        padding: 10,
    },
});

export default StaticStyle;