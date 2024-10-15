import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import Theme from '../../../Styles/Theme';
import BedCardList from '../../Common/BedCardList';
import Loading from '../../Common/Loading';

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
            <View style={BedsListViewStyle.LoadingContainer}>
                <Loading/>
            </View>
        );
    }

    if (!filteredBeds || filteredBeds.length === 0) {
        return (
            <View style={BedsListViewStyle.EmptyContainer}>
                <Image
                    source={require('../../../Assets/Images/Images/No-Bed.png')}
                    style={BedsListViewStyle.NoBedsImage}
                />
                <Text style={BedsListViewStyle.NoBedsText}>
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

const BedsListViewStyle = StyleSheet.create({
    EmptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingBottom: 100,
    },
    NoBedsImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    NoBedsText: {
        fontFamily: Theme.Bold,
        color: Theme.PrimaryColor,
        fontSize: 16,
    },
    LoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BedsListView;