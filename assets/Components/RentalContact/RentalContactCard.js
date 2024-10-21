import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import Theme from '../../Styles/Theme';
import { formatDate } from '../../Utils/Utilities';
import { statusRentalContact } from '../../Configs/Constants';

const RentalContactCard = ({ contact, onPress }) => {
    return (
        <TouchableOpacity style={RentalContactCardStyle.Card} onPress={onPress}>
            <View style={RentalContactCardStyle.CardContent}>
                <View style={{ marginRight: 10 }}>
                    <Icon source="file-document-multiple-outline" size={30} color={Theme.PrimaryColor} />
                </View>
                <View style={RentalContactCardStyle.CardTextContainer}>
                    <Text style={RentalContactCardStyle.CardTitle}>Mã hồ sơ:</Text>
                    <Text style={RentalContactCardStyle.CardValue}>{contact.rental_number}</Text>
                </View>
            </View>
            <View style={RentalContactCardStyle.CardContent}>
                <View style={{ marginRight: 10 }}>
                    <Icon source="calendar-clock" size={30} color={Theme.PrimaryColor} />
                </View>
                <View style={RentalContactCardStyle.CardTextContainer}>
                    <Text style={RentalContactCardStyle.CardTitle}>Thời gian thuê:</Text>
                    <Text style={RentalContactCardStyle.CardValue}>{contact.time_rental} tháng</Text>
                </View>
            </View>
            <View style={RentalContactCardStyle.CardContent}>
                <View style={{ marginRight: 10 }}>
                    <Icon source="list-status" size={30} color={Theme.PrimaryColor} />
                </View>
                <View style={RentalContactCardStyle.CardTextContainer}>
                    <Text style={RentalContactCardStyle.CardTitle}>Trạng thái:</Text>
                    <Text style={RentalContactCardStyle.CardValueStatus}>{statusRentalContact[contact.status]}</Text>
                </View>
            </View>
            <View style={RentalContactCardStyle.CardContent}>
                <View style={{ marginRight: 10 }}>
                    <Icon source="clock-time-three" size={30} color={Theme.PrimaryColor} />
                </View>
                <View style={RentalContactCardStyle.CardTextContainer}>
                    <Text style={RentalContactCardStyle.CardTitle}>Ngày tạo:</Text>
                    <Text style={RentalContactCardStyle.CardValue}>{formatDate(contact.created_date)}</Text>
                </View>
            </View>
            <View style={RentalContactCardStyle.CardContent}>
                <View style={{ marginRight: 10 }}>
                    <Icon source="clock-time-three" size={30} color={Theme.PrimaryColor} />
                </View>
                <View style={RentalContactCardStyle.CardTextContainer}>
                    <Text style={RentalContactCardStyle.CardTitle}>Ngày cập nhật:</Text>
                    <Text style={RentalContactCardStyle.CardValue}>{formatDate(contact.updated_date)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const RentalContactCardStyle = StyleSheet.create({
    Card: {
        backgroundColor: Theme.WhiteColor,
        borderRadius: 8,
        padding: 10,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: Theme.PrimaryColor
    },
    CardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    CardTextContainer: {
        flex: 1,
    },
    CardTitle: {
        fontFamily: Theme.Bold,
        fontSize: 16,
        color: Theme.GrayColor,
    },
    CardValue: {
        fontFamily: Theme.Regular,
        fontSize: 16,
        color: Theme.BlackColor,
    },
    CardValueStatus: {
        fontFamily: Theme.Bold,
        fontSize: 16,
        color: Theme.PrimaryColor,
    }
});

export default RentalContactCard;
