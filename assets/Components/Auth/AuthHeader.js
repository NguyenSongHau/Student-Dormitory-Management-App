import { StyleSheet, Text, View } from "react-native";
import { screenHeight } from "../../Styles/StaticStyle";
import Theme from "../../Styles/Theme";

const AuthHeader = ({ title, content }) => {
    return (
        <View style={HeaderStyle.HeaderContainer}>
            <Text style={HeaderStyle.HeaderTitle}>{title}</Text>
            <Text style={HeaderStyle.HeaderContent}>{content}</Text>
        </View>
    )
}

const HeaderStyle = StyleSheet.create({
    HeaderContainer: {
        marginTop: screenHeight / 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 24
    },
    HeaderTitle: {
        fontSize: 26,
        color: Theme.WhiteColor,
        marginBottom: 20,
        fontFamily: Theme.Bold,
    },
    HeaderContent: {
        fontSize: 18,
        textAlign: 'center',
        color: Theme.WhiteColor,
        lineHeight: 30,
        fontFamily: Theme.Bold,
    },
});

export default AuthHeader;