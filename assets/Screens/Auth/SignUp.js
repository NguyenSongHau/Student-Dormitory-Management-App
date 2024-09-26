import StaticStyle from "../../Styles/StaticStyle";
import AuthStyle from "../../Components/Auth/AuthStyle";
import Theme from "../../Styles/Theme";
import AuthHeader from "../../Components/Auth/AuthHeader";
import AuthForm from "../../Components/Auth/AuthForm";
import AuthFooter from "../../Components/Auth/AuthFooter";
import { ScrollView, View } from "react-native";
import { useState } from "react";
import { AlertNotificationRoot } from "react-native-alert-notification";
import DismissKeyboard from "../../Components/Common/DismissKeyboard";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { signUpFields } from "../../Utils/Fields";

const SignUp = ({ navigation }) => {
    const [account, setAccount] = useState({});

    const handleSignUp = () => {

    };

    return (
        <AlertNotificationRoot>
            <ScrollView style={StaticStyle.BackGround}>
                <DismissKeyboard>
                    <StatusBar hidden />
                    <LinearGradient colors={Theme.LinearColor}>
                        <View style={AuthStyle.Header}>
                            <AuthHeader title="Đăng ký" content="Đăng ký để sử dụng hệ thống quản lý ký túc xá sinh viên" />
                        </View>

                        <View style={AuthStyle.Footer}>
                            <AuthForm
                                fields={signUpFields}
                                account={account}
                                setAccount={setAccount}
                                buttonText="Đăng ký"
                                onPressFunc={handleSignUp}
                                showRememberAndForgot={false}
                            />

                            <AuthFooter navigation={navigation} content="Đã có tài khoản?" screen="SignIn" linkText="Đăng nhập" />
                        </View>
                    </LinearGradient>
                </DismissKeyboard>
            </ScrollView>
        </AlertNotificationRoot>
    );
};

export default SignUp;