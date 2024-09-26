import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Theme from '../../Styles/Theme';

const AuthRememberAndForgotPassword = ({ isChecked, setChecked, onForgotPassword }) => {
    return (
        <View style={styles.CheckboxContainer}>
            <View style={styles.RememberMeContainer}>
                <Checkbox
                    status={isChecked ? 'checked' : 'unchecked'}
                    onPress={() => setChecked(!isChecked)}
                    color={Theme.PrimaryColor}
                />
                <Text style={styles.CheckboxLabel}>Nhớ mật khẩu</Text>
            </View>
            <TouchableOpacity onPress={onForgotPassword}>
                <Text style={styles.ForgotPasswordText}>Quên mật khẩu</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    CheckboxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    RememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    CheckboxLabel: {
        fontSize: 14,
        fontFamily: Theme.Bold,
        color: Theme.PrimaryColor,
    },
    ForgotPasswordText: {
        color: Theme.PrimaryColor,
        fontSize: 14,
        fontFamily: Theme.Bold
    },
});

export default AuthRememberAndForgotPassword;