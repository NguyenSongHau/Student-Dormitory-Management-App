import { useEffect, useState } from "react";
import { Text } from "react-native";
import { getTokens } from "../../Utils/Utilities";
import { authAPI, endPoints } from "../../Configs/APIs";
import { statusCode } from "../../Configs/Constants";

const RentalContacts = () => {
    const [rentalContact, setRentalContact] = useState([]);

    useEffect(() => {
        const loadRentContact = async () => {
            const { accessToken } = await getTokens();
            try{
                let response = await authAPI(accessToken).get(endPoints['rental-contact-student']);
                console.log(response);
                if (response.status === statusCode.HTTP_200_OK) {
                    setRentalContact(response.data.results);
                }
            }catch(error){
                console.error(error);
            }
        }

        loadRentContact();
    },[])
    return(
        <Text>RentalContacts</Text>
    )
}

export default RentalContacts ;