import Theme from "../../Styles/Theme";
import * as ImagePicker from 'expo-image-picker';
import Loading from '../../Components/Common/Loading';
import { defaultImage } from "../../Configs/Constants";
import { useAccount } from '../../Store/Contexts/AccountContext';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DismissKeyboard from '../../Components/Common/DismissKeyboard';
import StaticStyle, { screenHeight } from '../../Styles/StaticStyle';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Icon } from "react-native-paper";
import EditProfileView from "../../Components/Profile/EditProfile/EditProfileView";

const EditProfile = ({ navigation }) => {
   const currentAccount = useAccount();
   const refSheetSelectImage = useRef(BottomSheet);
   const [isRendered, setIsRendered] = useState(false);
   const [tempAccount, setTempAccount] = useState({
      ...currentAccount,
      data: {
         ...currentAccount.data,
         avatar: currentAccount.data.avatar || null,
      },
   });
   const [indexSheetSelectImage, setIndexSheetSelectImage] = useState(-1);

   useEffect(() => {
      setIsRendered(true);
   }, []);

   useEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <TouchableOpacity
               style={[StaticStyle.Center, StaticStyle.HeaderButton]}
            >
               <Text style={StaticStyle.HeaderButtonText}>Cập nhật</Text>
            </TouchableOpacity>
         ),
      });
   }, [navigation]);

   const handleGallerySelection = () =>
      handleSelection(ImagePicker.requestMediaLibraryPermissionsAsync, ImagePicker.launchImageLibraryAsync);

   const handleCameraSelection = () =>
      handleSelection(ImagePicker.requestCameraPermissionsAsync, ImagePicker.launchCameraAsync);

   const handleSelection = async (requestPermission, launchFunction) => {
      let { status } = await requestPermission();
      if (status !== 'granted') {
         Alert.alert('Thông báo', 'Không có quyền truy cập!');
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
                                 uri: tempAccount.data.avatar ? tempAccount.data.avatar.uri : defaultImage.DEFAULT_AVATAR,
                              }}
                           />
                           <View style={EditProfileStyle.CameraIcon}>
                              <Icon source="camera" color="white" size={24} />
                           </View>
                        </TouchableOpacity>
                     </View>
                  </ImageBackground>

                  <View>
                     <EditProfileView tempAccount={tempAccount} setTempAccount={setTempAccount} />
                  </View>
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