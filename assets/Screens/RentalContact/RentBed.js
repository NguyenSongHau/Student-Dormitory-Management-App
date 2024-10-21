import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet, Text, View, Alert, Modal } from 'react-native';
import Theme from '../../Styles/Theme';
import StaticStyle, { screenWidth } from '../../Styles/StaticStyle';
import { useAccount } from '../../Store/Contexts/AccountContext';
import { Button, Icon, Checkbox } from 'react-native-paper';
import { gender, statusCode } from '../../Configs/Constants';
import { formatDate, getTokens } from '../../Utils/Utilities';
import { useEffect, useState } from 'react';
import { typeRoom } from '../../Configs/Constants';
import RentalContactStyle from './RentalContactStyle'
import APIs, { authAPI, endPoints } from '../../Configs/APIs';
import { ScrollView } from 'react-native';
import { formatCurrency } from '../../Utils/Utilities';
import { ALERT_TYPE, AlertNotificationRoot, Dialog } from 'react-native-alert-notification';
import Loading from '../../Components/Common/Loading';

const RentBed = ({ navigation, route }) => {
    const { roomID, bedID } = route.params;
    const [room, setRoom] = useState({});
    const [bed, setBed] = useState({});
    const [isSelected, setSelection] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const currentAccount = useAccount();

    useEffect(() => {
        const loadRoom = async () => {
            try {
                let response = await APIs.get(endPoints['room-detail'](roomID));
                if (response.status === statusCode.HTTP_200_OK) {
                    setRoom(response.data);
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

        const loadBed = async () => {
            try {
                let response = await APIs.get(endPoints['bed-detail'](bedID));
                if (response.status === statusCode.HTTP_200_OK) {
                    setBed(response.data);
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

        loadRoom();
        loadBed();
    }, []);

    const rentBed = async () => {
        try {
            const { accessToken } = await getTokens();
            let response = await authAPI(accessToken).post(endPoints['rent-bed'](bedID));

            if (response.status === statusCode.HTTP_201_CREATED) {
                console.log(response.status);
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Thành công",
                    textBody: "Tạo hồ sơ thành công",
                    button: "Đóng",
                });
                setTimeout(() => {
                    navigation.goBack();
                }, 2000);
            }
        } catch (error) {
            console.log(error);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Lỗi",
                textBody: error.response.data.message,
                button: "Đóng"
            });
        }
    };


    const showAlert = () => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn tạo hồ sơ thuê?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Đồng ý",
                    onPress: rentBed
                }
            ]
        );
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const toggleTerms = () => {
        if (isSelected) {
            setShowModal(false);
        } else {
            setShowModal(true);
        }
    };

    if (loading) {
        return (
            <Loading />
        );
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
                <Text style={RentalContactStyle.Title}>Hồ sơ thuê</Text>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >

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
                                    {currentAccount.data.user_instance.student_id}
                                </Text>
                            </View>

                            <View style={RentalContactStyle.InfoRow}>
                                <Text style={RentalContactStyle.InfoRowTitle}>Trường: </Text>
                                <Text style={RentalContactStyle.InfoRowValue}>
                                    {currentAccount.data.user_instance.university}
                                </Text>
                            </View>

                            <View style={RentalContactStyle.InfoRow}>
                                <Text style={RentalContactStyle.InfoRowTitle}>Khoa: </Text>
                                <Text style={RentalContactStyle.InfoRowValue}>
                                    {currentAccount.data.user_instance.faculty}
                                </Text>
                            </View>

                            <View style={RentalContactStyle.InfoRow}>
                                <Text style={RentalContactStyle.InfoRowTitle}>Ngành: </Text>
                                <Text style={RentalContactStyle.InfoRowValue}>
                                    {currentAccount.data.user_instance.major}
                                </Text>
                            </View>

                            <View style={RentalContactStyle.InfoRow}>
                                <Text style={RentalContactStyle.InfoRowTitle}>Khóa học: </Text>
                                <Text style={RentalContactStyle.InfoRowValue}>
                                    {currentAccount.data.user_instance.academic_year}
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
                                <Text style={RentalContactStyle.InfoRowValue}>{room.id}</Text>
                            </View>

                            <View style={RentalContactStyle.InfoRow}>
                                <Text style={RentalContactStyle.InfoRowTitle}>Tên phòng: </Text>
                                <Text style={RentalContactStyle.InfoRowValue}>{room.name}</Text>
                            </View>

                            <View style={RentalContactStyle.InfoRow}>
                                <Text style={RentalContactStyle.InfoRowTitle}>Loại phòng: </Text>
                                <Text style={RentalContactStyle.InfoRowValue}>
                                    {room.type === "NORMAL" ? typeRoom.NORMAL : typeRoom.SERVICE}
                                </Text>
                            </View>

                            <View style={RentalContactStyle.InfoRow}>
                                <Text style={RentalContactStyle.InfoRowTitle}>Phòng cho: </Text>
                                <Text style={RentalContactStyle.InfoRowValue}>
                                    {room.room_for === "F" ? gender.F : gender.M}
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
                                <Text style={RentalContactStyle.InfoRowValue}>{bed.id}</Text>
                            </View>

                            <View style={RentalContactStyle.InfoRow}>
                                <Text style={RentalContactStyle.InfoRowTitle}>Tên giường: </Text>
                                <Text style={RentalContactStyle.InfoRowValue}>{bed.name}</Text>
                            </View>

                            <View style={RentalContactStyle.InfoRow}>
                                <Text style={RentalContactStyle.InfoRowTitle}>Giá tiền: </Text>
                                <Text style={RentalContactStyle.InfoRowValue}>
                                    {formatCurrency(bed.price)} VNĐ
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={RentalContactStyle.AcceptRulesContainer}>
                        <Checkbox
                            status={isSelected ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setSelection(!isSelected);
                                toggleTerms();
                            }}
                        />
                        <Text style={RentalContactStyle.AcceptRulesText}>Chấp nhận nội quy ký túc xá</Text>
                    </View>

                    <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                        <Button
                            mode="contained"
                            style={[
                                StaticStyle.Button,
                                { backgroundColor: isSelected ? Theme.PrimaryColor : '#cccccc' }
                            ]}
                            labelStyle={StaticStyle.ButtonText}
                            onPress={isSelected ? showAlert : null}
                        >
                            Tạo hồ sơ
                        </Button>

                    </View>
                </ScrollView>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={toggleModal}
            >
                <View style={RentalContactStyle.Modal}>
                    <View style={RentalContactStyle.ModalContainer}>
                        <Text style={RentalContactStyle.ModalTitle}>Nội quy ký túc xá</Text>
                        <Text style={RentalContactStyle.ModalDes}>1. Ký túc xá đóng cửa lúc 21g00</Text>
                        <Text style={RentalContactStyle.ModalDes}>2. Không hút thuốc lá</Text>
                        <Text style={RentalContactStyle.ModalDes}>3. Không nấu ăn dưới mọi hình thức</Text>
                        <Text style={RentalContactStyle.ModalDes}>4. Không gây gỗ đánh nhau</Text>
                        <Text style={RentalContactStyle.ModalDes}>5. Nam và nữ không được qua phòng nhau</Text>
                        <Text style={RentalContactStyle.ModalDes}>6. Không xả rác bừa bãi</Text>
                        <TouchableOpacity onPress={toggleModal} style={{ marginTop: 20 }}>
                            <Text style={RentalContactStyle.ButtonCloseModal}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default RentBed;