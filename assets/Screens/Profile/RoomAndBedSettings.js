import { RefreshControl, StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { Button, Icon } from "react-native-paper";
import Theme from '../../Styles/Theme';
import { useEffect, useState } from "react";
import APIs, { endPoints } from "../../Configs/APIs";
import { statusCode } from "../../Configs/Constants";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { loadMore, search } from "../../Utils/Utilities";
import Loading from "../../Components/Common/Loading";
import RoomCard from "../../Components/RoomAndBed/RoomCard";
import StaticStyle from "../../Styles/StaticStyle";
import Searchbar from "../../Components/Common/SearchBar";

const RoomAndBedSettings = () => {
    const [rooms, setRooms] = useState([]);
    const [name, setName] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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
    };

    const renderRefreshControl = () => (
        <RefreshControl
            colors={[Theme.PrimaryColor]}
            refreshing={refreshing}
            onRefresh={handleRefresh}
        />
    );

    return (
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

                <TouchableOpacity style={RoomAndBedSettingStyle.Button}>
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
                {rooms.map((bed, index) => (
                    <RoomCard key={index} bed={bed} />
                ))}
                {loading && page > 1 && <ActivityIndicator size="large" color={Theme.PrimaryColor} style={{ marginBottom: 16 }} />}
            </ScrollView>
        </View>
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

export default RoomAndBedSettings;
