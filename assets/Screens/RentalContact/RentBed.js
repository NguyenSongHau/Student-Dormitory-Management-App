import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Theme from '../../Styles/Theme';
import StaticStyle from '../../Styles/StaticStyle';
import { useAccount } from '../../Store/Contexts/AccountContext';
const RentBed = ({ navigation, route }) => {
    const { roomID, bedID } = route.params;
    const currentAccount = useAccount();

    return (
        <View style={[StaticStyle.BackGround, RentBedStyle.Container]}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={RentBedStyle.BackButton}
                onPress={() => navigation.goBack()}
            >
                <AntDesign name="arrowleft" color={Theme.PrimaryColor} size={30} />
            </TouchableOpacity>

            <Text style={RentBedStyle.Title}>Hồ sơ thuê</Text>
        </View>
    );
};

const RentBedStyle = StyleSheet.create({
    Container: {
        flex: 1,
        padding: 16,
    },
    BackButton: {
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    Title: {
        textAlign: 'center',
        fontFamily: Theme.Bold,
        fontSize: 20
    }
});

export default RentBed;
