import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Theme from "../../Styles/Theme";
import StaticStyle, { screenHeight, screenWidth } from "../../Styles/StaticStyle";
import LottieView from "lottie-react-native";
import AppIntroSlider from 'react-native-app-intro-slider';

const Onboaring = () => {
    const refLottieView = useRef(LottieView);

    const onboardings = [
        {
            id: 1,
            title: 'Ký Túc Xá Sinh Viên',
            description: 'Hệ thống quản lý ký túc xá dễ dàng và tiện lợi cho sinh viên.',
            image: require('../../Assets/Animations/Splash/Splash.json')
        },
        {
            id: 2,
            title: 'Đăng Ký Hồ Sơ',
            description: 'Thủ tục đăng ký hồ sơ một cách nhanh chóng và tiện lợi.',
            image: require('../../Assets/Animations/Splash/Splash.json')
        },
        {
            id: 3,
            title: 'Hỗ Trợ Tận Tình',
            description: 'Đội ngũ nhân viên sẵn sàng giải đáp mọi thắc mắc của sinh viên.',
            image: require('../../Assets/Animations/Splash/Splash.json')
        },
    ];

    const handleDone = async () => {
        await AsyncStorage.setItem('onboarding-done', 'true');
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
        });
    };

    const renderButton = (label) => {
        return (
            <View style={{ padding: 12 }}>
                <Text style={OnboaringStyle.Button}>{label}</Text>
            </View>
        );
    };

    return (
        <AppIntroSlider
            style={OnboaringStyle.BackGround}
            data={onboardings}
            showSkipButton
            onDone={handleDone}
            renderItem={({ item }) => {
                return (
                    <View key={item.id} style={OnboaringStyle.OnboardingContainer}>
                        {item.image && (
                            <LottieView
                                style={OnboaringStyle.OnboardingImage}
                                source={item.image}
                                ref={refLottieView}
                                autoPlay
                                loop
                            />
                        )}
                        <Text style={OnboaringStyle.OnboardingTitle}>{item.title}</Text>
                        <Text style={OnboaringStyle.OnboardingDescription}>{item.description}</Text>
                    </View>
                );
            }}
            activeDotStyle={{ backgroundColor: Theme.PrimaryColor, width: 20 }}
            renderNextButton={() => renderButton('Tiếp tục')}
            renderSkipButton={() => renderButton('Bỏ qua')}
            renderDoneButton={() => renderButton('Hoàn tất')}
        />
    )
}

const OnboaringStyle = StyleSheet.create({
    OnboardingContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 15,
        paddingTop: screenHeight / 10,
    },
    OnboardingImage: {
        width: screenWidth + 50,
        height: 330,
        resizeMode: 'contain',
    },
    OnboardingTitle: {
        fontSize: 28,
        marginTop: 60,
        fontFamily: Theme.Bold,
    },
    OnboardingDescription: {
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
        lineHeight: 30,
        fontFamily: Theme.SemiBold,
    },
    Button: {
        fontWeight: '600',
        fontSize: 16,
        fontFamily: Theme.SemiBold,
    },
});

export default Onboaring;