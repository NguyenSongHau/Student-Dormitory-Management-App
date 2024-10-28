import React from 'react';
import { StyleSheet, Text, View, Image } from "react-native";
import Theme from '../../Styles/Theme';
import { formatDate } from "../../Utils/Utilities";
import { defaultImage, gender, typeRoom } from "../../Configs/Constants";

const RoomCard = ({ room }) => {
    return (
        <View style={RoomCardStyle.Card}>
            <View style={RoomCardStyle.CardImage}>
                <Image
                    style={RoomCardStyle.Image}
                    source={{ uri: room.image ? room.image : defaultImage.DEFAULT_ROOM }}
                />
            </View>
            <Text style={RoomCardStyle.CardTitle}>{room.name}</Text>
            <Text style={RoomCardStyle.CardDetail}>Loại phòng: {room.type === "SERVICE" ? typeRoom.SERVICE : typeRoom.NORMAL}</Text>
            <Text style={RoomCardStyle.CardDetail}>Số giường: {room.number_of_room}</Text>
            <Text style={RoomCardStyle.CardDetail}>Phòng cho: {room.room_for === "F" ? gender.F : gender.M}</Text>
            <Text style={RoomCardStyle.CardDate}>
                Ngày tạo: <Text>{formatDate(room.created_date)}</Text>
            </Text>
            <Text style={RoomCardStyle.CardDate}>
                Cập nhật lần cuối: <Text>{formatDate(room.updated_date)}</Text>
            </Text>
        </View>
    );
};

const RoomCardStyle = StyleSheet.create({
    Card: {
        backgroundColor: Theme.WhiteColor,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        borderColor: Theme.PrimaryColor,
        borderWidth: 1,
    },
    CardImage: {
        marginBottom: 10,
        borderRadius: 8,
        overflow: "hidden",
    },
    Image: {
        width: "100%",
        height: 150,
        resizeMode: "cover",
    },
    CardTitle: {
        fontSize: 20,
        marginBottom: 5,
        fontFamily: Theme.Bold,
    },
    CardDetail: {
        fontSize: 16,
        marginBottom: 3,
        fontFamily: Theme.SemiBold,
    },
    CardDate: {
        fontSize: 14,
        marginTop: 5,
        fontFamily: Theme.Italic,
    },
});

export default RoomCard;
