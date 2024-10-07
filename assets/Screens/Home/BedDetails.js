import { Text } from "react-native";

const BedDetails = ({ route }) => {
    const { bedID } = route.params;
    return (
        <Text>BedDetails với ID: {bedID}</Text> 
    );
}

export default BedDetails;
