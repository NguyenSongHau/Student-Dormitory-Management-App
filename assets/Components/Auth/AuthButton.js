import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Theme from '../../Styles/Theme';

const AuthButton = ({ text, loading, onPressFunc }) => {
    return (
        <Button loading={loading} style={ButtonStyle.Button} onPress={onPressFunc}>
            <Text variant="headlineLarge" style={ButtonStyle.ButtonText}>
                {text}
            </Text>
        </Button>
    );
};

export const ButtonStyle = StyleSheet.create({
    Button: {
        width: '100%',
        backgroundColor: Theme.PrimaryColor,
        borderRadius: 16,
        marginBottom: 12,
    },
    ButtonText: {
        color: Theme.WhiteColor,
        fontSize: 20,
        fontFamily: Theme.Bold,
    },
});

export default AuthButton;