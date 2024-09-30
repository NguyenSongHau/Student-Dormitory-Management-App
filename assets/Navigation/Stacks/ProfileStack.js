import { createStackNavigator } from '@react-navigation/stack';
import StudentBillRentalContact from '../../Screens/Profile/StudentBillRentalContact';
import StudentElectricAndWaterBill from '../../Screens/Profile/StudentElectricAndWaterBill';
import StudentViolateNotice from '../../Screens/Profile/StudentViolateNotice';
import Theme from "../../Styles/Theme";
import EditProfile from '../../Screens/Profile/EditProfile';

const Stack = createStackNavigator();

const ProfileStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Theme.PrimaryColor },
                headerTintColor: Theme.WhiteColor
            }}
        >
            <Stack.Group>
                <Stack.Screen
                    name="EditProfile"
                    component={EditProfile}
                    options={{ title: 'Hồ sơ cá nhân' }}
                />

                <Stack.Screen
                    name="StudentBillRentalContact"
                    component={StudentBillRentalContact}
                    options={{ title: 'Hóa đơn thuê' }}
                />

                <Stack.Screen
                    name="StudentElectricAndWaterBill"
                    component={StudentElectricAndWaterBill}
                    options={{ title: 'Hóa đơn điện, nước' }}
                />

                <Stack.Screen
                    name="StudentViolateNotice"
                    component={StudentViolateNotice}
                    options={{ title: 'Hóa đơn thuê' }}
                />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default ProfileStack;