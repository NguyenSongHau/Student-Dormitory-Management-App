import React from 'react';
import { StyleSheet, Text, View, Image } from "react-native";
import { formatDate, formatCurrency } from "../../Utils/Utilities";
import { defaultImage, statusBed } from "../../Configs/Constants";
import Theme from '../../Styles/Theme';

const BedCard = ({ bed }) => {
    return (
        <View style={BedCardStyle.Card}>
            <View style={BedCardStyle.CardImage}>
                <Image
                    style={BedCardStyle.Image}
                    source={{ uri: bed.image ? bed.image : defaultImage.DEFAULT_BED }}
                />
            </View>
            <Text style={BedCardStyle.CardTitle}>{bed.name}</Text>
            <Text style={BedCardStyle.CardDetail}>Giá: {formatCurrency(bed.price)} VNĐ</Text>
            <Text style={BedCardStyle.CardDetail}>Mô tả: {bed.description}</Text>
            <Text style={BedCardStyle.CardDetail}>Trạng thái: {statusBed[bed.status]}</Text>
            <Text style={BedCardStyle.CardDate}>
                Ngày tạo: <Text>{formatDate(bed.created_date)}</Text>
            </Text>
            <Text style={BedCardStyle.CardDate}>
                Cập nhật lần cuối: <Text>{formatDate(bed.updated_date)}</Text>
            </Text>
        </View>
    );
};

const BedCardStyle = StyleSheet.create({
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

export default BedCard;
