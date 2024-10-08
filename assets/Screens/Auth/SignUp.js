import StaticStyle from "../../Styles/StaticStyle";
import AuthStyle from "../../Components/Auth/AuthStyle";
import Theme from "../../Styles/Theme";
import AuthHeader from "../../Components/Auth/AuthHeader";
import AuthForm from "../../Components/Auth/AuthForm";
import AuthFooter from "../../Components/Auth/AuthFooter";
import { ScrollView, View } from "react-native";
import { useState } from "react";
import { ALERT_TYPE, AlertNotificationRoot } from "react-native-alert-notification";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import DismissKeyboard from "../../Components/Common/DismissKeyboard";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { signUpFields } from "../../Utils/Fields";
import { Dialog } from "react-native-alert-notification";
import moment from "moment";
import APIs, { endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import { auth } from "../../Configs/Firebase";

const SignUp = ({ navigation }) => {
    const [account, setAccount] = useState({});
    const [role, setRole] = useState("STU");

    const handleSignUp = async () => {
        for (const field of signUpFields) {
            if (!account[field.name]) {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Lỗi",
                    textBody: `${field.label} không được trống`,
                    button: "Đóng"
                });
                return;
            }
        }

        if (account['password'] !== account['confirm']) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: "Mật khẩu và xác nhận mật khẩu không khớp.",
                button: "Đóng"
            });
            return;
        }

        let form = new FormData();
        for (let key in account) {
            if (key !== 'confirm') {
                form.append(key, account[key]);
            }
        }

        const formattedDate = moment(account['dob'], 'DD-MM-YYYY').format('YYYY-MM-DD');
        form.append('dob', formattedDate.toString());
        form.append('role', role);

        try {
            const response = await APIs.post(endPoints['register-student'], form);

            console.log(response);

            if (response.status === statusCode.HTTP_201_CREATED) {
                await createUserWithEmailAndPassword(auth, account['email'], account['password'])
                    .then(() => {
                        Dialog.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: "Thành công",
                            textBody: response.data.message,
                            button: "Đóng"
                        });
                        setTimeout(() => {
                            navigation.navigate("SignIn");
                        }, 3000);
                    })
                    .catch((error) => {
                        Dialog.show({
                            type: ALERT_TYPE.DANGER,
                            title: "Lỗi",
                            textBody: "Hệ thống đang bận, vui lòng thử lại sau!",
                            button: "Đóng"
                        });
                    });
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;

                const errorMessages = {
                    "Enter a valid email address.": "Email không đúng định dạng.",
                    "A valid integer is required.": "Khóa học phải là một số nguyên.",
                    "user with this email already exists.": "Email này đã tồn tại.",
                    "user with this identification already exists.": "CCCD này đã tồn tại.",
                    "Ensure this field has no more than 12 characters.": "Số CCCD không được vượt quá 12 ký tự.",
                    "Ensure this field has no more than 10 characters.": "Mã số sinh viên không được vượt quá 10 ký tự."
                };

                const keysToCheck = ['email', 'password', 'identification', 'student_id', 'academic_year'];
                let firstErrorMessage = "";

                for (const key of keysToCheck) {
                    if (errorData[key]) {
                        if (key === 'email' || key === 'academic_year') {
                            firstErrorMessage = errorMessages[errorData[key][0]] || errorData[key][0];
                        } else if (key === 'password') {
                            firstErrorMessage = errorData[key].message;
                        } else {
                            firstErrorMessage = errorData[key].message || errorMessages[errorData[key][0]] || errorData[key][0];
                        }
                        break;
                    }
                }

                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Lỗi",
                    textBody: firstErrorMessage,
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