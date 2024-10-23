import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Icon } from 'react-native-paper';
import RentalContactStyle from '../../Screens/RentalContact/RentalContactStyle';
import Theme from '../../Styles/Theme';
import { formatDate, formatCurrency } from '../../Utils/Utilities';

const RentalContactCardDetail = ({ contactDetails, currentAccount, gender, statusRentalContact, typeRoom }) => {
    return (
        <View>
            <View style={RentalContactStyle.InfoContainer}>
                <View style={RentalContactStyle.InfoHeader}>
                    <Icon source="star-four-points" color={Theme.PrimaryColor} size={20} />
                    <Text style={RentalContactStyle.InfoPersonTitle}>Thông tin hồ sơ</Text>
                </View>
                <View style={RentalContactStyle.InfoRowContainer}>
                    <View style={RentalContactStyle.InfoRowRentalNumber}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Mã hồ sơ: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.rental_number}</Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Thời gian thuê: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.time_rental} tháng</Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Trạng thái hồ sơ: </Text>
                        <Text style={RentalContactStyle.InfoRowStatus}>
                            {statusRentalContact[contactDetails.status]}
                        </Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Ngày tạo: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>{formatDate(contactDetails.created_date)}</Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Ngày cập nhập: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>{formatDate(contactDetails.updated_date)}</Text>
                    </View>
                </View>
            </View>

            <View style={RentalContactStyle.InfoContainer}>
                <View style={RentalContactStyle.InfoHeader}>
                    <Icon source="star-four-points" color={Theme.PrimaryColor} size={20} />
                    <Text style={RentalContactStyle.InfoPersonTitle}>Thông tin người thuê</Text>
                </View>
                <View style={RentalContactStyle.InfoRowContainer}>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Họ và tên: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>{currentAccount.data.full_name}</Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Ngày sinh: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>{formatDate(currentAccount.data.dob)}</Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Giới tính: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>
                            {currentAccount.data.gender === "M" ? gender.M : gender.F}
                        </Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>CCCD: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>
                            {currentAccount.data.identification}
                        </Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>MSSV: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>
                            {contactDetails.student.student_id}
                        </Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Trường: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>
                            {contactDetails.student.university}
                        </Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Khoa: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>
                            {contactDetails.student.faculty}
                        </Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Ngành: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>
                            {contactDetails.student.major}
                        </Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Khóa học: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>
                            {contactDetails.student.academic_year}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={RentalContactStyle.InfoContainer}>
                <View style={RentalContactStyle.InfoHeader}>
                    <Icon source="star-four-points" color={Theme.PrimaryColor} size={20} />
                    <Text style={RentalContactStyle.InfoPersonTitle}>Thông tin phòng</Text>
                </View>
                <View style={RentalContactStyle.InfoRowContainer}>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Mã phòng: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.room.id}</Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Tên phòng: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.room.name}</Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Loại phòng: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.room.type === "NORMAL" ? typeRoom.NORMAL : typeRoom.SERVICE}</Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Phòng cho: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.room.room_for === "M" ? gender.M : gender.F}</Text>
                    </View>
                </View>
            </View>

            <View style={RentalContactStyle.InfoContainer}>
                <View style={RentalContactStyle.InfoHeader}>
                    <Icon source="star-four-points" color={Theme.PrimaryColor} size={20} />
                    <Text style={RentalContactStyle.InfoPersonTitle}>Thông tin giường</Text>
                </View>
                <View style={RentalContactStyle.InfoRowContainer}>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Mã giường: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.bed.id}</Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Tên giường: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>{contactDetails.bed.name}</Text>
                    </View>
                    <View style={RentalContactStyle.InfoRow}>
                        <Text style={RentalContactStyle.InfoRowTitle}>Giá: </Text>
                        <Text style={RentalContactStyle.InfoRowValue}>{formatCurrency(contactDetails.bed.price)} VNĐ</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default RentalContactCardDetail;
