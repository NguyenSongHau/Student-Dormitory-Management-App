import { StyleSheet, View } from 'react-native';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import AuthRememberAndForgotPassword from './AuthRememberAndForgotPassword';

const AuthForm = ({ 
    fields, 
    account, 
    setAccount, 
    isChecked, 
    setChecked, 
    onForgotPassword, 
    buttonText, 
    loading, 
    onPressFunc,
    showRememberAndForgot = true
}) => {
    return (
        <View style={FormStyle.Form}>
            {fields.map((field) => (
                <AuthInput key={field.name} field={field} account={account} setAccount={setAccount} />
            ))}

            {showRememberAndForgot && (
                <AuthRememberAndForgotPassword
                    isChecked={isChecked}
                    setChecked={setChecked}
                    onForgotPassword={onForgotPassword}
                />
            )}

            <AuthButton text={buttonText} loading={loading} onPressFunc={onPressFunc} />
        </View>
    );
};

const FormStyle = StyleSheet.create({
    Form: {
        backgroundColor: 'white',
        paddingHorizontal: 4,
        paddingBottom: 8,
        paddingTop: 32,
    },
});

export default AuthForm;