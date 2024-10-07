import { CLIENT_ID, CLIENT_SECRET } from '../Configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIs, { endPoints } from '../Configs/APIs';
import { SignOutAction } from '../Store/Actions/AccountAction';

export const getTokens = async () => {
    const [[, accessToken], [, refreshToken]] = await AsyncStorage.multiGet(['access-token', 'refresh-token']);
    return { accessToken, refreshToken };
}

export const setTokens = async (tokens) => {
    let [accessToken, refreshToken] = [tokens.data.access_token, tokens.data.refresh_token];
    await AsyncStorage.multiSet([
        ['access-token', accessToken],
        ['refresh-token', refreshToken],
    ]);

    return { accessToken, refreshToken };
};

export const removeTokens = async () => {
    return await AsyncStorage.multiRemove(['access-token', 'refresh-token']);
};

export const refreshAccessToken = async (refreshToken, dispatch) => {
    try {
        const tokens = await APIs.post(endPoints['token'], {
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        });

        const { accessToken } = await setTokens(tokens);
        return accessToken;
    } catch (error) {
        console.log('Refresh token', error);
        dispatch(SignOutAction());
        return null;
    }
};

export const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

export const loadMore = (nativeEvent, loading, page, setPage) => {
    if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
        setPage(page + 1);
    }
};

export const onRefresh = ({ setPage, setRefreshing, setFilter = null, setData = null }) => {
    setPage(1);
    setRefreshing(true);
    if (setData) setData([]);
    if (setFilter) setFilter('');
};

export const search = (value, setPage, callback) => {
    setPage((prevPage) => 1);
    callback(value);
};

export const formatDate = (dateString) => {
    if (!dateString) {
        return "Không có ngày";
    }

    const datePart = dateString.split(" ")[0];
    return datePart;
};

export const formatCurrency = (price) => {
    if (isNaN(price)) return "0";

    return Number(price)
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};