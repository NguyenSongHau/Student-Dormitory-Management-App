import { StyleSheet } from 'react-native';
import Theme from '../../../Styles/Theme';

const RoomAndBedSettingStyle = StyleSheet.create({
    Container: {
        padding: 16,
    },
    BoxImage: {
        width: "100%",
        height: 200,
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "white",
        marginBottom: 16,
    },
    Image: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    Input: {
        marginTop: 16,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        borderRadius: 5,
    },
    Title: {
        marginTop: 16,
        fontSize: 16,
        fontFamily: Theme.Bold,
        color: Theme.PrimaryColor,
    },
    CreateButton: {
        marginTop: 20,
        backgroundColor: Theme.PrimaryColor,
        borderRadius: 5,
    },
    ButtonContent: {
        height: 50
    },
    ButtonText: {
        color: Theme.WhiteColor,
        fontSize: 18
    },
    ModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    ModalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
    },
    ModalTitle: {
        fontSize: 20,
        fontFamily: Theme.Bold,
        color: Theme.PrimaryColor,
        marginBottom: 10,
        textAlign: 'center',
    },
    OptionText: {
        padding: 16,
        fontSize: 18,
        textAlign: 'center',
        fontFamily: Theme.SemiBold,
    },
    CloseTextContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    CloseText: {
        color: Theme.PrimaryColor,
        fontSize: 18,
        fontFamily: Theme.Bold,
    }
});

export default RoomAndBedSettingStyle;
