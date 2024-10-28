import { createStackNavigator } from '@react-navigation/stack';
import Theme from "../../Styles/Theme";
import EditProfile from '../../Screens/Profile/EditProfile';
import RoomSettings from '../../Screens/Profile/RoomAndBedSettings/RoomSettings';
import BillRentalContactSettings from '../../Screens/Profile/BillRentalContactSettings';
import CreateRoom from '../../Screens/Profile/RoomAndBedSettings/CreateRoom';
import EditRoom from '../../Screens/Profile/RoomAndBedSettings/EditRoom';
import BedSettings from '../../Screens/Profile/RoomAndBedSettings/BedSettings';

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
                <Stack.Group>
                    <Stack.Screen
                        name="RoomSettings"
                        component={RoomSettings}
                        options={{ title: 'Quản lý phòng' }}
                    />

                    <Stack.Screen
                        name="CreateRoom"
                        component={CreateRoom}
                        options={{ title: 'Tạo phòng' }}
                    />

                    <Stack.Screen
                        name="EditRoom"
                        component={EditRoom}
                        options={{ title: 'Sửa phòng' }}
                    />

                    <Stack.Screen
                        name="BedSettings"
                        component={BedSettings}
                        options={{ title: 'Quản lý giường' }}
                    />
                </Stack.Group>

                <Stack.Screen
                    name="EditProfile"
                    component={EditProfile}
                    options={{ title: 'Hồ sơ cá nhân' }}
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