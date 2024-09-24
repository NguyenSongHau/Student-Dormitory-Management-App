import APIs, { authAPI, CLIENT_ID, CLIENT_SECRET, endPoints } from '../../Configs/APIs';
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from 'react';
import Theme from "../../Styles/Theme";
import { ScrollView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AuthHeader from "../../Components/Auth/AuthHeader";
import AuthForm from "../../Components/Auth/AuthForm";
import DismissKeyboard from "../../Components/Common/DismissKeyboard";
import StaticStyle from "../../Styles/StaticStyle";
import { signInFields } from '../../Utils/Fields';
import { ALERT_TYPE, AlertNotificationRoot, Dialog } from 'react-native-alert-notification';
import { statusCode } from '../../Configs/Constants';
import { useAccountDispatch } from '../../Store/Contexts/AccountContext';
import { setTokens } from '../../Utils/Utilities';
import { SignInAction } from '../../Store/Actions/AccountAction';

const SignIn = ({ navigation }) => {
    const[account, setAccount] = useState({});
    const dispatch = useAccountDispatch();

    const handleSignIn = async () => {
        for (const field of signInFields) {
            if (!account[field.name]) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Lỗi",
                    textBody: "Email hoặc mật khẩu không được để trống",
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
                    textBody: "Đăng nhập thất bại",
                    button: "Đóng"
                });
            }

            const response = await authAPI(tokens.data.access_token).get(endPoints['current-user']);

            console.log(response);
            if (response.status !== statusCode.HTTP_200_OK) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Lỗi",
                    textBody: "Lấy thông tin người dùng thất bại",
                    button: "Đóng"
                });
            }

            await setTokens(tokens);
            dispatch(SignInAction(response.data));
        } catch (error) {
            console.log(error);
        }
    }

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
                            />
                        </View>
                    </LinearGradient>
                </DismissKeyboard>
            </ScrollView>
        </AlertNotificationRoot>
    );
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