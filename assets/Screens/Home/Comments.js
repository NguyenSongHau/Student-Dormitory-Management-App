import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TextInput, TouchableOpacity } from "react-native";
import APIs, { authAPI, endPoints } from '../../Configs/APIs';
import { statusCode } from "../../Configs/Constants";
import Loading from '../../Components/Common/Loading';
import Theme from "../../Styles/Theme";
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { defaultImage } from "../../Configs/Constants";
import moment from 'moment';
import StaticStyle from "../../Styles/StaticStyle";
import { getTokens } from "../../Utils/Utilities";
import { BottomSheet, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { useAccount } from "../../Store/Contexts/AccountContext";
import { Icon } from "react-native-paper";
import 'moment/locale/vi';

moment.locale('vi');

const Comments = ({ postID }) => {
    const currentAccount = useAccount();
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const bottomSheetRef = useRef(null);
    const [selectedComment, setSelectedComment] = useState(null);

    useEffect(() => {
        const loadComments = async () => {
            if (!postID || page < 1) return;

            setLoading(true);

            try {
                let res = await APIs.get(endPoints['comments'](postID), { params: { page } });

                if (res.status === statusCode.HTTP_200_OK) {
                    if (page === 1) {
                        setComments(res.data.results);
                    } else {
                        setComments((prevComments) => [...prevComments, ...res.data.results]);
                    }
                }
                if (res.data.next === null) {
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
                setIsRendered(true);
            }
        };

        loadComments();
    }, [page]);

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: "Chưa nhập nội dung bình luận!",
                button: "Đóng",
            });
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('content', newComment);

            const { accessToken } = await getTokens();
            let res = await authAPI(accessToken).post(endPoints['comments'](postID), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === statusCode.HTTP_201_CREATED) {
                setComments([res.data, ...comments]);
                setNewComment('');
            }
        } catch (error) {
            console.error(error);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Lỗi",
                textBody: "Gửi bình luận thất bại, vui lòng thử lại sau!",
                button: "Đóng"
            });
        } finally {
            setSubmitting(false);
        }
    };

    const toggleOptions = (commentId, comment) => {
        setSelectedComment(comment);
        bottomSheetRef.current?.present();
    };

    if (!isRendered) return <Loading />;

    return (
        <BottomSheetModalProvider>
            <View style={[CommentStyle.Container, StaticStyle.BackGround]}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {comments.map((item) => (
                        <View key={item.id} style={CommentStyle.CommentCard}>
                            <View style={CommentStyle.CommentContent}>
                                <Image
                                    source={item.user.avatar ? { uri: item.user.avatar } : { uri: defaultImage.DEFAULT_AVATAR }}
                                    style={CommentStyle.Avatar}
                                />
                                <View style={CommentStyle.ContentContainer}>
                                    <Text style={CommentStyle.Username}>{item.user.full_name}</Text>
                                    <Text style={CommentStyle.Content}>{item.content}</Text>
                                    <Text style={CommentStyle.CreatedDate}>
                                        {moment(item.created_date, 'DD-MM-YYYY HH:mm:ss').fromNow()}
                                    </Text>
                                </View>
                                {item.user.id === currentAccount.data.id && (
                                    <TouchableOpacity
                                        style={CommentStyle.MoreIcon}
                                        onPress={() => toggleOptions(item.id, item)}
                                    >
                                        <Icon source="dots-horizontal" size={20} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                    {loading && <Loading style={CommentStyle.Loading} />}
                </ScrollView>

                <View style={CommentStyle.InputContainer}>
                    <TextInput
                        value={newComment}
                        onChangeText={setNewComment}
                        placeholder="Nhập bình luận..."
                        style={CommentStyle.TextInput}
                        multiline
                    />
                    <TouchableOpacity
                        style={[CommentStyle.SubmitButton, submitting && CommentStyle.SubmittingButton]}
                        onPress={handleCommentSubmit}
                        disabled={submitting}
                    >
                        <Text style={CommentStyle.SubmitButtonText}>Gửi</Text>
                    </TouchableOpacity>
                </View>

                <BottomSheetModal
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={['30%']}
                    enablePanDownToClose
                    onDismiss={() => setSelectedComment(null)}
                >
                    <BottomSheetView style={CommentStyle.BottomSheetView}>
                        <Text style={CommentStyle.BottomSheetTitle}>Options</Text>
                        <TouchableOpacity style={CommentStyle.BottomSheetButton} onPress={() => {/* Handle edit */ }}>
                            <Text style={CommentStyle.BottomSheetButtonText}>Chỉnh sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={CommentStyle.BottomSheetButton} onPress={() => {/* Handle delete */ }}>
                            <Text style={CommentStyle.BottomSheetButtonText}>Xóa</Text>
                        </TouchableOpacity>
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
    );
};

const CommentStyle = StyleSheet.create({
    Container: {
        flex: 1,
        padding: 4,
    },
    CommentCard: {
        padding: 10,
        marginBottom: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        position: 'relative',
    },
    CommentContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    Avatar: {
        width: 60,
        height: 60,
        borderRadius: 24,
        backgroundColor: Theme.SecondaryColor,
    },
    ContentContainer: {
        marginLeft: 12,
        flex: 1,
    },
    Username: {
        fontFamily: Theme.Bold,
        fontSize: 16,
    },
    Content: {
        fontFamily: Theme.Regular,
        fontSize: 14,
        marginVertical: 4,
    },
    CreatedDate: {
        fontFamily: Theme.Regular,
        fontSize: 12,
        color: 'grey',
        fontStyle: 'italic',
    },
    Loading: {
        marginVertical: 16,
    },
    InputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: Theme.WhiteColor,
    },
    TextInput: {
        flex: 1,
        fontFamily: Theme.Regular,
        fontSize: 14,
        color: '#333333',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
    },
    SubmitButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: Theme.PrimaryColor,
        borderRadius: 8,
    },
    SubmittingButton: {
        backgroundColor: '#ccc',
    },
    SubmitButtonText: {
        fontFamily: Theme.Bold,
        fontSize: 14,
        color: Theme.WhiteColor,
    },
    MoreIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    BottomSheetView: {
        padding: 16,
        backgroundColor: Theme.WhiteColor,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        elevation: 4,
    },
    BottomSheetTitle: {
        fontFamily: Theme.Bold,
        fontSize: 18,
        marginBottom: 12,
        textAlign: 'center',
    },
    BottomSheetButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: Theme.PrimaryColor,
        borderRadius: 8,
        marginVertical: 6,
        alignItems: 'center',
    },
    BottomSheetButtonText: {
        fontFamily: Theme.Bold,
        fontSize: 16,
        color: Theme.WhiteColor,
    }
});

export default Comments;