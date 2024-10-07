import { formatDate } from '../../../Utils/Utilities';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import HomeStyle from '../../../Screens/Home/HomeStyle';
import Theme from '../../../Styles/Theme';
import Loading from '../../Common/Loading';
import { screenWidth } from '../../../Styles/StaticStyle';

const PostSummary = ({ post, ...props }) => {
    if (props?.loading) return <Loading />;

    return (
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            <View style={{ ...props?.style }}>
                <View style={{ marginTop: 12 }}>
                    <Text style={{ fontFamily: Theme.Bold, fontSize: 20 }}>Mô tả phòng</Text>
                    <RenderHTML
                        contentWidth={screenWidth}
                        source={{ html: post.description }}
                        baseStyle={HomeStyle.DetailsDescription}
                    />
                </View>
                <View style={{ ...HomeStyle.DetailsWrap, marginTop: 12 }}>
                    <View style={{ ...HomeStyle.DetailsItem, width: '100%', flexDirection: 'column' }}>
                        <View style={HomeStyle.DetailsWrap}>
                            <View style={[HomeStyle.DetailsItem, { flexDirection: 'row', alignItems: 'center' }]}>
                                <View style={HomeStyle.DetailsIcon}>
                                    <AntDesign name="clockcircle" size={32} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[HomeStyle.DetailsText, { marginRight: 8 }]}>Ngày tạo:</Text>
                                    <Text style={HomeStyle.DetailsValue}>
                                        {formatDate(post.created_date)}
                                    </Text>
                                </View>
                            </View>

                        </View>

                        <View style={HomeStyle.DetailsWrap}>
                            <View style={[HomeStyle.DetailsItem, { flexDirection: 'row', alignItems: 'center' }]}>
                                <View style={HomeStyle.DetailsIcon}>
                                    <AntDesign name="clockcircle" size={32} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[HomeStyle.DetailsText, { marginRight: 8 }]}>Ngày cập nhập:</Text>
                                    <Text style={HomeStyle.DetailsValue}>
                                        {formatDate(post.updated_date)}
                                    </Text>
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default PostSummary;