import { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, RefreshControl, ActivityIndicator, Modal, TouchableOpacity } from "react-native";
import { formatDate, getTokens, loadMore, onRefresh } from "../../Utils/Utilities";
import { authAPI, endPoints } from "../../Configs/APIs";
import { statusCode } from "../../Configs/Constants";
import Theme from '../../Styles/Theme';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import StaticStyle from '../../Styles/StaticStyle';
import Loading from "../../Components/Common/Loading";
import RentalContactCard from "../../Components/RentalContact/RentalContactCard";
import { statusRentalContact } from "../../Configs/Constants";

const RentalContacts = ({ navigation }) => {
    const [rentalContacts, setRentalContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    const loadRentContacts = async (pageToLoad = page) => {
        if (pageToLoad < 1) return;

        setLoading(true);
        const { accessToken } = await getTokens();
        try {
            let response = await authAPI(accessToken).get(endPoints['rental-contact-student'], {
                params: { page: pageToLoad }
            });
            if (response.status === statusCode.HTTP_200_OK) {
                const newContacts = response.data.results;
                if (pageToLoad === 1) {
                    setRentalContacts(newContacts);
                    setFilteredContacts(newContacts);
                } else {
                    setRentalContacts((prevRentalContacts) => [...prevRentalContacts, ...newContacts]);
                    setFilteredContacts((prevFilteredContacts) => [...prevFilteredContacts, ...newContacts]);
                }
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
                button: "Đóng"
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadRentContacts();
    }, [page]);

    useEffect(() => {
        if (selectedStatus === 'ALL') {
            setFilteredContacts(rentalContacts);
        } else {
            const filtered = rentalContacts.filter(contact => contact.status === selectedStatus);
            setFilteredContacts(filtered);
        }
    }, [selectedStatus, rentalContacts]);

    const handleOnScroll = ({ nativeEvent }) => {
        loadMore(nativeEvent, loading, page, setPage);
    };

    const handleRefresh = () => {
        onRefresh({
            setPage,
            setRefreshing,
            setData: setRentalContacts
        });
        loadRentContacts(1);
    };

    const renderRefreshControl = () => (
        <RefreshControl
            colors={[Theme.PrimaryColor]}
            refreshing={refreshing}
            onRefresh={handleRefresh}
        />
    );

    const toggleFilterModal = () => {
        setFilterModalVisible(!filterModalVisible);
    };

    const handleSelectStatus = (status) => {
        setSelectedStatus(status);
        if (status === 'ALL') {
            setFilteredContacts(rentalContacts);
        } else {
            const filtered = rentalContacts.filter(contact => contact.status === status);
            setFilteredContacts(filtered);
        }
        toggleFilterModal();
    };

    const goToRentalContactDetails = (rentalContactID) => {
        navigation.navigate('RentalContactStack', {
            screen: 'RentalContactDetails',
            params: { rentalContactID }
        });
    };

    return (
        <View style={[RentContactStyle.Container, StaticStyle.BackGround]}>
            <Text style={RentContactStyle.Title}>Danh sách hồ sơ</Text>
            <TouchableOpacity style={RentContactStyle.FilterButton} onPress={toggleFilterModal}>
                <Text style={RentContactStyle.FilterButtonText}>
                    {selectedStatus === 'ALL' ? 'Lọc trạng thái: Tất cả' : `Lọc trạng thái: ${statusRentalContact[selectedStatus]}`}
                </Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={toggleFilterModal}
            >
                <View style={RentContactStyle.ModalOverlay}>
                    <View style={RentContactStyle.ModalContent}>
                        <Text style={RentContactStyle.ModalTitle}>Chọn trạng thái</Text>
                        <TouchableOpacity onPress={() => handleSelectStatus('ALL')}>
                            <Text style={[RentContactStyle.ModalText, selectedStatus === 'ALL' && { color: Theme.PrimaryColor, fontWeight: 'bold' }]}>
                                Tất cả
                            </Text>
                        </TouchableOpacity>
                        {Object.keys(statusRentalContact).map((key) => (
                            <TouchableOpacity key={key} onPress={() => handleSelectStatus(key)}>
                                <Text style={[RentContactStyle.ModalText, selectedStatus === key && { color: Theme.PrimaryColor, fontWeight: 'bold' }]}>
                                    {statusRentalContact[key]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={toggleFilterModal}>
                            <Text style={RentContactStyle.CloseText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onScroll={handleOnScroll}
                refreshControl={renderRefreshControl()}
                scrollEventThrottle={16}
            >
                {!refreshing && loading && page === 1 && <Loading style={{ marginBottom: 16 }} />}
                {filteredContacts.map((contact) => (
                    <RentalContactCard
                        key={contact.id}
                        contact={contact}
                        onPress={() => goToRentalContactDetails(contact.id)}
                    />
                ))}
                {loading && page > 1 && <ActivityIndicator size="large" color={Theme.PrimaryColor} style={{ marginBottom: 16 }} />}
            </ScrollView>
        </View>
    );
};

const RentContactStyle = StyleSheet.create({
    Container: {
        padding: 16,
    },
    Title: {
        fontFamily: Theme.Bold,
        fontSize: 28,
        textAlign: 'center',
        paddingVertical: 20,
        color: Theme.PrimaryColor,
    },
    FilterButton: {
        backgroundColor: Theme.PrimaryColor,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    FilterButtonText: {
        color: Theme.WhiteColor,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: Theme.Bold
    },
    ModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    ModalContent: {
        width: 250,
        padding: 20,
        backgroundColor: Theme.WhiteColor,
        borderRadius: 10,
        alignItems: "center",
    },
    ModalTitle: {
        fontFamily: Theme.Bold,
        fontSize: 20,
        marginBottom: 10,
        color: Theme.PrimaryColor,
    },
    ModalText: {
        fontSize: 18,
        marginVertical: 8,
        fontFamily: Theme.Medium,
        color: Theme.BlackColor,
    },
    CloseText: {
        fontSize: 20,
        color: Theme.PrimaryColor,
        marginTop: 20,
        fontFamily: Theme.Bold,
    },
});

export default RentalContacts;