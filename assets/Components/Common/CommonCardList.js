import { RefreshControl, ScrollView } from 'react-native';
import Theme from '../../Styles/Theme';
import { loadMore, onRefresh } from '../../Utils/Utilities';
import Loading from './Loading';
import CommonCard from './CommonCard';

const CommonCardList = ({ navigation, data, loading, refreshing, setRefreshing, page, setPage, ...props }) => {
    const handleOnScroll = ({ nativeEvent }) => {
        if (props?.loadMore) {
            loadMore(nativeEvent, loading, page, setPage);
        }

        if (props?.onScroll) {
            props?.onScroll(nativeEvent);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setPage(1);
            if (props?.setData) {
                props.setData([]);
            }
            if (props?.setFilter) {
                props.setFilter('ALL');
            }
            setRefreshing(false);
        }, 500);
    };

    const renderRefreshControl = () => (
        <RefreshControl
            colors={[Theme.PrimaryColor]}
            refreshing={refreshing}
            onRefresh={handleRefresh}
        />
    );

    return (
        <ScrollView
            style={{ marginBottom: 150 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onScroll={handleOnScroll}
            refreshControl={renderRefreshControl()}
        >
            {!refreshing && loading && page === 1 && <Loading style={{ marginBottom: 16 }} />}
            {data.map((item) => (
                <CommonCard key={item.id} instance={item} onPress={() => props?.onPress?.(item) ?? null} />
            ))}
            {loading && page > 1 && <Loading style={{ marginBottom: 16 }} />}
        </ScrollView>
    );
};

export default CommonCardList;