import React, { useEffect, useState, useRef } from "react";
import { RefreshControl, StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity, Text, Alert } from "react-native"; // Nhập Alert từ react-native
import { Icon } from "react-native-paper";
import Theme from '../../../Styles/Theme';
import APIs, { authAPI, endPoints } from "../../../Configs/APIs";
import { statusCode } from "../../../Configs/Constants";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { getTokens, loadMore, search } from "../../../Utils/Utilities";
import Loading from "../../../Components/Common/Loading";
import RoomCard from "../../../Components/RoomAndBed/RoomCard";
import StaticStyle from "../../../Styles/StaticStyle";
import Searchbar from "../../../Components/Common/SearchBar";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';

const RoomSettings = ({ navigation }) => {
    const [rooms, setRooms] = useState([]);
    const [name, setName] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const bottomSheetRef = useRef(null);

    const loadRooms = async () => {
        if (page <= 0) return;
        setLoading(true);
        try {
            const params = { page, name };
            const response = await APIs.get(endPoints['rooms'], { params });

            if (response.status === statusCode.HTTP_200_OK) {
                setRooms((prevRooms) => page === 1 ? response.data.results : [...prevRooms, ...response.data.results]);
            } else {
                setRooms([]);
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
        loadRooms();
    }, [page, name]);

    const handleOnScroll = ({ nativeEvent }) => {
        loadMore(nativeEvent, loading, page, setPage);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(1);
        setRooms([]);
        loadRooms();
        setName("");
    };

    const renderRefreshControl = () => (
        <RefreshControl
            colors={[Theme.PrimaryColor]}
            refreshing={refreshing}
            onRefresh={handleRefresh}
        />
    );

    const goToCreateRoom = () => {
        navigation.navigate('CreateRoom', {
            screen: 'CreateRoom',
        });
    };

    const goToEditRoom = () => {
        navigation.navigate('EditRoom', { room: selectedRoom });
        bottomSheetRef.current?.close();
    };

    const goToBedSettings = (roomID) => {
        navigation.navigate('BedSettings', {
            roomID: roomID
        });
    };

    const openBottomSheet = (room) => {
        setSelectedRoom(room);
        bottomSheetRef.current?.present();
    };

    const handleDeleteRoom = async () => {
        Alert.alert(
            "Xác nhận xóa phòng",
            "Bạn có muốn xóa phòng này không?",
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
                            const response = await authAPI(accessToken).delete(endPoints['room-detail'](selectedRoom.id));

                            if (response.status === statusCode.HTTP_204_NO_CONTENT) {
                                setRooms((prevRooms) => prevRooms.filter((room) => room.id !== selectedRoom.id));
                                Dialog.show({
                                    type: ALERT_TYPE.SUCCESS,
                                    title: "Thành công",
                                    textBody: "Phòng đã được xóa thành công.",
                                    button: "Đóng",
                                });
                            }
                        } catch (error) {
                            console.error(error);
                            Dialog.show({
                                type: ALERT_TYPE.WARNING,
                                title: "Lỗi",
                                textBody: "Xóa phòng thất bại.",
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

    return (
        <BottomSheetModalProvider>
            <View style={[StaticStyle.BackGround, RoomAndBedSettingStyle.Container]}>
                <View style={RoomAndBedSettingStyle.SearchCreateContainer}>
                    <Searchbar
                        value={name}
                        placeholder="Tìm kiếm phòng"
                        onChangeText={(value) => {
                            search(value, setPage, setName);
                        }}
                        style={RoomAndBedSettingStyle.SearchBar}
                    />
                    <TouchableOpacity style={RoomAndBedSettingStyle.Button} onPress={goToCreateRoom}>
                        <Icon
                            source="plus-box"
                            color={Theme.SecondaryColor}
                            size={30}
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    refreshControl={renderRefreshControl()}
                    onScroll={handleOnScroll}
                    scrollEventThrottle={16}
                    style={StaticStyle.BackGround}
                >
                    {!refreshing && loading && page === 1 && <Loading style={{ marginBottom: 16 }} />}
                    {rooms.map((room, index) => (
                        <TouchableOpacity key={index} onLongPress={() => openBottomSheet(room)} onPress={() => goToBedSettings(room.id)}>
                            <RoomCard room={room} />
                        </TouchableOpacity>
                    ))}
                    {loading && page > 1 && <ActivityIndicator size="large" color={Theme.PrimaryColor} style={{ marginBottom: 16 }} />}
                </ScrollView>

                <BottomSheetModal
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={['27%']}
                    enablePanDownToClose
                    onDismiss={() => setSelectedRoom(null)}
                >
                    <BottomSheetView style={StaticStyle.BottomSheetView}>
                        <Text style={StaticStyle.BottomSheetTitle}>Lựa chọn</Text>
                        <TouchableOpacity style={StaticStyle.BottomSheetButton} onPress={goToEditRoom}>
                            <Text style={StaticStyle.BottomSheetButtonText}>Chỉnh sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={StaticStyle.BottomSheetButton} onPress={handleDeleteRoom}>
                            <Text style={StaticStyle.BottomSheetButtonText}>Xóa</Text>
                        </TouchableOpacity>
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
    );
};

const RoomAndBedSettingStyle = StyleSheet.create({
    Container: {
        padding: 16,
    },
    SearchCreateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },
    SearchBar: {
        flex: 10,
        marginRight: 8,
    },
    Button: {
        backgroundColor: Theme.PrimaryColor,
        width: 55,
        height: 55,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default RoomSettings;