import { createStackNavigator } from '@react-navigation/stack';
import PostDeTails from '../../Screens/Home/PostDetails';
const Stack = createStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PostDeTails" component={PostDeTails} />
        </Stack.Navigator>
    );
};

export default HomeStack;