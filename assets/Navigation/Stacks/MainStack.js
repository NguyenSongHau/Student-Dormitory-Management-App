import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import HomeStack from '../Stacks/HomeStack';
import ProfileStack from '../Stacks/ProfileStack';
import MainTab from '../Tabs/MainTab';
import RentalContactStack from '../../Navigation/Stacks/RentalContactStack';

const Stack = createStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTab" component={MainTab} />
            <Stack.Screen name="HomeStack" component={HomeStack} />
            <Stack.Screen name="ProfileStack" component={ProfileStack} />
            <Stack.Screen name="RentalContactStack" component={RentalContactStack} />
        </Stack.Navigator>
    )
}

export default MainStack;

