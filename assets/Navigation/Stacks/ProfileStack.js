import { createStackNavigator } from '@react-navigation/stack';
import StudentBillRentalContact from '../../Screens/Profile/StudentBillRentalContact';
import StudentElectricAndWaterBill from '../../Screens/Profile/StudentElectricAndWaterBill';
import StudentViolateNotice from '../../Screens/Profile/StudentViolateNotice';
import Theme from "../../Styles/Theme";
import EditProfile from '../../Screens/Profile/EditProfile';
import RoomAndBedSettings from '../../Screens/Profile/RoomAndBedSettings';
import BillRentalContactSettings from '../../Screens/Profile/BillRentalContactSettings';

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
                    name="RoomAndBedSettings"
                    component={RoomAndBedSettings}
                    options={{ title: 'Quản lý phòng và giường' }}
                />

                <Stack.Screen
                    name="BillRentalContactSettings"
                    component={BillRentalContactSettings}
                    options={{ title: 'Quản lý hóa đơn thuê' }}
                />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default ProfileStack;