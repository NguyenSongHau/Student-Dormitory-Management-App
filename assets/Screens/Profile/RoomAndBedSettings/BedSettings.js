import React, { useEffect, useState, useRef } from "react";
import { RefreshControl, StyleSheet, View, ScrollView, ActivityIndicator, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Icon } from "react-native-paper";
import Theme from '../../../Styles/Theme';
import APIs, { authAPI, endPoints } from "../../../Configs/APIs";
import { statusCode } from "../../../Configs/Constants";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import Loading from "../../../Components/Common/Loading";
import BedCard from "../../../Components/RoomAndBed/BedCard";
import StaticStyle from "../../../Styles/StaticStyle";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { getTokens } from "../../../Utils/Utilities";

const BedSettings = ({ navigation, route }) => {
    const { roomID } = route.params;
    const [beds, setBeds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedBed, setSelectedBed] = useState(null);
    const bottomSheetRef = useRef(null);

    const loadBeds = async () => {
        if (page <= 0) return;
        setLoading(true);

        try {
            const response = await APIs.get(endPoints['room-detail'](roomID), { params: { page } });

            if (response.status === statusCode.HTTP_200_OK) {
                setBeds((prevBeds) => page === 1 ? response.data.beds : [...prevBeds, ...response.data.beds]);
            } else {
                setBeds([]);
            }

            if (response.data.next === null) {
                setPage(0);
            }
        } catch (error) {
            console.error(error);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Lỗi",
                textBody: "Hệ thống đang bận, vui lòng thử lại sau!",
                button: "Đóng",
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadBeds();
    }, [page]);

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(1);
        setBeds([]);
        loadBeds();
    };

    const renderRefreshControl = () => (
        <RefreshControl
            colors={[Theme.PrimaryColor]}
            refreshing={refreshing}
            onRefresh={handleRefresh}
        />
    );

    const openBottomSheet = (bed) => {
        setSelectedBed(bed);
        bottomSheetRef.current?.present();
    };

    const goToEditBed = () => {
        navigation.navigate('EditBed', { bed: selectedBed });
        bottomSheetRef.current?.close();
    };

    const handleDeleteBed = async () => {
        Alert.alert(
            "Xác nhận xóa giường",
            "Bạn có muốn xóa giường này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            const { accessToken } = await getTokens();
                            const response = await authAPI(accessToken).delete(endPoints['bed-detail'](selectedBed.id));
    
                            if (response.status === statusCode.HTTP_204_NO_CONTENT) {
                                setBeds((prevBeds) => prevBeds.filter((bed) => bed.id !== selectedBed.id));
                                Dialog.show({
                                    type: ALERT_TYPE.SUCCESS,
                                    title: "Thành công",
                                    textBody: "Giường đã được xóa thành công.",
                                    button: "Đóng",
                                });
                            }
                        } catch (error) {
                            console.error(error);
                            Dialog.show({
                                type: ALERT_TYPE.WARNING,
                                title: "Lỗi",
                                textBody: "Xóa giường thất bại.",
                                button: "Đóng",
                            });
                        }
    
                        bottomSheetRef.current?.close();
                    },
                },
            ],
            { cancelable: true }
        );
    };
    
    const goToCreateBed = () => {
        navigation.navigate('CreateBed', { roomID });
    };


    return (
        <BottomSheetModalProvider>
            <View style={[StaticStyle.BackGround, BedSettingsStyle.Container]}>
                <ScrollView
                    refreshControl={renderRefreshControl()}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={StaticStyle.BackGround}
                >
                    {!refreshing && loading && page === 1 && <Loading style={{ marginBottom: 16 }} />}
                    {beds.length === 0 && !loading && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 210 }}>
                            <Image
                                source={require('../../../Assets/Images/Images/No-Bed.png')}
                                style={{ width: 200, height: 200 }}
                            />
                            <Text style={{ textAlign: 'center', marginTop: 10, fontFamily: Theme.Bold, color: Theme.PrimaryColor }}>Phòng này hiện chưa có giường</Text>
                        </View>
                    )}
                    {beds.map((bed, index) => (
                        <TouchableOpacity key={index} onLongPress={() => openBottomSheet(bed)}>
                            <BedCard bed={bed} />
                        </TouchableOpacity>
                    ))}
                    {loading && page > 1 && <ActivityIndicator size="large" color={Theme.PrimaryColor} style={{ marginBottom: 16 }} />}
                </ScrollView>

                <BottomSheetModal
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={['28%']}
                    enablePanDownToClose
                    onDismiss={() => setSelectedBed(null)}
                >
                    <BottomSheetView style={StaticStyle.BottomSheetView}>
                        <Text style={StaticStyle.BottomSheetTitle}>Lựa chọn</Text>
                        <TouchableOpacity style={StaticStyle.BottomSheetButton} onPress={goToEditBed}>
                            <Text style={StaticStyle.BottomSheetButtonText}>Chỉnh sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={StaticStyle.BottomSheetButton} onPress={handleDeleteBed}>
                            <Text style={StaticStyle.BottomSheetButtonText}>Xóa</Text>
                        </TouchableOpacity>
                    </BottomSheetView>
                </BottomSheetModal>

                <TouchableOpacity
                    style={styles.AddButton}
                    onPress={goToCreateBed}
                >
                    <Icon source="plus-circle" size={30} color={Theme.WhiteColor} />
                </TouchableOpacity>
            </View>
        </BottomSheetModalProvider>
    );
};

const styles = StyleSheet.create({
    AddButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: Theme.PrimaryColor,
        borderRadius: 32,
        padding: 10,
        elevation: 5,
    },
});

const BedSettingsStyle = StyleSheet.create({
    Container: {
        padding: 16,
    },
});

export default BedSettings;