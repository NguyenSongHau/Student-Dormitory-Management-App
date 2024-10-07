import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Theme from '../../../Styles/Theme';
import BedCardList from '../../Common/BedCardList';

const BedsListView = ({ beds, navigation }) => {
    const [filteredBeds, setFilteredBeds] = useState(beds || []);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setFilteredBeds(beds || []);
            setLoading(false);
        };

        loadData();
    }, [beds]);

    if (loading) {
        return (
            <View style={BedsListViewStyle.LoadingContainer}>
                <ActivityIndicator size="large" color={Theme.PrimaryColor} />
                <Text style={BedsListViewStyle.LoadingText}>Đang tải giường...</Text>
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
        navigation.navigate('BedDetails', { bedID });
    };

    return (
        <BedCardList 
            data={filteredBeds} 
            navigation={navigation}
            loading={loading}
            refreshing={refreshing}
            setRefreshing={setRefreshing}
            onPress={handleBedPress}
        />
    );
};

const BedsListViewStyle = StyleSheet.create({
    EmptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
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
    LoadingText: {
        fontFamily: Theme.Bold,
        color: Theme.PrimaryColor,
        fontSize: 16,
        marginTop: 10,
    },
});

export default BedsListView;