import { useEffect, useState } from 'react';
import CommonCardList from '../../Components/Common/CommonCardList';
import DismissKeyboard from '../../Components/Common/DismissKeyboard';
import APIs, { endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import StaticStyle from '../../Styles/StaticStyle';
import { search } from '../../Utils/Utilities';
import HomeStyle from './HomeStyle';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { Image, StyleSheet, Text, View } from 'react-native';
import Searchbar from '../../Components/Common/SearchBar';
import Filter from '../../Components/Common/Filter';
import Theme from '../../Styles/Theme';

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

    const handleSelectType = (selectedType) => {
        setType(selectedType);
        setPage(1);
    };

    return (
        <View style={StaticStyle.BackGround}>
            <DismissKeyboard>
                <View style={{ marginHorizontal: 12, marginTop: 32 }}>
                    <View style={HomeStyle.Header}>
                        <Text style={HomeStyle.HeaderTitle}>Bài viết</Text>
                    </View>

                    <View style={StaticStyle.SearchFilterContainer}>
                        <Searchbar
                            value={name}
                            placeholder="Tìm kiếm bản tin"
                            onChangeText={(value) => search(value, setPage, setName)}
                            style={StaticStyle.SearchBar}
                        />

                        <Filter
                            type={type}
                            onSelectType={handleSelectType}
                        />
                    </View>

                    {posts.length === 0 && !loading ? (
                        <View style={StaticStyle.EmptyContainer}>
                                <View style={PostStyle.CenterImage}>
                                    <Image
                                        source={require("../../Assets/Images/Images/No-Search.png")}
                                        style={StaticStyle.EmptyImage}
                                    />
                                </View>
                                <Text style={StaticStyle.EmptyText}>Kết quả tìm kiếm không phù hợp</Text>
                        </View>
                    ) : (
                        <CommonCardList
                            refreshing={refreshing}
                            loading={loading}
                            data={posts}
                            page={page}
                            loadMore={true}
                            onRefresh={true}
                            setPage={setPage}
                            setName={setName}
                            setFilter={setType}
                            setData={setPosts}
                            setRefreshing={setRefreshing}
                            onPress={(post) => goToPostDetails(post.id)}
                        />
                    )}
                </View>
            </DismissKeyboard>
        </View>
    )
}

const PostStyle = StyleSheet.create({

});

export default Posts;