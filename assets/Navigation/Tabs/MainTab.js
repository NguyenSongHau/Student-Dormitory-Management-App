import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-paper";
import Posts from '../../Screens/Home/Posts';
import RentalContacts from "../../Screens/RentalContact/RentalContacts";
import Profile from '../../Screens/Profile/Profile';
import Theme from '../../Styles/Theme';
import { StatusBar } from "expo-status-bar";

const Tab = createBottomTabNavigator();

const MainTab = () => {
    return (
        <>
            <StatusBar hidden />
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarActiveTintColor: Theme.PrimaryColor,
                    tabBarInactiveTintColor: 'black',
                    tabBarHideOnKeyboard: true,
                    headerShown: false,
                    tabBarLabelStyle: {
                        fontSize: 14,
                        fontFamily: Theme.Medium
                    },
                    tabBarStyle: {
                        height: 76,
                        paddingBottom: 10,
                        paddingTop: 10,
                    },
                    tabBarIcon: ({ focused }) => {
                        let iconName, iconColor;

                        switch (route.name) {
                            case 'Home':
                                iconName = focused ? 'home' : 'home-outline';
                                break;
                            case 'RentalContacts':
                                iconName = focused ? 'newspaper-variant' : 'newspaper-variant-outline';
                                break;
                            case 'Profile':
                                iconName = focused ? 'account' : 'account-outline';
                                break;
                        }

                        iconColor = focused ? Theme.PrimaryColor : 'gray';

                        return <Icon color={iconColor} size={36} source={iconName} />;
                    },
                })}
            >
                <Tab.Screen name="Home" component={Posts} options={{ tabBarLabel: 'Trang chủ' }} />
                <Tab.Screen name="RentalContacts" component={RentalContacts} options={{ tabBarLabel: 'Hồ sơ' }} />
                <Tab.Screen name="Profile" component={Profile} options={{ tabBarLabel: 'Tôi' }} />
            </Tab.Navigator>
        </>
    );
}

export default MainTab;