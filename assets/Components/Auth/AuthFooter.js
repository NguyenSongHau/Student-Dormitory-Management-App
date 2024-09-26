import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Theme from '../../Styles/Theme';

const AuthFooter = ({ navigation, content, screen, linkText }) => {
   return (
      <View style={FooterSytle.FooterContainer}>
         <Text style={FooterSytle.Title}>{content}</Text>
         <TouchableOpacity onPress={() => navigation.navigate(screen)}>
            <Text style={FooterSytle.FooterText}>{linkText}</Text>
         </TouchableOpacity>
      </View>
   );
};

const FooterSytle = StyleSheet.create({
    Title:{
        fontFamily: Theme.SemiBold
    },
   FooterContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: 'white',
   },
   FooterText: {
      color: Theme.PrimaryColor,
      marginLeft: 5,
      fontFamily: Theme.Bold,
   },
});

export default AuthFooter;