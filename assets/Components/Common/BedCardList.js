import { ScrollView } from 'react-native';
import BedCard from './BedCard';
import Loading from './Loading';

const BedCardList = ({ data, loading, onPress }) => {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            {loading && <Loading style={{ marginBottom: 16 }} />}
            {data.map((item, index) => (
                <BedCard
                    instance={item}
                    key={item.id}
                    index={index}
                    onPress={() => onPress(item.id)}
                />
            ))}
        </ScrollView>
    );
}

export default BedCardList;