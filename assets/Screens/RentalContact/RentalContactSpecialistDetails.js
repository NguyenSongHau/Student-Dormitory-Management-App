import { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, Alert, RefreshControl } from "react-native";
import { formatCurrency, formatDate, getTokens } from "../../Utils/Utilities";
import { authAPI, endPoints } from "../../Configs/APIs";
import { gender, statusCode } from "../../Configs/Constants";
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import Theme from '../../Styles/Theme';
import StaticStyle from "../../Styles/StaticStyle";
import RentalContactStyle from "./RentalContactStyle";
import { AntDesign } from '@expo/vector-icons';
import { Button, Icon } from "react-native-paper";
import { useAccount } from "../../Store/Contexts/AccountContext";
import { statusRentalContact } from "../../Configs/Constants";
import Loading from "../../Components/Common/Loading";
import { typeRoom } from "../../Configs/Constants";
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
                        <View style={RentalContactStyle.InfoContainer}>
                            <View style={RentalContactStyle.InfoHeader}>
                                <Icon source="star-four-points" color={Theme.PrimaryColor} size={20} />
                                <Text style={RentalContactStyle.InfoPersonTitle}>Thông tin hồ sơ</Text>
                            </View>
                            <View style={RentalContactStyle.InfoRowContainer}>
                                <View style={RentalContactStyle.InfoRowRentalNumber}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Mã hồ sơ: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.rental_number}</Text>
                                </View>
                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Thời gian thuê: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.time_rental} tháng</Text>
                                </View>
                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Trạng thái hồ sơ: </Text>
                                    <Text style={RentalContactStyle.InfoRowStatus}>
                                        {statusRentalContact[contactDetails.status]}
                                    </Text>
                                </View>
                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Ngày tạo: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>{formatDate(contactDetails.created_date)}</Text>
                                </View>

                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Ngày cập nhập: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>{formatDate(contactDetails.updated_date)}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={RentalContactStyle.InfoContainer}>
                            <View style={RentalContactStyle.InfoHeader}>
                                <Icon source="star-four-points" color={Theme.PrimaryColor} size={20} />
                                <Text style={RentalContactStyle.InfoPersonTitle}>Thông tin người thuê</Text>
                            </View>

                            <View style={RentalContactStyle.InfoRowContainer}>
                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Họ và tên: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>{currentAccount.data.full_name}</Text>
                                </View>

                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Ngày sinh: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>{formatDate(currentAccount.data.dob)}</Text>
                                </View>

                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Giới tính: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>
                                        {currentAccount.data.gender === "M" ? gender.M : gender.F}
                                    </Text>
                                </View>

                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>CCCD: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>
                                        {currentAccount.data.identification}
                                    </Text>
                                </View>

                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>MSSV: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>
                                        {contactDetails.student.student_id}
                                    </Text>
                                </View>

                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Trường: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>
                                        {contactDetails.student.university}
                                    </Text>
                                </View>

                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Khoa: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>
                                        {contactDetails.student.faculty}
                                    </Text>
                                </View>

                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Ngành: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>
                                        {contactDetails.student.major}
                                    </Text>
                                </View>

                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Khóa học: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>
                                        {contactDetails.student.academic_year}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={RentalContactStyle.InfoContainer}>
                            <View style={RentalContactStyle.InfoHeader}>
                                <Icon source="star-four-points" color={Theme.PrimaryColor} size={20} />
                                <Text style={RentalContactStyle.InfoPersonTitle}>Thông tin phòng</Text>
                            </View>
                            <View style={RentalContactStyle.InfoRowContainer}>
                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Mã phòng: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.room.id}</Text>
                                </View>
                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Tên phòng: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.room.name}</Text>
                                </View>
                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Loại phòng: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.room.type === "NORAML" ? typeRoom.NORMAL : typeRoom.SERVICE}</Text>
                                </View>
                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Phòng cho: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.room.room_for === "M" ? gender.M : gender.F}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={RentalContactStyle.InfoContainer}>
                            <View style={RentalContactStyle.InfoHeader}>
                                <Icon source="star-four-points" color={Theme.PrimaryColor} size={20} />
                                <Text style={RentalContactStyle.InfoPersonTitle}>Thông tin giường</Text>
                            </View>
                            <View style={RentalContactStyle.InfoRowContainer}>
                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Mã giường: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.bed.id}</Text>
                                </View>
                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Tên giường: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.bed.name}</Text>
                                </View>
                                <View style={RentalContactStyle.InfoRow}>
                                    <Text style={RentalContactStyle.InfoRowTitle}>Giá: </Text>
                                    <Text style={RentalContactStyle.InfoRowValue}>{formatCurrency(contactDetails.bed.price)} VNĐ</Text>
                                </View>
                            </View>
                        </View>

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
                            <TouchableOpacity style={StaticStyle.BottomSheetButton}>
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