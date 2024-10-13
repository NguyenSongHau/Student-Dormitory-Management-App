import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-paper";
import Posts from '../../Screens/Home/Posts';
import RentalContacts from "../../Screens/RentalContact/RentalContacts";
import Profile from '../../Screens/Profile/Profile';
import Theme from '../../Styles/Theme';
import { StatusBar } from "expo-status-bar";
import { useAccount } from "../../Store/Contexts/AccountContext";
import RentalContactSpecialist from "../../Screens/RentalContact/RentalContactSpecialist";
import { roles } from "../../Configs/Constants";

const Tab = createBottomTabNavigator();

const MainTab = () => {
    const currentAccount = useAccount();
    
    const renderRentalContactScreen = () => {
        if (currentAccount.data.role === roles.STUDENT) {
            return RentalContacts;
        } else if (currentAccount.data.role === roles.SPECIALIST) {
            return RentalContactSpecialist;
        }
        return null;
    };

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
                {currentAccount.data.role && (
                    <Tab.Screen 
                        name="RentalContacts" 
                        component={renderRentalContactScreen()} 
                        options={{ tabBarLabel: 'Hồ sơ' }} 
                    />
                )}
                <Tab.Screen name="Profile" component={Profile} options={{ tabBarLabel: 'Tôi' }} />
            </Tab.Navigator>
        </>
    );
}

export default MainTab;