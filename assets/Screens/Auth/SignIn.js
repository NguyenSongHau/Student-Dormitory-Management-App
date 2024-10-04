import APIs, { authAPI, endPoints, CLIENT_ID, CLIENT_SECRET, } from '../../Configs/APIs';
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from 'react';
import Theme from "../../Styles/Theme";
import { ScrollView, StyleSheet, View } from "react-native";
import AuthStyle from '../../Components/Auth/AuthStyle';
import { StatusBar } from "expo-status-bar";
import AuthHeader from "../../Components/Auth/AuthHeader";
import AuthForm from "../../Components/Auth/AuthForm";
import AuthFooter from '../../Components/Auth/AuthFooter';
import DismissKeyboard from "../../Components/Common/DismissKeyboard";
import StaticStyle from "../../Styles/StaticStyle";
import { signInFields } from '../../Utils/Fields';
import { ALERT_TYPE, AlertNotificationRoot, Dialog} from 'react-native-alert-notification';
import { statusCode } from '../../Configs/Constants';
import { useAccountDispatch } from '../../Store/Contexts/AccountContext';
import { setTokens } from '../../Utils/Utilities';
import { SignInAction } from '../../Store/Actions/AccountAction';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Configs/Firebase';

const SignIn = ({ navigation }) => {
    const dispatch = useAccountDispatch();
    const [account, setAccount] = useState({});
    const [isChecked, setChecked] = useState(false);

    const handleSignIn = async () => {
        for (const field of signInFields) {
            if (!account[field.name]) {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Lỗi",
                    textBody: "Email hoặc mật khẩu không được trống.",
                    button: "Đóng"
                });
                return;
            };
        };

        const data = {
            ...account,
            grant_type: 'password',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        };

        try {
            const tokens = await APIs.post(endPoints['token'], data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (tokens.status !== statusCode.HTTP_200_OK) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Lỗi",
                    textBody: "Đăng nhập thất bại!",
                    button: "Đóng"
                });
            }

            const response = await authAPI(tokens.data.access_token).get(endPoints['current-user']);

            if (response.status !== statusCode.HTTP_200_OK) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Lỗi",
                    textBody: "Lấy thông tin người dùng thất bại!",
                    button: "Đóng"
                });
            }

            await signInWithEmailAndPassword(auth, account['username'], account['password']);

            await setTokens(tokens);
            dispatch(SignInAction(response.data));
        } catch (error) {
            if (error.message && error.message.includes('auth/invalid-credential')) {
                createUserWithEmailAndPassword(auth, account['username'], account['password'])
                    .then(() => handleSignIn())
                    .catch((error) => {
                        console.error(`Error sign in: ${error}`);
                        Dialog.show({
                            type: ALERT_TYPE.DANGER,
                            title: "Lỗi",
                            textBody: "Hệ thống đang bận, vui lòng thử lại sau!",
                            button: "Đóng"
                        });
                    });
            } else if (error.response && error.response.status === statusCode.HTTP_400_BAD_REQUEST) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Lỗi",
                    textBody: "Email hoặc mật khẩu không chính xác.",
                    button: "Đóng"
                });
            } else {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Lỗi",
                    textBody: "Hệ thống đang bận, vui lòng thử lại sau!",
                    button: "Đóng"
                });
            };
        };
    };

    const handleForgotPassword = () => {

    };

    return (
        <AlertNotificationRoot>
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
                                onPressFunc={handleSignIn}
                                isChecked={isChecked}
                                setChecked={setChecked}
                                onForgotPassword={handleForgotPassword}
                            />

                            <AuthFooter navigation={navigation} content="Chưa có tài khoản?" screen="SignUp" linkText="Đăng ký" />
                        </View>
                    </LinearGradient>
                </DismissKeyboard>
            </ScrollView>
        </AlertNotificationRoot>
    );
};

export default SignIn;