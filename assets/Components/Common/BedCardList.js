import { ScrollView, RefreshControl } from 'react-native';
import BedCard from './BedCard';
import Loading from './Loading';
import Theme from '../../Styles/Theme';
import { loadMore} from '../../Utils/Utilities';

const BedCardList = ({ data, loading, refreshing, setRefreshing, page, setPage, setData, ...props }) => {
    const handleOnScroll = ({ nativeEvent }) => {
        if (props?.loadMore) {
            loadMore(nativeEvent, loading, page, setPage);
        }
    };

    const renderRefreshControl = () => (
        <RefreshControl
            colors={[Theme.PrimaryColor]}
            refreshing={refreshing}
            onRefresh={props.handleRefresh}
        />
    );

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onScroll={handleOnScroll}
            refreshControl={renderRefreshControl()}
        >
            {!refreshing && loading && page === 1 && <Loading style={{ marginBottom: 16 }} />}
            {data.map((item, index) => (
                <BedCard
                    instance={item}
                    key={item.id}
                    index={index}
                    onPress={() => props?.onPress?.(item.id)}
                />
            ))}
            {loading && page > 1 && <Loading style={{ marginBottom: 16 }} />}
        </ScrollView>
    );
};

export default BedCardList;