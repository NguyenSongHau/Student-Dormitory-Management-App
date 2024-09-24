import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AccountProvider } from '../Store/Contexts/AccountContext';
import { GlobalProvider } from '../Store/Contexts/GlobalContext';
import Theme from '../Styles/Theme';
import Routers from './Routers';

const Providers = () => {
    return (
        <PaperProvider theme={theme}>
            <GlobalProvider>
                <AccountProvider>
                    <Routers />
                </AccountProvider>
            </GlobalProvider>
        </PaperProvider>
    );
}

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: Theme.PrimaryColor,
        accent: Theme.PrimaryColor,
    },
};

export default Providers;