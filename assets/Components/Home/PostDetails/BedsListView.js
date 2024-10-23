import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import Theme from '../../../Styles/Theme';
import BedCardList from '../../Common/BedCardList';
import Loading from '../../Common/Loading';
import StaticStyle from '../../../Styles/StaticStyle';

const BedsListView = ({ beds, navigation, room }) => {
    const [filteredBeds, setFilteredBeds] = useState(beds || []);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);

    const loadData = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFilteredBeds(beds || []);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [beds]);

    const handleRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        await loadData();
        setPage(1);
        setRefreshing(false);
    };

    if (loading) {
        return (
            <View style={StaticStyle.Container}>
                <Loading/>
            </View>
        );
    }

    if (!filteredBeds || filteredBeds.length === 0) {
        return (
            <View style={StaticStyle.EmptyContainer}>
                <Image
                    source={require('../../../Assets/Images/Images/No-Bed.png')}
                    style={StaticStyle.EmptyImage}
                />
                <Text style={StaticStyle.EmptyText}>
                    Phòng này hiện chưa có giường
                </Text>
            </View>
        );
    }

    const handleBedPress = (bedID) => {
        navigation.navigate('BedDetails', { bedID, roomID: room.id });
    };

    return (
        <BedCardList
            data={filteredBeds}
            navigation={navigation}
            loading={loading}
            refreshing={refreshing}
            setRefreshing={setRefreshing}
            page={page}
            setPage={setPage}
            onPress={handleBedPress}
            loadMore={true}
            handleRefresh={handleRefresh}
        />
    );
};

export default BedsListView;