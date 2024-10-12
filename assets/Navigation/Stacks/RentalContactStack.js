import { createStackNavigator } from '@react-navigation/stack';
import RentalContactDetails from '../../Screens/RentalContact/RentalContactDetails';

const Stack = createStackNavigator();

const RentalContactStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="RentalContactDetails" component={RentalContactDetails} />
        </Stack.Navigator>
    );
};

export default RentalContactStack;