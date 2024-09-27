import StaticStyle from "../../Styles/StaticStyle";
import AuthStyle from "../../Components/Auth/AuthStyle";
import Theme from "../../Styles/Theme";
import AuthHeader from "../../Components/Auth/AuthHeader";
import AuthForm from "../../Components/Auth/AuthForm";
import AuthFooter from "../../Components/Auth/AuthFooter";
import { ScrollView, View } from "react-native";
import { useState } from "react";
import { ALERT_TYPE, AlertNotificationRoot } from "react-native-alert-notification";
import { createUserWithEmailAndPassword} from 'firebase/auth';
import DismissKeyboard from "../../Components/Common/DismissKeyboard";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { signUpFields } from "../../Utils/Fields";
import { Dialog } from "react-native-alert-notification";
import moment from "moment";
import APIs, { endPoints } from '../../Configs/APIs';
import { isValidEmail, isValidPassword, statusCode } from '../../Configs/Constants';
import { auth } from "../../Configs/Firebase";

const SignUp = ({ navigation }) => {
    const [account, setAccount] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [role, setRole] = useState("STU");

    const handleSignUp = async () => {
        for (const field of signUpFields) {
            if (!account[field.name]) {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Lỗi",
                    textBody: `${field.label} không được để trống`,
                    button: "Đóng"
                });
                return;
            }
        }
    
        if (selectedDate === "") {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: "Ngày sinh chưa được chọn",
                button: "Đóng"
            });
            return;
        }
    
        if (!isValidEmail(account.email)) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: "Địa chỉ email không hợp lệ",
                button: "Đóng"
            });
            return;
        }
    
        if (!isValidPassword(account.password)) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: "Mật khẩu phải có tối thiểu 6 kí tự, bao gồm chữ thường, chữ hoa, số và ký tự đặc biệt",
                button: "Đóng"
            });
            return;
        }
    
        if (account['password'] !== account['confirm']) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: "Mật khẩu và xác nhận mật khẩu không khớp",
                button: "Đóng"
            });
            return;
        }
    
        if (account['identification'] && account['identification'].length !== 12) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: "Số CCCD phải có đúng 12 ký tự",
                button: "Đóng"
            });
            return;
        }
    
        if (account['student_id'] && account['student_id'].length !== 10) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: "Mã sinh viên phải có đúng 10 ký tự",
                button: "Đóng"
            });
            return;
        }
    
        if (account.academic_year && isNaN(account.academic_year)) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: "Khóa học phải là một số",
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
    
        const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
        form.append('dob', formattedDate.toString());
        form.append('role', role);
    
        try {
            const response = await APIs.post(endPoints['register-student'], form);
    
            if (response.status === statusCode.HTTP_201_CREATED) {
                await createUserWithEmailAndPassword(auth, account['email'], account['password'])
                    .then(() => {
                        Dialog.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: "Thành công",
                            textBody: response.data.message,
                            button: "Đóng"
                        });
                        navigation.navigate("SignIn");
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
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: "Đăng ký không thành công!",
                button: "Đóng"
            });
        }
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