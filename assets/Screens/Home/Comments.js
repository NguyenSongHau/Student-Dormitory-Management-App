import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TextInput, TouchableOpacity, Modal, Alert, RefreshControl } from "react-native";
import APIs, { authAPI, endPoints } from '../../Configs/APIs';
import { statusCode } from "../../Configs/Constants";
import Loading from '../../Components/Common/Loading';
import Theme from "../../Styles/Theme";
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { defaultImage } from "../../Configs/Constants";
import moment from 'moment';
import StaticStyle from "../../Styles/StaticStyle";
import { getTokens, loadMore, onRefresh } from "../../Utils/Utilities";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { useAccount } from "../../Store/Contexts/AccountContext";
import { ActivityIndicator, Icon } from "react-native-paper";
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
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');

    const loadComments = async () => {
        if (!postID || page < 1) return;

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
            setRefreshing(false);
            setIsRendered(true);
        }
    };

    useEffect(() => {
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

    const handleEdit = () => {
        setEditContent(selectedComment.content);
        setIsEditing(true);
    };

    const handleUpdateComment = async () => {
        if (!editContent.trim()) {
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
            formData.append('content', editContent);

            const { accessToken } = await getTokens();
            let res = await authAPI(accessToken).put(endPoints['comment-detail'](selectedComment.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === statusCode.HTTP_200_OK) {
                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment.id === selectedComment.id ? res.data : comment
                    )
                );
                setIsEditing(false);
                setEditContent('');
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Lỗi",
                    textBody: "Cập nhập bình luận thành công.",
                    button: "Đóng",
                });
                bottomSheetRef.current?.close();
            }
        } catch (error) {
            console.error(error);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Lỗi",
                textBody: "Cập nhật bình luận thất bại, vui lòng thử lại sau!",
                button: "Đóng"
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async () => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa bình luận này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                    onPress: () => {
                        bottomSheetRef.current?.close();
                    },
                },
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        const { accessToken } = await getTokens();
                        try {
                            let res = await authAPI(accessToken).delete(endPoints['comment-detail'](selectedComment.id));
                            if (res.status === statusCode.HTTP_204_NO_CONTENT) {
                                setComments(prevComments => prevComments.filter(comment => comment.id !== selectedComment.id));
                                Dialog.show({
                                    type: ALERT_TYPE.SUCCESS,
                                    title: "Thành công",
                                    textBody: "Xóa bình luận thành công.",
                                    button: "Đóng"
                                });
                                bottomSheetRef.current?.close();
                            }
                        } catch (error) {
                            console.error(error);
                            Dialog.show({
                                type: ALERT_TYPE.DANGER,
                                title: "Lỗi",
                                textBody: "Xóa bình luận thất bại, vui lòng thử lại sau!",
                                button: "Đóng"
                            });
                        } finally {
                            bottomSheetRef.current?.close();
                            setSelectedComment(null);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleOnScroll = ({ nativeEvent }) => {
        loadMore(nativeEvent, loading, page, setPage);
    }

    const handleRefresh = () => {
        onRefresh({
            setPage,
            setRefreshing,
            setData: setComments
        });

        loadComments(1);
    }

    const renderRefreshControl = () => (
        <RefreshControl
            colors={[Theme.PrimaryColor]}
            refreshing={refreshing}
            onRefresh={handleRefresh}
        />
    );

    if (refreshing) {
        return (
            <View style={CommentStyle.LoadingContanier}>
                <Loading />
            </View>
        );
    }

    if (!isRendered) return <Loading />;

    return (
        <BottomSheetModalProvider>
            <View style={[CommentStyle.Container, StaticStyle.BackGround]}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onScroll={handleOnScroll}
                    refreshControl={renderRefreshControl()}
                    scrollEventThrottle={16}
                >
                    {!refreshing && loading && page === 1 && <Loading style={{ marginBottom: 50 }} />}
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
                    {loading && page > 1 && <ActivityIndicator size="large" color={Theme.PrimaryColor} style={{ marginBottom: 16 }} />}
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
                    <BottomSheetView style={StaticStyle.BottomSheetView}>
                        <Text style={StaticStyle.BottomSheetTitle}>Lựa chọn</Text>
                        <TouchableOpacity style={StaticStyle.BottomSheetButton} onPress={handleEdit}>
                            <Text style={StaticStyle.BottomSheetButtonText}>Chỉnh sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={StaticStyle.BottomSheetButton} onPress={handleDeleteComment}>
                            <Text style={StaticStyle.BottomSheetButtonText}>Xóa</Text>
                        </TouchableOpacity>
                    </BottomSheetView>
                </BottomSheetModal>

                <Modal
                    visible={isEditing}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={CommentStyle.ModalContainer}>
                        <View style={CommentStyle.ModalContent}>
                            <Text style={CommentStyle.ModalTitle}>Chỉnh sửa bình luận</Text>
                            <TextInput
                                value={editContent}
                                onChangeText={setEditContent}
                                placeholder="Nhập nội dung mới..."
                                style={CommentStyle.ModalTextInput}
                                multiline
                            />
                            <TouchableOpacity style={CommentStyle.ModalButton} onPress={handleUpdateComment}>
                                <Text style={CommentStyle.ModalButtonText}>Cập nhật</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={CommentStyle.ModalButton} onPress={() => setIsEditing(false)}>
                                <Text style={CommentStyle.ModalButtonText}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
        fontSize: 16,
        marginVertical: 4,
    },
    CreatedDate: {
        fontFamily: Theme.Regular,
        fontSize: 14,
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
    ModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    ModalContent: {
        width: '86%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    ModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    ModalTextInput: {
        height: 60,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        fontSize: 18
    },
    ModalButton: {
        backgroundColor: Theme.PrimaryColor,
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
    },
    ModalButtonText: {
        color: Theme.WhiteColor,
        textAlign: 'center',
        fontFamily: Theme.Bold,
        fontSize: 17
    },
    LoadingContanier:{
          flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Comments;