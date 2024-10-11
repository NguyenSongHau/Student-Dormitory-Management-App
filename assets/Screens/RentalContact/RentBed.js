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
import { screenHeight } from '../../Styles/StaticStyle';
import APIs, { authAPI, endPoints } from '../../Configs/APIs';
import { ScrollView } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { formatCurrency } from '../../Utils/Utilities';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

const RentBed = ({ navigation, route }) => {
    const { roomID, bedID } = route.params;
    const [room, setRoom] = useState({});
    const [bed, setBed] = useState({});
    const [isSelected, setSelection] = useState(false);
    const [showModal, setShowModal] = useState(false);
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
            }
        } catch (error) {
            console.log(error);
            if(error.status === statusCode.HTTP_500_INTERNAL_SERVER_ERROR){
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Lỗi",
                    textBody: "Bạn đã đăng ký hồ sơ cho giường này rồi!",
                    button: "Đóng"
                });
            }else{
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Lỗi",
                    textBody: error.response.data.message,
                    button: "Đóng"
                });
            }
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

    return (
        <View style={[StaticStyle.BackGround, RentBedStyle.Container]}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={StaticStyle.BackButton}
                onPress={() => navigation.goBack()}
            >
                <AntDesign name="arrowleft" color={Theme.PrimaryColor} size={30} />
            </TouchableOpacity>

            <View style={RentBedStyle.Box}>
                <Text style={RentBedStyle.Title}>Hồ sơ thuê</Text>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >

                    <View style={RentBedStyle.InfoContainer}>
                        <View style={RentBedStyle.InfoHeader}>
                            <Icon source="star-four-points" color={Theme.PrimaryColor} size={20} />
                            <Text style={RentBedStyle.InfoPersonTitle}>Thông tin người thuê</Text>
                        </View>

                        <View style={RentBedStyle.InfoRowContainer}>
                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Họ và tên: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>{currentAccount.data.full_name}</Text>
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Ngày sinh: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>{formatDate(currentAccount.data.dob)}</Text>
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Giới tính: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>
                                    {currentAccount.data.gender === "M" ? gender.M : gender.F}
                                </Text>
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>CCCD: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>
                                    {currentAccount.data.identification}
                                </Text>
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>MSSV: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>
                                    {currentAccount.data.user_instance.student_id}
                                </Text>
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Trường: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>
                                    {currentAccount.data.user_instance.university}
                                </Text>
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Khoa: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>
                                    {currentAccount.data.user_instance.faculty}
                                </Text>
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Ngành: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>
                                    {currentAccount.data.user_instance.major}
                                </Text>
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Khóa học: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>
                                    {currentAccount.data.user_instance.academic_year}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={RentBedStyle.InfoContainer}>
                        <View style={RentBedStyle.InfoHeader}>
                            <Icon source="star-four-points" color={Theme.PrimaryColor} size={20} />
                            <Text style={RentBedStyle.InfoPersonTitle}>Thông tin phòng</Text>
                        </View>

                        <View style={RentBedStyle.InfoRowContainer}>
                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Mã phòng: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>{room.id}</Text>
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Tên phòng: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>{room.name}</Text>
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Loại phòng: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>
                                    {room.type === "NORMAL" ? typeRoom.NORMAL : typeRoom.SERVICE}
                                </Text>
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Phòng cho: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>
                                    {room.room_for === "F" ? gender.F : gender.M}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={RentBedStyle.InfoContainer}>
                        <View style={RentBedStyle.InfoHeader}>
                            <Icon source="star-four-points" color={Theme.PrimaryColor} size={20} />
                            <Text style={RentBedStyle.InfoPersonTitle}>Thông tin giường</Text>
                        </View>

                        <View style={RentBedStyle.InfoRowContainer}>
                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Mã giường: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>{bed.id}</Text>
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Tên giường: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>{bed.name}</Text>
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Loại phòng: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>
                                    {room.type === "NORMAL" ? typeRoom.NORMAL : typeRoom.SERVICE}
                                </Text>
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Mô tả phòng: </Text>
                                {bed.description ? (
                                    <RenderHTML
                                        contentWidth={screenWidth}
                                        source={{ html: bed.description }}
                                        baseStyle={RentBedStyle.InfoRowValue}
                                    />
                                ) : (
                                    <Text>Chưa có mô tả</Text>
                                )}
                            </View>

                            <View style={RentBedStyle.InfoRow}>
                                <Text style={RentBedStyle.InfoRowTitle}>Giá tiền: </Text>
                                <Text style={RentBedStyle.InfoRowValue}>
                                    {formatCurrency(bed.price)} VNĐ
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={RentBedStyle.AcceptRulesContainer}>
                        <Checkbox
                            status={isSelected ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setSelection(!isSelected);
                                toggleTerms();
                            }}
                        />
                        <Text style={RentBedStyle.AcceptRulesText}>Chấp nhận nội quy ký túc xá</Text>
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
                <View style={RentBedStyle.Modal}>
                    <View style={RentBedStyle.ModalContainer}>
                        <Text style={RentBedStyle.ModalTitle}>Nội quy ký túc xá</Text>
                        <Text style={RentBedStyle.ModalDes}>1. Ký túc xá đóng cửa lúc 21g00</Text>
                        <Text style={RentBedStyle.ModalDes}>2. Không hút thuốc lá</Text>
                        <Text style={RentBedStyle.ModalDes}>3. Không nấu ăn dưới mọi hình thức</Text>
                        <Text style={RentBedStyle.ModalDes}>4. Không gây gỗ đánh nhau</Text>
                        <Text style={RentBedStyle.ModalDes}>5. Nam và nữ không được qua phòng nhau</Text>
                        <Text style={RentBedStyle.ModalDes}>6. Không xả rác bừa bãi</Text>
                        <TouchableOpacity onPress={toggleModal} style={{ marginTop: 20 }}>
                            <Text style={RentBedStyle.ButtonCloseModal}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const RentBedStyle = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: Theme.PrimaryColor
    },
    Box: {
        paddingTop: 20,
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        height: screenHeight * 0.8,
        backgroundColor: Theme.WhiteColor,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    Title: {
        textAlign: 'center',
        fontFamily: Theme.Bold,
        fontSize: 24,
        color: Theme.PrimaryColor,
        marginBottom: 30
    },
    InfoContainer: {
        borderRadius: 10,
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 20,
    },
    InfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    InfoPersonTitle: {
        fontFamily: Theme.Bold,
        fontSize: 18,
        marginLeft: 8,
        color: Theme.PrimaryColor,
    },
    InfoRowContainer: {
        marginTop: 5,
    },
    InfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
        paddingBottom: 8,
    },
    InfoRowTitle: {
        fontFamily: Theme.Bold,
        marginRight: 5,
        color: '#333',
        fontSize: 16
    },
    InfoRowValue: {
        fontFamily: Theme.Regular,
        color: '#666',
        fontSize: 16
    },
    AcceptRulesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 9
    },
    AcceptRulesText: {
        fontFamily: Theme.Regular,
        fontSize: 16,
        color: '#333',
    },
    Modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    ModalContainer: {
        width: '80%', 
        backgroundColor: Theme.WhiteColor, 
        borderRadius: 10, 
        padding: 20 
    },
    ModalTitle: {
        fontFamily: Theme.Bold,
        fontSize: 20,
        marginBottom: 10
    },
    ModalDes: {
        fontFamily: Theme.Regular,
        marginBottom: 10,
        fontSize: 16,
        marginTop: 6
    },
    ButtonCloseModal: {
        color: Theme.PrimaryColor, 
        textAlign: 'center',
        fontSize: 18,
        fontFamily: Theme.Bold
    }
});

export default RentBed;