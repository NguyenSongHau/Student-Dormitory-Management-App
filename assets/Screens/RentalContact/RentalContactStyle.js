import { StyleSheet } from "react-native";
import { screenHeight } from "../../Styles/StaticStyle";
import Theme from "../../Styles/Theme";

const RentalContactStyle = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: Theme.PrimaryColor
    },
    Box: {
        paddingTop: 20,
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        height: screenHeight * 0.8,
        backgroundColor: Theme.WhiteColor,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    Title: {
        textAlign: 'center',
        fontFamily: Theme.Bold,
        fontSize: 24,
        color: Theme.PrimaryColor,
        marginBottom: 30
    },
    InfoContainer: {
        borderRadius: 10,
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 20,
    },
    InfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    InfoPersonTitle: {
        fontFamily: Theme.Bold,
        fontSize: 18,
        marginLeft: 8,
        color: Theme.PrimaryColor,
    },
    InfoRowContainer: {
        marginTop: 5,
    },
    InfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
        paddingBottom: 8,
    },
    InfoRowRentalNumber: {
        flexDirection: 'colum',
        marginTop: 8,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
        paddingBottom: 8,
    },
    InfoRowTitle: {
        fontFamily: Theme.Bold,
        marginRight: 5,
        color: '#333',
        fontSize: 16
    },
    InfoRowValue: {
        fontFamily: Theme.Regular,
        color: '#666',
        fontSize: 16
    },
    InfoRowStatus:{
        fontFamily: Theme.Bold,
        color: Theme.PrimaryColor,
        fontSize: 16
    },
    AcceptRulesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 9
    },
    AcceptRulesText: {
        fontFamily: Theme.Regular,
        fontSize: 16,
        color: '#333',
    },
    Modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    ModalContainer: {
        width: '80%', 
        backgroundColor: Theme.WhiteColor, 
        borderRadius: 10, 
        padding: 20 
    },
    ModalTitle: {
        fontFamily: Theme.Bold,
        fontSize: 20,
        marginBottom: 10
    },
    ModalDes: {
        fontFamily: Theme.Regular,
        marginBottom: 10,
        fontSize: 16,
        marginTop: 6
    },
    ButtonCloseModal: {
        color: Theme.PrimaryColor, 
        textAlign: 'center',
        fontSize: 18,
        fontFamily: Theme.Bold
    }
});

export default RentalContactStyle;