import { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, Alert, RefreshControl } from "react-native";
import { getTokens } from "../../Utils/Utilities";
import { authAPI, endPoints } from "../../Configs/APIs";
import { gender, statusCode } from "../../Configs/Constants";
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import Theme from '../../Styles/Theme';
import StaticStyle from "../../Styles/StaticStyle";
import RentalContactStyle from "./RentalContactStyle";
import { AntDesign } from '@expo/vector-icons';
import { Button } from "react-native-paper";
import { useAccount } from "../../Store/Contexts/AccountContext";
import { statusRentalContact } from "../../Configs/Constants";
import Loading from "../../Components/Common/Loading";
import { typeRoom } from "../../Configs/Constants";
import RentalContactCardDetail from "../../Components/RentalContact/RentalContactCardDetail";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';

const RentalContactSpecialistDetails = ({ navigation, route }) => {
    const bottomSheetRef = useRef(null);
    const currentAccount = useAccount();
    const { rentalContactID } = route?.params;
    const [contactDetails, setContactDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadRentContactSpecialistDetails = async () => {
        setLoading(true);
        const { accessToken } = await getTokens();
        try {
            let response = await authAPI(accessToken).get(endPoints['rental-contact-details'](rentalContactID));
            if (response.status === statusCode.HTTP_200_OK) {
                setContactDetails(response.data);
            }
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

    useEffect(() => {
        loadRentContactSpecialistDetails();
    }, [rentalContactID]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadRentContactSpecialistDetails();
        setRefreshing(false);
    }, [rentalContactID]);

    const rejectRentalContact = async () => {
        const { accessToken } = await getTokens();
        try {
            const response = await authAPI(accessToken).post(endPoints['reject-rental-contact'](rentalContactID));
            console.log(response);
            if (response.status === statusCode.HTTP_200_OK) {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Thành công",
                    textBody: response.data.message,
                    button: "Đóng"
                });
                navigation.goBack();
            } else {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Lỗi",
                    textBody: "Không thể từ chối hồ sơ, vui lòng thử lại sau!",
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

    const confirmRentalContact = async () => {
        const { accessToken } = await getTokens();
        try {
            const response = await authAPI(accessToken).post(endPoints['confirm-rental-contact'](rentalContactID));
            console.log(response);
            if (response.status === statusCode.HTTP_200_OK) {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Thành công",
                    textBody: response.data.message,
                    button: "Đóng"
                });
                navigation.goBack();
            } else {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Lỗi",
                    textBody: "Không thể xác nhận hồ sơ, vui lòng thử lại sau!",
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

    const handleRejectPress = () => {
        Alert.alert(
            "Xác nhận từ chối hồ sơ",
            "Bạn có chắc chắn muốn từ chối hồ sơ này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xác nhận",
                    onPress: rejectRentalContact
                }
            ]
        );
    };

    const handleConfirmPress = () => {
        Alert.alert(
            "Xác nhận xác nhận hồ sơ",
            "Bạn có chắc chắn muốn xác nhận hồ sơ này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xác nhận",
                    onPress: confirmRentalContact
                }
            ]
        );
    };

    const handleShowBottomSheet = () => {
        bottomSheetRef.current?.present();
    };

    if (loading) {
        return <Loading />;
    }
    return (
        <BottomSheetModalProvider>
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
                                        onPress={handleShowBottomSheet}
                                    >
                                        Xử lý hồ sơ
                                    </Button>
                                )}
                            </View>
                        </View>
                    </ScrollView>

                    <BottomSheetModal
                        ref={bottomSheetRef}
                        index={0}
                        snapPoints={['26%']}
                        enablePanDownToClose
                    >
                        <BottomSheetView style={StaticStyle.BottomSheetView}>
                            <Text style={StaticStyle.BottomSheetTitle}>Lựa chọn</Text>
                            <TouchableOpacity style={StaticStyle.BottomSheetButton} onPress={handleConfirmPress}>
                                <Text style={StaticStyle.BottomSheetButtonText}>Duyệt hồ sơ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={StaticStyle.BottomSheetButton} onPress={handleRejectPress}>
                                <Text style={StaticStyle.BottomSheetButtonText}>Từ chối hồ sơ</Text>
                            </TouchableOpacity>
                        </BottomSheetView>
                    </BottomSheetModal>
                </View>
            </View>
        </BottomSheetModalProvider>
    );
};

export default RentalContactSpecialistDetails;