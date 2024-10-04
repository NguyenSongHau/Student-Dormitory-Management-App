import Theme from "../../Styles/Theme";
import { Icon } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from "react";
import Loading from '../../Components/Common/Loading';
import { defaultImage, statusCode } from "../../Configs/Constants";
import { useAccount, useAccountDispatch } from '../../Store/Contexts/AccountContext';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DismissKeyboard from '../../Components/Common/DismissKeyboard';
import StaticStyle, { screenHeight } from '../../Styles/StaticStyle';
import EditProfileView from "../../Components/Profile/EditProfile/EditProfileView";
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getTokens, refreshAccessToken } from "../../Utils/Utilities";
import { authAPI, endPoints } from "../../Configs/APIs";
import { UpdateAccountAction } from "../../Store/Actions/AccountAction";
import moment from "moment";

const EditProfile = ({ navigation }) => {
   const currentAccount = useAccount();
   const dispatch = useAccountDispatch();
   const refSheetSelectImage = useRef(BottomSheet);
   const [isRendered, setIsRendered] = useState(false);
   const [tempAccount, setTempAccount] = useState(currentAccount);
   const [indexSheetSelectImage, setIndexSheetSelectImage] = useState(-1);

   useEffect(() => {
      setIsRendered(true);
   }, []);

   useEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <TouchableOpacity
               onPress={handleEditProfile}
               style={[StaticStyle.Center, StaticStyle.HeaderButton]}
            >
               <Text style={StaticStyle.HeaderButtonText}>Cập nhật</Text>
            </TouchableOpacity>
         ),
      });
   }, [navigation, currentAccount, tempAccount]);

   const handleEditProfile = async () => {
      let form = new FormData();
      let size = 0;

      if (currentAccount.data.avatar !== tempAccount.data.avatar) {
         form.append('avatar', tempAccount.data.avatar);
         size++;
      }

      for (let key in tempAccount.data) {
         if (currentAccount.data[key] !== tempAccount.data[key]) {
            if (key === 'dob') {
               const dobValue = tempAccount.data[key];
               const formattedDob = moment(dobValue, 'DD-MM-YYYY').format('YYYY-MM-DD')
               
               if (formattedDob) {
                  form.append(key, formattedDob);
                  size++;
               }
            } else {
               form.append(key, tempAccount.data[key]);
               size++;
            }
         }
      }

      for (let key in tempAccount.data.user_instance) {
         if (currentAccount.data.user_instance[key] !== tempAccount.data.user_instance[key]) {
            form.append(key, tempAccount.data.user_instance[key]);
            size++;
         }
      }

      if (size <= 0) return;

      const { accessToken, refreshToken } = await getTokens();

      try {
         let response = await authAPI(accessToken).patch(endPoints['update'], form);

         if (response.status === statusCode.HTTP_200_OK) {
            console.log(response);
            dispatch(UpdateAccountAction(response.data));

            Dialog.show({
               type: ALERT_TYPE.SUCCESS,
               title: "Thành công",
               textBody: "Cập nhập thông tin thành công!",
               button: "Đóng"
            });

            setTimeout(() => {
               navigation.navigate('Profile');
            }, 3000);
         }
      } catch (error) {
         if (
            error.response &&
            (error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
               error.response.status === statusCode.HTTP_403_FORBIDDEN)
         ) {
            const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
            if (newAccessToken) {
               handleEditProfile();
            }
         } else {
            Dialog.show({
               type: ALERT_TYPE.DANGER,
               title: "Lỗi",
               textBody: "Có lỗi xảy ra khi cập nhập!",
               button: "Đóng"
            });
         }
      }
   };

   const handleGallerySelection = () =>
      handleSelection(ImagePicker.requestMediaLibraryPermissionsAsync, ImagePicker.launchImageLibraryAsync);

   const handleCameraSelection = () =>
      handleSelection(ImagePicker.requestCameraPermissionsAsync, ImagePicker.launchCameraAsync);

   const handleSelection = async (requestPermission, launchFunction) => {
      let { status } = await requestPermission();
      if (status !== 'granted') {
         Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Lỗi",
            textBody: "Không có quyền truy cập!",
            button: "Đóng"
         });
      } else {
         let response = await launchFunction({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
         });

         if (!response.canceled) {
            setTempAccount((prevTempAccount) => ({
               ...prevTempAccount,
               data: {
                  ...prevTempAccount.data,
                  avatar: {
                     uri: response.assets[0].uri,
                     type: response.assets[0].mimeType,
                     name: response.assets[0].fileName,
                  },
               },
            }));

            refSheetSelectImage.current.close();
         }
      }

      if (indexSheetSelectImage > -1) {
         refSheetSelectImage?.current?.close();
      }
   };

   if (!isRendered) return <Loading />;

   return (
      <GestureHandlerRootView>
         <View style={StaticStyle.BackGround}>
            <ScrollView showsVerticalScrollIndicator={false}>
               <DismissKeyboard>
                  <ImageBackground style={EditProfileStyle.AvatarContainer}>
                     <View style={EditProfileStyle.AvatarTouch}>
                        <TouchableOpacity
                           activeOpacity={0.8}
                           onPress={() => refSheetSelectImage?.current?.expand()}
                        >
                           <Image
                              style={EditProfileStyle.Avatar}
                              source={{
                                 uri: tempAccount.data.avatar === null ? defaultImage.DEFAULT_AVATAR : tempAccount.data.avatar,
                              }}
                           />
                           <View style={EditProfileStyle.CameraIcon}>
                              <Icon source="camera" color="white" size={24} />
                           </View>
                        </TouchableOpacity>
                     </View>
                  </ImageBackground>

                  <EditProfileView tempAccount={tempAccount} setTempAccount={setTempAccount} />

               </DismissKeyboard>
            </ScrollView>
         </View>

         <BottomSheet
            ref={refSheetSelectImage}
            index={-1}
            snapPoints={['25%']}
            enablePanDownToClose
            onChange={setIndexSheetSelectImage}
            backgroundStyle={{ backgroundColor: '#273238' }}
            handleIndicatorStyle={{ backgroundColor: Theme.WhiteColor }}
         >
            <BottomSheetView style={StaticStyle.BottomSheetView}>
               <TouchableOpacity style={StaticStyle.BottomSheetItem} onPress={handleGallerySelection}>
                  <Icon source="image-multiple" color="white" size={24} />
                  <Text style={StaticStyle.BottomSheetItemText}>Chọn ảnh từ thư viện</Text>
               </TouchableOpacity>
            </BottomSheetView>
            <BottomSheetView style={StaticStyle.BottomSheetView}>
               <TouchableOpacity style={StaticStyle.BottomSheetItem} onPress={handleCameraSelection}>
                  <Icon source="camera" color="white" size={24} />
                  <Text style={StaticStyle.BottomSheetItemText}>Chụp ảnh từ camera</Text>
               </TouchableOpacity>
            </BottomSheetView>
         </BottomSheet>
      </GestureHandlerRootView>
   );
};

const EditProfileStyle = StyleSheet.create({
   AvatarContainer: {
      height: screenHeight / 4,
      justifyContent: 'center',
      alignItems: 'center',
   },
   AvatarTouch: {
      alignItems: 'center',
   },
   Avatar: {
      width: 140,
      height: 140,
      borderWidth: 4,
      borderRadius: 140 / 2,
      borderColor: Theme.WhiteColor,
      backgroundColor: Theme.SecondaryColor,
   },
   CameraIcon: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: '#273238',
      borderRadius: 36 / 2,
      margin: 4,
   },
});

export default EditProfile;