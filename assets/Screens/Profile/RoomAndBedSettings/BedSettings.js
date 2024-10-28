import React, { useEffect, useState, useRef } from "react";
import { RefreshControl, StyleSheet, View, ScrollView, ActivityIndicator, Text, TouchableOpacity, Image } from "react-native";
import { Icon } from "react-native-paper";
import Theme from '../../../Styles/Theme';
import APIs, { endPoints } from "../../../Configs/APIs";
import { statusCode } from "../../../Configs/Constants";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import Loading from "../../../Components/Common/Loading";
import BedCard from "../../../Components/RoomAndBed/BedCard"; // Adjust this import as needed
import StaticStyle from "../../../Styles/StaticStyle";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';

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
        console.log(beds);
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

    const gotoEditBed = () => {
        navigation.navigate('EditBed', { bed: selectedBed });
        bottomSheetRef.current?.close();
    };

    const handleDelete = async () => {
        // Your delete logic here (similar to handleDelete in RoomSettings)
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
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 205 }}>
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
                    snapPoints={['27%']}
                    enablePanDownToClose
                    onDismiss={() => setSelectedBed(null)}
                >
                    <BottomSheetView style={StaticStyle.BottomSheetView}>
                        <Text style={StaticStyle.BottomSheetTitle}>Lựa chọn</Text>
                        <TouchableOpacity style={StaticStyle.BottomSheetButton} onPress={gotoEditBed}>
                            <Text style={StaticStyle.BottomSheetButtonText}>Chỉnh sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={StaticStyle.BottomSheetButton} onPress={handleDelete}>
                            <Text style={StaticStyle.BottomSheetButtonText}>Xóa</Text>
                        </TouchableOpacity>
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
    );
};

const BedSettingsStyle = StyleSheet.create({
    Container: {
        padding: 16,
    },
});

export default BedSettings;