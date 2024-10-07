import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { defaultImage } from '../../Configs/Constants';
import Theme from '../../Styles/Theme';
import { statusBed } from '../../Configs/Constants';
import { screenHeight, screenWidth } from '../../Styles/StaticStyle';
import RenderHTML from 'react-native-render-html';
import { formatCurrency } from '../../Utils/Utilities';

const BedCard = ({ instance, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={CardStyle.Card}>
                <View style={CardStyle.CardImage}>
                    <Image
                        style={CardStyle.Image}
                        source={{ uri: instance.image ? instance.image : defaultImage.DEFAULT_BED }}
                    />
                </View>
                <Text style={CardStyle.CardTitle}>{instance.name}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={CardStyle.DescriptionLabel}>Mô tả:</Text>
                    <RenderHTML
                        contentWidth={screenWidth}
                        source={{ html: instance.description }}
                        baseStyle={CardStyle.CardDescription}
                        defaultTextProps={{ numberOfLines: 2, ellipsizeMode: 'tail' }}
                    />
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                    <Text style={CardStyle.DescriptionLabel}>Giá:</Text>
                    <Text style={CardStyle.Price}>{formatCurrency(instance.price)} VNĐ</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                    <Text style={CardStyle.DescriptionLabel}>Trạng thái:</Text>
                    <Text style={CardStyle.Status}>
                        {instance.status === "VACUITY" ? statusBed.VACUITY : typeBed.NONVACUITY}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

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
        fontSize: 20,
        marginVertical: 12,
        fontFamily: Theme.Bold,
    },
    DescriptionLabel: {
        fontFamily: Theme.Bold,
        fontSize: 18,
        marginRight: 5
    },
    CardDescription: {
        width: '100%',
        fontSize: 18,
        fontFamily: Theme.Italic,
    },
    Status: {
        fontSize: 18,
        color: Theme.PrimaryColor,
        fontFamily: Theme.SemiBold
    },
    Price:{
        fontSize: 18,
        color: Theme.PrimaryColor,
        fontFamily: Theme.SemiBold
    }
});

export default BedCard;