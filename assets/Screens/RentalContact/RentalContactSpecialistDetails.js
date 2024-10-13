import { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from "react-native";
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

const RentalContactSpecialistDetails = ({ navigation, route }) => {
    const currentAccount = useAccount();
    const { rentalContactID } = route?.params;
    const [contactDetails, setContactDetails] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <ActivityIndicator size="large" color={Theme.PrimaryColor} />;
    }

    if (!contactDetails) {
        return <Text>Không có hồ sơ</Text>;
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
                                >
                                    Duyệt hồ sơ
                                </Button>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default RentalContactSpecialistDetails;