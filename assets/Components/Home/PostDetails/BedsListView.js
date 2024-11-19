import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
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
                <Loading />
            </View>
        );
    }

    return (
        <View style={StaticStyle.Container}>
            {filteredBeds && filteredBeds.length === 0 ? (
                <View style={[StaticStyle.EmptyContainer, { marginTop: 84 }]}>
                    <Image
                        source={require('../../../Assets/Images/Images/No-Bed.png')}
                        style={StaticStyle.EmptyImage}
                    />
                    <Text style={StaticStyle.EmptyText}>
                        Phòng này hiện chưa có giường
                    </Text>
                </View>
            ) : (
                <BedCardList
                    data={filteredBeds}
                    navigation={navigation}
                    loading={loading}
                    refreshing={refreshing}
                    setRefreshing={setRefreshing}
                    page={page}
                    setPage={setPage}
                    onPress={(bedID) => navigation.navigate('BedDetails', { bedID, roomID: room.id })}
                    loadMore={true}
                    handleRefresh={handleRefresh}
                />
            )}
        </View>
    );
};

export default BedsListView;