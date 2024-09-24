import { StyleSheet, View } from 'react-native';
import { screenHeight } from '../../Styles/StaticStyle';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';

const AuthForm = ({ fields, account, setAccount, ...props }) => {
   return (
      <View style={FormStyle.Form}>
         {fields.map((f) => (
            <AuthInput key={f.name} field={f} account={account} setAccount={setAccount} />
         ))}
         <AuthButton text={props?.buttonText} loading={props?.loading} onPressFunc={props?.onPressFunc} />
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