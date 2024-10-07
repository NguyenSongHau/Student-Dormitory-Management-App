import { AntDesign, Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { defaultImage } from '../../Configs/Constants';
import Theme from '../../Styles/Theme';

const BedCard = ({ instance, index, ...props }) => {
    return (
        <View style={{ ...props?.style }}>
            <ImageBackground
                source={{ uri: instance?.image && instance.image !== "" ? instance.image : defaultImage.DEFAULT_BED }}
                style={{ ...CarddActivityStyle.Background, marginTop: index === 0 ? 0 : 12 }}
            />

            <View style={CarddActivityStyle.CardContainer}>
                <View style={{ ...CarddActivityStyle.CardRow, marginTop: 0 }}>
                    <Text style={CarddActivityStyle.CardTitle}>{instance.name}</Text>
                </View>
            </View>
        </View>
    )
}

const CarddActivityStyle = StyleSheet.create({
    Background: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    ReportButton: {
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6ac239',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    CardContainer: {
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    CardTitle: {
        flex: 1,
        fontSize: 20,
        color: 'white',
        flexWrap: 'wrap',
        fontFamily: Theme.Bold,
    },
    CardRow: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    CardText: {
        fontSize: 16,
        marginLeft: 8,
        fontStyle: 'italic',
        color: 'white',
        fontFamily: Theme.SemiBold,
    },
    CardAvatar: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: Theme.SecondaryColor,
    },
    CardWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default BedCard;