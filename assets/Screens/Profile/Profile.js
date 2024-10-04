import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from 'react-native-paper';
import Theme from "../../Styles/Theme";
import { useAccount, useAccountDispatch } from '../../Store/Contexts/AccountContext';
import StaticStyle, { screenHeight, screenWidth } from '../../Styles/StaticStyle';
import Loading from '../../Components/Common/Loading';
import { profileSections } from '../../Utils/Fields';
import { defaultImage } from '../../Configs/Constants';
import { auth } from '../../Configs/Firebase';
import SectionItem from '../../Components/Common/SectionItem';
import { ALERT_TYPE, AlertNotificationRoot, Dialog } from 'react-native-alert-notification';
import { signOut } from 'firebase/auth';
import { removeTokens } from '../../Utils/Utilities';
import { SignOutAction } from '../../Store/Actions/AccountAction';

const Profile = ({ navigation }) => {
    const dispatch = useAccountDispatch();
    const currentAccount = useAccount();
    const [isRendered, setIsRendered] = useState(false);
    
    useEffect(() => {
        setIsRendered(true);
    }, []);

    const handleSignout = () => {
        Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Đăng xuất",
            textBody: "Bạn chắc chắn muốn đăng xuất?",
            button: "Đồng ý",
            onPressButton: () => {
                signOut(auth)
                    .then(() => {
                        removeTokens();
                        dispatch(SignOutAction());
                    })
                    .catch((error) => {
                        console.error('Error logging out: ', error);
                        Dialog.show({
                            type: ALERT_TYPE.ERROR,
                            title: "Thông báo",
                            textBody: "Hệ thống đang bận, vui lòng thử lại sau!",
                            button: "Đồng ý",
                        });
                    });
            }
        });
    };

    const goToScreen = ({ screen, params, otherStack, otherTab }) => {
        if (otherStack) {
            navigation.navigate(otherStack, { screen, params });
        } else if (otherTab) {
            navigation.navigate(otherTab, params);
        } else {
            navigation.navigate('ProfileStack', { screen, params });
        }
    };

    if (!isRendered) return <Loading />;

    return (
        <AlertNotificationRoot>
            <LinearGradient
                style={{ flex: 1 }}
                end={{ x: 0.5, y: 0.5 }}
                colors={Theme.LinearColor1}
            >
                <ScrollView
                    bounces={false}
                    scrollEventThrottle={16}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: screenHeight * 0.1 }}
                >
                    <View style={[StaticStyle.Container, ProfileStyle.Header]}>
                        <Image
                            style={ProfileStyle.Avatar}
                            source={{ uri: currentAccount.data.avatar ? currentAccount.data.avatar : defaultImage.DEFAULT_AVATAR }}
                        />
                        <View style={[StaticStyle.Center, { marginTop: 20 }]}>
                            <Text style={ProfileStyle.FullName}>{currentAccount.data.full_name}</Text>
                            <Text style={ProfileStyle.IDAccount}> ID: {currentAccount.data.id}</Text>
                        </View>
                        <TouchableOpacity
                            style={[StaticStyle.Center, ProfileStyle.HeaderButton]}
                            onPress={() =>
                                goToScreen({ screen: 'EditProfile' })
                            }
                        >
                            <Text style={ProfileStyle.ButtonText}>Trang cá nhân</Text>
                            <Icon color="white" source="chevron-right" size={20} />
                        </TouchableOpacity>
                    </View>

                    {profileSections(currentAccount).map((section, index) => {
                        if (section.roles.includes(currentAccount.data.role)) {
                            return (
                                <View key={'section-' + index} style={ProfileStyle.Section}>
                                    <Text style={ProfileStyle.SectionTitle}>{section.title}</Text>
                                    <View style={ProfileStyle.SectionBody}>
                                        {section.items.map((item, itemIndex) => {
                                            if (item.roles) {
                                                if (item.roles.includes(currentAccount.data.role)) {
                                                    return (
                                                        <SectionItem key={'item-' + itemIndex} instance={item} onPress={goToScreen} />
                                                    );
                                                }
                                            } else {
                                                return <SectionItem key={'item-' + itemIndex} instance={item} onPress={goToScreen} />;
                                            }
                                        })}
                                    </View>
                                </View>
                            );
                        }
                    })}

                    <View style={[StaticStyle.Center, ProfileStyle.Footer]}>
                        <TouchableOpacity
                            onPress={handleSignout}
                            style={[StaticStyle.Center, ProfileStyle.FooterButton]}
                        >
                            <Icon color="white" source="logout" size={20} />
                            <Text style={ProfileStyle.ButtonText}>Đăng xuất</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </AlertNotificationRoot>
    )
};

const ProfileStyle = StyleSheet.create({
    Header: {
        backgroundColor: Theme.SecondaryColor,
        marginTop: screenHeight * 0.05,
        height: screenHeight * 0.25,
        borderRadius: 16,
        marginHorizontal: 12,
    },
    Avatar: {
        marginTop: -screenHeight * 0.1,
        width: screenWidth * 0.3,
        height: screenWidth * 0.3,
        borderWidth: 1,
        borderRadius: (screenWidth * 0.3) / 2,
        borderColor: Theme.PrimaryColor,
        backgroundColor: Theme.SecondaryColor,
    },
    FullName: {
        fontFamily: Theme.Bold,
        fontSize: 24
    },
    IDAccount: {
        fontFamily: Theme.Medium,
        color: Theme.Gray,
        fontSize: 16,
        marginTop: 10,
        marginBottom: 40
    },
    HeaderButton: {
        position: 'absolute',
        bottom: 0,
        padding: 8,
        width: '100%',
        flexDirection: 'row',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        backgroundColor: Theme.PrimaryColor,
    },
    ButtonText: {
        color: Theme.WhiteColor,
        fontSize: 14,
        fontFamily: Theme.Bold,
        marginHorizontal: 8,
    },
    Section: {
        marginTop: 40,
        marginHorizontal: 12,
    },
    SectionTitle: {
        textTransform: 'uppercase',
        fontFamily: Theme.SemiBold,
        fontSize: 16,
    },
    SectionBody: {
        borderWidth: 1,
        marginTop: 12,
        borderRadius: 8,
        borderColor: '#eee',
        overflow: 'hidden',
        borderBottomWidth: 0,
    },
    Footer: {
        marginVertical: 16,
    },
    FooterButton: {
        width: '60%',
        flexDirection: 'row',
        backgroundColor: Theme.PrimaryColor,
        padding: 12,
        borderRadius: 12,
    },
});

export default Profile;