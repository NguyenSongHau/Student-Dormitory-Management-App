import StaticStyle from "../../Styles/StaticStyle";
import AuthStyle from "../../Components/Auth/AuthStyle";
import Theme from "../../Styles/Theme";
import AuthHeader from "../../Components/Auth/AuthHeader";
import AuthForm from "../../Components/Auth/AuthForm";
import AuthFooter from "../../Components/Auth/AuthFooter";
import { ScrollView, View } from "react-native";
import { useState } from "react";
import { ALERT_TYPE, AlertNotificationRoot } from "react-native-alert-notification";
import DismissKeyboard from "../../Components/Common/DismissKeyboard";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { signUpFields } from "../../Utils/Fields";
import { Dialog } from "react-native-alert-notification";

const SignUp = ({ navigation }) => {
    const [account, setAccount] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);

    const handleSignUp = () => {
        for (const field of signUpFields) {
            if (!account[field.name]) {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Lỗi",
                    textBody: `${field.label} không được để trống`,
                    button: "Đóng"
                });
                return;
            };
        };

        if (account['password'] !== account['confirm']) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: "Mật khẩu và xác nhận mật khẩu không khớp",
                button: "Đóng"
            });
            return;
        };

        if (account['password'].length < 6) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: "Mật khẩu phải có ít nhất 6 kí tự",
                button: "Đóng"
            });
            return;
        };

        
    };

    return (
        <AlertNotificationRoot>
            <ScrollView style={StaticStyle.BackGround} showsVerticalScrollIndicator={false}>
                <DismissKeyboard>
                    <StatusBar hidden />
                    <LinearGradient colors={Theme.LinearColor}>
                        <View style={AuthStyle.Header}>
                            <AuthHeader
                                title="Đăng ký"
                                content="Đăng ký để sử dụng hệ thống quản lý ký túc xá sinh viên"
                            />
                        </View>

                        <View style={AuthStyle.Footer}>
                            <AuthForm
                                fields={signUpFields}
                                account={account}
                                setAccount={setAccount}
                                buttonText="Đăng ký"
                                onPressFunc={handleSignUp}
                                showRememberAndForgot={false}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                showDateTimePicker={true}
                            />

                            <AuthFooter
                                navigation={navigation}
                                content="Đã có tài khoản?"
                                screen="SignIn"
                                linkText="Đăng nhập"
                            />
                        </View>
                    </LinearGradient>
                </DismissKeyboard>
            </ScrollView>
        </AlertNotificationRoot>
    );
};

export default SignUp;