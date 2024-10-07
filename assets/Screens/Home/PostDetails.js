import { AntDesign } from '@expo/vector-icons';
import { ImageBackground, Keyboard, Text, TouchableOpacity, View, Animated, StyleSheet } from "react-native";
import StaticStyle, { screenHeight } from "../../Styles/StaticStyle";
import HomeStyle from './HomeStyle';
import { useEffect, useState } from 'react';
import { tabsContent } from '../../Utils/Fields';
import APIs, { endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { defaultImage } from '../../Configs/Constants';
import Theme from '../../Styles/Theme';
import PostSummary from '../../Components/Home/PostDetails/PostSummary';
import BedsListView from '../../Components/Home/PostDetails/BedsListView';

const PostDeTails = ({ navigation, route }) => {
    const { postID } = route?.params;
    const [post, setPost] = useState({});
    const [tab, setTab] = useState('overview');
    const [isRendered, setIsRendered] = useState(false);
    const [postLoading, setPostLoading] = useState(false);
    const animatedHeight = useState(new Animated.Value(screenHeight / 3))[0];

    useEffect(() => {
        const loadPostDetail = async () => {
            if (!postID) return;

            setPostLoading(true);

            try {
                let response = await APIs.get(endPoints['post-detail'](postID));
                if (response.status === statusCode.HTTP_200_OK) {
                    setPost(response.data);
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
                setPostLoading(false);
                setIsRendered(true);
            }
        };

        loadPostDetail();
    }, [postID]);

    const handleChangeTab = (name) => {
        setTab(name);

        const toValue = name !== 'overview' ? screenHeight / 6 : screenHeight / 3;

        Animated.timing(animatedHeight, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const tabContent = () => {
        if (isRendered) {
            switch (tab) {
                case 'overview':
                    return <PostSummary post={post} loading={postLoading} />;
                case 'rooms':
                    return <BedsListView beds={post.room.beds} navigation={navigation} />;
                default:
                    return null;
            }
        }
    };

    return (
        <View style={StaticStyle.BackGround} onTouchStart={() => Keyboard.dismiss()}>
            <Animated.View style={{ ...HomeStyle.Image, height: animatedHeight }}>
                <ImageBackground
                    source={{ uri: post.image ? post.image : defaultImage.DEFAULT_ROOM }}
                    style={{ flex: 1 }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={StaticStyle.BackButton}
                        onPress={() => navigation.goBack()}>
                        <AntDesign name="arrowleft" color={Theme.PrimaryColor} size={30} />
                    </TouchableOpacity>
                </ImageBackground>
            </Animated.View>

            <View style={HomeStyle.Body}>
                <View style={HomeStyle.Header}>
                    <Text style={HomeStyle.HeaderText}>{post.name}</Text>
                </View>

                <View style={HomeStyle.TabContainer}>
                    {tabsContent.post.map((f) => (
                        <TouchableOpacity
                            key={f.name}
                            style={HomeStyle.TabItem}
                            disabled={f.name === tab ? true : false}
                            onPress={() => handleChangeTab(f.name)}
                        >
                            <Text
                                style={{
                                    ...HomeStyle.TabText,
                                    color: f.name === tab ? Theme.PrimaryColor : 'black',
                                }}
                            >
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {tabContent()}
            </View>
        </View>
    );
}

export default PostDeTails;