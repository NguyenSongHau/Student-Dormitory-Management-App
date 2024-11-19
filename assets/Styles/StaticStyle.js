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
    BottomSheetView: {
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: Theme.WhiteColor,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        elevation: 4,
    },
    BottomSheetTitle: {
        fontSize: 24,
        fontFamily: Theme.Bold,
        color: Theme.WhiteColor,
        marginBottom: 16,
        textAlign: 'center',
    },
    BottomSheetButton: {
        marginVertical: 8,
        padding: 12,
        borderRadius: 8,
        backgroundColor: Theme.PrimaryColor,
        alignItems: 'center',
    },
    BottomSheetButtonText: {
        color: Theme.WhiteColor,
        fontFamily: Theme.Bold,
        fontSize: 18,
    },
    EmptyContainer: {
        marginHorizontal: 'auto',
        marginVertical: 'auto',
        marginTop: 50,
    },
    EmptyImage: {
        width: 250,
        height: 250,
    },
    EmptyText: {
        fontFamily: Theme.Bold,
        color: Theme.PrimaryColor,
        fontSize: 16,
        textAlign: 'center',
    },
    SearchFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    SearchBar: {
        flex: 10,
        marginRight: 8,
    },
});

export default StaticStyle;