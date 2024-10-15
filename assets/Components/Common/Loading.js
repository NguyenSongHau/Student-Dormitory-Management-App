    import { ActivityIndicator, View } from 'react-native';
    import StaticStyle from '../../Styles/StaticStyle';
    import Theme from '../../Styles/Theme';

    const Loading = ({ children, ...options }) => {
        return (
            <View style={{ ...StaticStyle.Container, ...options.style }}>
                {children}  
                <ActivityIndicator size={options?.size ?? 'large'} color={Theme.PrimaryColor} />
            </View>
        );
    };

    export default Loading;