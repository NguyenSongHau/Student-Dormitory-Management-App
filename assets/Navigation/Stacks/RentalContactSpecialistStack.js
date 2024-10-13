import { createStackNavigator } from '@react-navigation/stack';
import RentalContactSpecialistDetails from '../../Screens/RentalContact/RentalContactSpecialistDetails';

const Stack = createStackNavigator();

const RentalContactSpecialistStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="RentalContactSpecialistDetails" component={RentalContactSpecialistDetails} />
        </Stack.Navigator>
    );
};

export default RentalContactSpecialistStack;