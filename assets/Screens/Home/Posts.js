import { useEffect, useState } from 'react';
import CommonCardList from '../../Components/Common/CommonCardList';
import DismissKeyboard from '../../Components/Common/DismissKeyboard';
import APIs, { endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import StaticStyle from '../../Styles/StaticStyle';
import { search } from '../../Utils/Utilities';
import HomeStyle from './HomeStyle';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Searchbar from '../../Components/Common/SearchBar';
import Filter from '../../Components/Common/Filter';

const Posts = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [name, setName] = useState('');
    const [type, setType] = useState('ALL');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const loadPosts = async () => {
            if (page <= 0) return;

            setLoading(true);
            try {
                const params = { page, name };
                if (type !== 'ALL') {
                    params.type = type;
                }

                const response = await APIs.get(endPoints['post'], { params });
                if (response.status === statusCode.HTTP_200_OK) {
                    if (page === 1) {
                        setPosts(response.data.results);
                    } else {
                        setPosts((prevPosts) => [...prevPosts, ...response.data.results]);
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

        loadPosts();
    }, [page, name, type, refreshing]);

    const goToPostDetails = (postID) => {
        navigation.navigate('HomeStack', {
            screen: 'PostDeTails',
            params: { postID }
        });
    };

    return (
        <View style={StaticStyle.BackGround}>
            <DismissKeyboard>
                <View style={{ marginHorizontal: 12, marginTop: 32 }}>
                    <View style={HomeStyle.Header}>
                        <Text style={HomeStyle.HeaderTitle}>Bài viết</Text>
                    </View>

                    <View style={PostStyle.SearchFilterContainer}>
                        <Searchbar
                            value={name}
                            placeholder="Tìm kiếm bản tin"
                            onChangeText={(value) => search(value, setPage, setName)}
                            style={PostStyle.SearchBar}
                        />

                        <Filter
                            type={type}
                            onSelectType={(selectedType) => setType(selectedType)}
                        />
                    </View>

                    <CommonCardList
                        refreshing={refreshing}
                        loading={loading}
                        data={posts}
                        page={page}
                        loadMore={true}
                        onRefresh={true}
                        setPage={setPage}
                        setName={setName}
                        setRefreshing={setRefreshing}
                        onPress={(post) => goToPostDetails(post.id)}
                    />
                </View>
            </DismissKeyboard>
        </View>
    )
}

const PostStyle = StyleSheet.create({
    SearchFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },

    SearchBar: {
        flex: 10,
        marginRight: 8,
    },
});

export default Posts;