import { createStackNavigator } from '@react-navigation/stack';
import PostDeTails from '../../Screens/Home/PostDetails';
import BedDetails from '../../Screens/Home/BedDetails';

const Stack = createStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PostDeTails" component={PostDeTails} />
            <Stack.Screen name="BedDetails" component={BedDetails} />
        </Stack.Navigator>
    );
};

export default HomeStack;