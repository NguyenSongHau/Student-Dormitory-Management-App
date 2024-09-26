import { StyleSheet } from "react-native";
import Theme from "../../Styles/Theme";

const AuthStyle = StyleSheet.create({
    Header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 4
    },
    Footer: {
        flex: 3,
        backgroundColor: Theme.WhiteColor,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 22,
        paddingVertical: 30
    },
});

export default AuthStyle;