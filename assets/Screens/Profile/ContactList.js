import { useEffect, useState } from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import DismissKeyboard from '../../Components/Common/DismissKeyboard';
import Loading from '../../Components/Common/Loading';
import APIs, { endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import { useAccount } from '../../Store/Contexts/AccountContext';
import StaticStyle from '../../Styles/StaticStyle';
import Theme from '../../Styles/Theme';
import { loadMore, onRefresh, search } from '../../Utils/Utilities';

const ContactList = ({ navigation }) => {
   const currentAccount = useAccount();
   const [allUser, setallUser] = useState([]);
   const [page, setPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);

   useEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <TouchableOpacity
               style={{ marginRight: 12 }}
               onPress={() =>
                  navigation.navigate('ProfileStack', {
                     screen: 'EditProfile',
                  })
               }
            >
               <Image
                  source={{ uri: currentAccount.data.avatar }}
                  style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.SecondaryColor }}
               />
            </TouchableOpacity>
         ),
      });
   }, [navigation]);

   useEffect(() => {
      const loadAllUser = async () => {
         if (page <= 0) return;

         setLoading(true);
         try {
            const response = await APIs.get(endPoints['specialists-managers'], { params: { page} });

            console.log(response);

            if (response.status === statusCode.HTTP_200_OK) {
               if (page === 1) {
                  setallUser(response.data.results);
               } else {
                  setallUser((prevAllUser) => [...prevAllUser, ...response.data.results]);
               }
            }
            if (response.data.next === null) {
               setPage(0);
            }
         } catch (error) {
            console.error('All user:', error);
         } finally {
            setLoading(false);
            setRefreshing(false);
         }
      };

      loadAllUser();
   }, [page, refreshing]);

   const renderRefreshControl = () => {
      return (
         <RefreshControl
            colors={[Theme.PrimaryColor]}
            refreshing={refreshing}
            onRefresh={() => onRefresh({ setPage, setRefreshing })}
         />
      );
   };

   return (
      <View style={{ ...StaticStyle.BackGround, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
         <DismissKeyboard>
            <View style={{ marginHorizontal: 8 }}>
               <ScrollView
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  refreshControl={renderRefreshControl()}
                  onScroll={({ nativeEvent }) => loadMore(nativeEvent, loading)}
               >
                  {!refreshing && loading && page === 1 && <Loading style={{ marginBottom: 16 }} />}
                  {allUser.map(
                     (item) =>
                        item.id !== currentAccount.data.id && (
                           <TouchableOpacity
                              key={item.id}
                              onPress={() =>
                                 navigation.navigate('ChatStack', { screen: 'Chat', params: { toUser: item } })
                              }
                           >
                              <View
                                 style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 12,
                                    marginHorizontal: 12,
                                 }}
                              >
                                 <View style={{ width: '20%' }}>
                                    <Image
                                       source={{ uri: item.avatar }}
                                       style={{
                                          width: 48,
                                          height: 48,
                                          borderRadius: 40,
                                          backgroundColor: Theme.SecondaryColor,
                                       }}
                                    />
                                 </View>
                                 <View style={{ width: '80%' }}>
                                    <Text style={{ fontFamily: Theme.SemiBold }}>{item.full_name}</Text>
                                 </View>
                              </View>
                           </TouchableOpacity>
                        ),
                  )}
                  {loading && page > 1 && <Loading style={{ marginTop: 16 }} />}
               </ScrollView>
            </View>
         </DismissKeyboard>
      </View>
   );
};

export default ContactList;