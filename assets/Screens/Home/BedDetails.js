import { AntDesign } from '@expo/vector-icons';
import { statusBed } from '../../Configs/Constants';
import { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { defaultImage } from '../../Configs/Constants';
import Loading from '../../Components/Common/Loading';
import StaticStyle, { screenWidth } from '../../Styles/StaticStyle';
import Theme from '../../Styles/Theme';
import APIs, { endPoints } from '../../Configs/APIs';
import { formatCurrency } from '../../Utils/Utilities';
import { formatDate } from '../../Utils/Utilities';
import { statusCode } from '../../Configs/Constants';
import { Button, Icon } from 'react-native-paper';
import HomeStyle from './HomeStyle';
import RenderHTML from 'react-native-render-html';

const BedDetails = ({ navigation, route }) => {
    const { bedID } = route?.params;
    const [bed, setBed] = useState({});
    const [isRendered, setIsRendered] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [bedLoading, setBedLoading] = useState(false);

    useEffect(() => {
        const loadBed = async () => {
            if (!bedID) return;
            setBedLoading(true);

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
                setBedLoading(false);
                setIsRendered(true);
            }
        };

        loadBed();
    }, []);

    if (bedLoading) return <Loading />;

    return (
        <View style={StaticStyle.BackGround}>
            <ImageBackground source={{ uri: bed.image ? bed.image : defaultImage.DEFAULT_BED }} style={BedDetailsStyle.Image}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={StaticStyle.BackButton}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name="arrowleft" color={Theme.PrimaryColor} size={30} />
                </TouchableOpacity>
            </ImageBackground>

            <View style={BedDetailsStyle.BedInfo}>
                <Text style={{ fontFamily: Theme.Bold, fontSize: 20, marginBottom: 20 }}>Thông tin chi tiết</Text>

                <View style={BedDetailsStyle.DescriptionRow}>
                    <Text style={BedDetailsStyle.DescriptionLabel}>Mô tả giường:</Text>
                    {bed.description ? (
                        <RenderHTML
                            contentWidth={screenWidth}
                            source={{ html: bed.description }}
                            baseStyle={HomeStyle.DetailsDescription}
                        />
                    ) : (
                        <Text>Chưa có mô tả</Text>
                    )}
                </View>

                <View style={BedDetailsStyle.BedInfoRow}>
                    <View style={BedDetailsStyle.BedInfoLeft}>
                        <View style={BedDetailsStyle.BedInfoItem}>
                            <View style={HomeStyle.DetailsIcon}>
                                <Icon source="identifier" size={32} color={Theme.PrimaryColor} />
                            </View>

                            <View style={BedDetailsStyle.BedInfoDes}>
                                <Text style={BedDetailsStyle.BedInfoTitle}>Mã giường </Text>
                                <Text style={BedDetailsStyle.BedValue}>{bed.id}</Text>
                            </View>
                        </View>

                        <View style={BedDetailsStyle.BedInfoItem}>
                            <View style={HomeStyle.DetailsIcon}>
                                <Icon source="list-status" size={32} color={Theme.PrimaryColor} />
                            </View>

                            <View style={BedDetailsStyle.BedInfoDes}>
                                <Text style={BedDetailsStyle.BedInfoTitle}>Trạng thái </Text>
                                <Text style={BedDetailsStyle.BedValue}>{bed.status === "VACUITY" ? statusBed.VACUITY : statusBed.NONVACUITY}</Text>
                            </View>
                        </View>

                        <View style={BedDetailsStyle.BedInfoItem}>
                            <View style={HomeStyle.DetailsIcon}>
                                <Icon source="clock-time-three" size={32} color={Theme.PrimaryColor} />
                            </View>

                            <View style={BedDetailsStyle.BedInfoDes}>
                                <Text style={BedDetailsStyle.BedInfoTitle}>Cập nhập </Text>
                                <Text style={BedDetailsStyle.BedValue}>{formatDate(bed.updated_date)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={BedDetailsStyle.BedInfoRight}>
                        <View style={BedDetailsStyle.BedInfoItem}>
                            <View style={HomeStyle.DetailsIcon}>
                                <Icon source="rename-box" size={32} color={Theme.PrimaryColor} />
                            </View>

                            <View style={BedDetailsStyle.BedInfoDes}>
                                <Text style={BedDetailsStyle.BedInfoTitle}>Tên giường </Text>
                                <Text style={BedDetailsStyle.BedValue}>{bed.name}</Text>
                            </View>
                        </View>

                        <View style={BedDetailsStyle.BedInfoItem}>
                            <View style={HomeStyle.DetailsIcon}>
                                <Icon source="clock-time-three" size={32} color={Theme.PrimaryColor} />
                            </View>

                            <View style={BedDetailsStyle.BedInfoDes}>
                                <Text style={BedDetailsStyle.BedInfoTitle}>Ngày tạo </Text>
                                <Text style={BedDetailsStyle.BedValue}>{formatDate(bed.created_date)}</Text>
                            </View>
                        </View>

                        <View style={BedDetailsStyle.BedInfoItem}>
                            <View style={HomeStyle.DetailsIcon}>
                                <Icon source="cash-100" size={32} color={Theme.PrimaryColor} />
                            </View>

                            <View style={BedDetailsStyle.BedInfoDes}>
                                <Text style={BedDetailsStyle.BedInfoTitle}>Giá </Text>
                                <Text style={BedDetailsStyle.BedValue}>{formatCurrency(bed.price)} VNĐ</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <Button
    mode="contained"
    style={BedDetailsStyle.CreateProfileButton}
    labelStyle={BedDetailsStyle.CreateProfileButtonText}  // Thêm style cho text
>
    Tạo hồ sơ
</Button>
            </View>
        </View>
    );
};

const BedDetailsStyle = StyleSheet.create({
    Image: {
        width: '100%',
        height: 200,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    BedInfo: {
        padding: 16,
    },
    DescriptionRow: {
        marginBottom: 20
    },
    DescriptionLabel: {
        fontFamily: Theme.Bold,
        fontSize: 18,
        marginBottom: 8
    },
    BedInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    BedInfoLeft: {
        flex: 1,
    },
    BedInfoRight: {
        flex: 1,
    },
    BedInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8
    },
    BedInfoDes: {
        marginLeft: 8,
    },
    BedInfoTitle: {
        fontFamily: Theme.SemiBold,
        fontSize: 16
    },
    BedValue: {
        fontSize: 16,
        fontFamily: Theme.SemiBold
    },
    BedPrice: {
        fontSize: 16,
        fontFamily: Theme.Bold,
        color: Theme.PrimaryColor
    },
    CreateProfileButton: {
        marginTop: 20,
        backgroundColor: Theme.PrimaryColor,
        paddingVertical: 10,
        borderRadius: 16,
    },
    CreateProfileButtonText: {
        fontSize: 16,
        fontFamily: Theme.Bold,
    }
});

export default BedDetails;