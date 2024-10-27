import React from 'react';
import { StyleSheet, Text, View, Image } from "react-native";
import Theme from '../../Styles/Theme';
import { formatDate } from "../../Utils/Utilities";
import { defaultImage, gender, typeRoom } from "../../Configs/Constants";

const RoomCard = ({ bed }) => {
    return (
        <View style={RoomCardStyle.Card}>
            <View style={RoomCardStyle.CardImage}>
                <Image
                    style={RoomCardStyle.Image}
                    source={{ uri: bed.image ? bed.image : defaultImage.DEFAULT_ROOM }}
                />
            </View>
            <Text style={RoomCardStyle.CardTitle}>{bed.name}</Text>
            <Text style={RoomCardStyle.CardDetail}>Loại phòng: {bed.type === "SERVICE" ? typeRoom.SERVICE : typeRoom.NORMAL}</Text>
            <Text style={RoomCardStyle.CardDetail}>Số giường: {bed.number_of_bed}</Text>
            <Text style={RoomCardStyle.CardDetail}>Phòng cho: {bed.room_for === "F" ? gender.F : gender.M}</Text>
            <Text style={RoomCardStyle.CardDate}>
                Ngày tạo: <Text>{formatDate(bed.created_date)}</Text>
            </Text>
            <Text style={RoomCardStyle.CardDate}>
                Cập nhật lần cuối: <Text>{formatDate(bed.updated_date)}</Text>
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
