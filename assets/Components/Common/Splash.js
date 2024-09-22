import { Text, View } from "react-native";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import StaticStyle from '../../Styles/StaticStyle';

const Splash = () => {
    return(
       <View style={StaticStyle.Container}>
            <LottieView
                style={{
                    width: 400,
                    height: 400,
                }}
                source={require('../../Assets/Animations/Splash/Splash.json')}
                autoPlay
                loop
            />
       </View>
    )
}

export default Splash;