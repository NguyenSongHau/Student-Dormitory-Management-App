import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RenderHTML from "react-native-render-html";
import { defaultImage } from "../../Configs/Constants";
import { screenHeight, screenWidth } from "../../Styles/StaticStyle";
import { formatDate } from '../../Utils/Utilities';
import Theme from "../../Styles/Theme";

const CommonCard = ({ instance, ...props }) => {
    return (
        <TouchableOpacity onPress={props?.onPress ?? null}>
            <View style={CardStyle.Card}>
                <View style={CardStyle.CardImage}>
                    <Image
                        style={CardStyle.Image}
                        source={{ uri: instance?.image && instance.image !== "" ? instance.image : defaultImage.DEFAULT_ROOM }}
                    />
                </View>
                <Text style={CardStyle.CardTitle}>{instance.name}</Text>

                <RenderHTML
                    contentWidth={screenWidth}
                    source={{ html: instance.description }}
                    baseStyle={CardStyle.CardDescription}
                    defaultTextProps={{
                        numberOfLines: 2,
                        ellipsizeMode: 'tail',
                    }}
                />

                <Text style={CardStyle.CardDate}>
                    Ngày tạo: <Text>{formatDate(instance.created_date)}</Text>
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const CardStyle = StyleSheet.create({
    Card: {
        flexDirection: 'column',
        marginBottom: 20,
        borderWidth: 1,
        padding: 12,
        borderRadius: 16,
        borderColor: Theme.PrimaryColor,
    },
    CardImage: {
        justifyContent: 'center',
        width: '100%',
        height: screenHeight / 4,
    },
    Image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    CardTitle: {
        fontSize: 24,
        fontFamily: Theme.Bold,
        marginTop: 10,
        marginBottom: 5
    },
    CardDescription: {
        width: '100%',
        fontSize: 18,
        lineHeight: 30
    },
    CardType: {
        fontSize: 18,
        fontFamily: Theme.SemiBold,
        marginVertical: 8
    },
    CardDate: {
        fontSize: 17,
        fontFamily: Theme.SemiBold,
    },
});

export default CommonCard;