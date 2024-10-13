import { createStackNavigator } from '@react-navigation/stack';
import { Image, Text, View } from 'react-native';
import HomeStack from '../Stacks/HomeStack';
import ProfileStack from '../Stacks/ProfileStack';
import MainTab from '../Tabs/MainTab';
import RentalContactStack from '../../Navigation/Stacks/RentalContactStack';
import RentalContactSpecialistStack from './RentalContactSpecialistStack';
import ChatStack from './ChatStack';
import ChatTab from '../Tabs/ChatTab';
import Theme from '../../Styles/Theme';
import { TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTab" component={MainTab} />
            <Stack.Screen name="HomeStack" component={HomeStack} />
            <Stack.Screen name="ProfileStack" component={ProfileStack} />
            <Stack.Screen name="RentalContactStack" component={RentalContactStack} />
            <Stack.Screen name="RentalContactSpecialistStack" component={RentalContactSpecialistStack} />
            <Stack.Screen name="ChatStack" component={ChatStack} />
            <Stack.Screen
                name="ChatTab"
                component={ChatTab}
                options={({ navigation, route }) => ({
                    title: '',
                    headerShown: true,
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: Theme.PrimaryColor },
                    headerRight: () => (
                        <TouchableOpacity
                            style={{ marginRight: 12 }}
                            onPress={() =>
                                navigation.navigate('ProfileStack', {
                                    screen: 'EditProfile',
                                })
                            }
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontFamily: Theme.Bold, fontSize: 20, color: '#fff', marginRight: 12 }}>
                                    {route?.params?.fullName}
                                </Text>
                                <Image
                                    source={{ uri: route?.params?.avatar }}
                                    style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.SecondaryColor }}
                                />
                            </View>
                        </TouchableOpacity>
                    ),
                })}
            />
        </Stack.Navigator>
    )
}

export default MainStack;

