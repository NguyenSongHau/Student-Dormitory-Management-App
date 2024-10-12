import { Text } from "react-native";

const RentalContactDetails = ({ navigation, route }) => {
    const { rentalContactID } = route?.params;
    return (
        <Text>RentalContactDetails {rentalContactID}</Text>
    );
};

export default RentalContactDetails;