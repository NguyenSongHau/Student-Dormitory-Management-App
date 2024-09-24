import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import StaticStyle from "../../Styles/StaticStyle";
import DismissKeyboard from "../../Components/Common/DismissKeyboard";
import Theme from "../../Styles/Theme";
import AuthHeader from "../../Components/Auth/AuthHeader";
import AuthForm from "../../Components/Auth/AuthForm";
import AuthButton from "../../Components/Auth/AuthButton";
import { useState } from "react";
import { signInFields } from '../../Utils/Fields';

const SignIn = ({navigation}) => {
    const [account, setAccount] = useState({});
    
    return (
        <ScrollView style={StaticStyle.BackGround}>
            <DismissKeyboard>
                <StatusBar hidden />
                <LinearGradient colors={Theme.LinearColor}>
                    <View style={AuthStyle.Header}>
                        <AuthHeader title="Đăng nhập" content="Đăng nhập để sử dụng hệ thống quản lý ký túc xá sinh viên" />
                    </View>

                    <View style={AuthStyle.Footer}>
                        <AuthForm
                            fields={signInFields}
                            account={account}
                            setAccount={setAccount}
                            buttonText="Đăng nhập"
                        />
                    </View>
                </LinearGradient>
            </DismissKeyboard>
        </ScrollView>
    )
}

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

export default SignIn;