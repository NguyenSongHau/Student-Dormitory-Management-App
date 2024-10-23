import { useCallback, useEffect, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, Alert, RefreshControl } from "react-native";
import { getTokens } from "../../Utils/Utilities";
import { authAPI, endPoints } from "../../Configs/APIs";
import { gender, statusCode, typeRoom } from "../../Configs/Constants";
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import Theme from '../../Styles/Theme';
import StaticStyle from "../../Styles/StaticStyle";
import RentalContactStyle from "./RentalContactStyle";
import { AntDesign } from '@expo/vector-icons';
import { Button, Icon } from "react-native-paper";
import { useAccount } from "../../Store/Contexts/AccountContext";
import { statusRentalContact } from "../../Configs/Constants";
import Loading from "../../Components/Common/Loading";
import RentalContactCardDetail from "../../Components/RentalContact/RentalContactCardDetail";

const RentalContactDetails = ({ navigation, route }) => {
    const currentAccount = useAccount();
    const { rentalContactID } = route?.params;
    const [contactDetails, setContactDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadRentContactDetail = async () => {
        setLoading(true);
        const { accessToken } = await getTokens();
        try {
            let response = await authAPI(accessToken).get(endPoints['rental-contact-detail-student'](rentalContactID));
            setContactDetails(response.data);
        } catch (error) {
            console.error(error);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Lỗi",
                textBody: "Hệ thống đang bận, vui lòng thử lại sau!",
                button: "Đóng"
            });
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadRentContactDetail();
        setRefreshing(false);
    }, [rentalContactID]);

    const cancelRentalContact = async () => {
        const { accessToken } = await getTokens();
        try {
            const response = await authAPI(accessToken).post(endPoints['cancel-rental-contact'](rentalContactID));
            if (response.status === statusCode.HTTP_200_OK) {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Thành công",
                    textBody: response.data.message,
                    button: "Đóng"
                });

                setTimeout(() => {
                    navigation.goBack();
                }, 2000);
            } else {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Lỗi",
                    textBody: "Không thể hủy hồ sơ, vui lòng thử lại sau!",
                    button: "Đóng"
                });
            }
        } catch (error) {
            console.error(error);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Lỗi",
                textBody: "Hệ thống đang bận, vui lòng thử lại sau!",
                button: "Đóng"
            });
        }
    };

    const handleCancelPress = () => {
        Alert.alert(
            "Xác nhận hủy hồ sơ",
            "Bạn có chắc chắn muốn hủy hồ sơ này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xác nhận",
                    onPress: cancelRentalContact
                }
            ]
        );
    };

    useEffect(() => {
        loadRentContactDetail();
    }, [rentalContactID]);

    if (loading) {
        return <Loading />
    }

    return (
        <View style={[StaticStyle.BackGround, RentalContactStyle.Container]}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={StaticStyle.BackButton}
                onPress={() => navigation.goBack()}
            >
                <AntDesign name="arrowleft" color={Theme.PrimaryColor} size={30} />
            </TouchableOpacity>

            <View style={RentalContactStyle.Box}>
                <Text style={RentalContactStyle.Title}>Chi tiết hồ sơ thuê</Text>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <RentalContactCardDetail
                        contactDetails={contactDetails}
                        currentAccount={currentAccount}
                        gender={gender}
                        statusRentalContact={statusRentalContact}
                        typeRoom={typeRoom}
                    />

                    <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                        <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                            {contactDetails.status === "PROCESSING" && (
                                <Button
                                    mode="contained"
                                    style={StaticStyle.Button}
                                    labelStyle={StaticStyle.ButtonText}
                                    onPress={handleCancelPress}
                                >
                                    Hủy hồ sơ
                                </Button>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default RentalContactDetails;