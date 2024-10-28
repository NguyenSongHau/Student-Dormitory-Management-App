import { TouchableOpacity, View, Image, Modal, FlatList, Text } from "react-native";
import { Button, Icon, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import DismissKeyboard from "../../../Components/Common/DismissKeyboard";
import Theme from "../../../Styles/Theme";
import { getTokens } from "../../../Utils/Utilities";
import { authAPI, endPoints } from "../../../Configs/APIs";
import { statusBed, statusCode } from '../../../Configs/Constants';
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import RoomAndBedSettingStyle from './RoomAndBedSettingStyle';

const CreateRoom = ({ navigation, route }) => {
    const { roomID } = route.params;
    const [selectedImage, setSelectedImage] = useState(null);
    const [bedName, setBedName] = useState("");
    const [bedDescription, setBedDescription] = useState("");

    const handleImageSelection = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Lỗi",
                textBody: "Không có quyền truy cập!",
                button: "Đóng"
            });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleCreateBed = async () => {
        if (bedName === "" || bedDescription === "") {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: "Vui lòng nhập đầy đủ thông tin.",
                button: "Đóng",
            });
            return;
        }

        const formData = new FormData();

        if (selectedImage) {
            const fileExtension = selectedImage.split('.').pop().toLowerCase();
            let mimeType = 'image/jpeg';

            if (fileExtension === 'png') {
                mimeType = 'image/png';
            } else if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
                mimeType = 'image/jpeg';
            }

            formData.append('image', {
                uri: selectedImage,
                name: selectedImage.split('/').pop(),
                type: mimeType,
            });
        }

        formData.append('name', bedName);
        formData.append('description', bedDescription);
        formData.append('room', roomID);

        try {
            const { accessToken } = await getTokens();
            const response = await authAPI(accessToken).post(endPoints['beds'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });

            if (response.status === statusCode.HTTP_201_CREATED) {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Thành công",
                    textBody: "Tạo giường thành công.",
                    button: "Đóng",
                });

                setTimeout(() => {
                    navigation.goBack();
                }, 2000);
            }
        } catch (error) {
            console.log(error);
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: error.response.data.message,
                button: "Đóng",
            });
        }
    };

    return (
        <DismissKeyboard>
            <View style={RoomAndBedSettingStyle.Container}>
                <TouchableOpacity style={RoomAndBedSettingStyle.BoxImage} onPress={handleImageSelection}>
                    {selectedImage ? (
                        <Image source={{ uri: selectedImage }} style={RoomAndBedSettingStyle.Image} />
                    ) : (
                        <Icon
                            source="image-plus"
                            size={30}
                            color={Theme.PrimaryColor}
                        />
                    )}
                </TouchableOpacity>

                <Text style={RoomAndBedSettingStyle.Title}>Tên giường</Text>
                <TextInput
                    value={bedName}
                    onChangeText={text => setBedName(text)}
                    style={RoomAndBedSettingStyle.Input}
                    placeholder="Nhập tên giường"
                    cursorColor={Theme.PrimaryColor}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    outlineColor={Theme.PrimaryColor}
                    mode="outlined"
                    right={<TextInput.Icon icon="bed" color={Theme.PrimaryColor} />}
                />

                <Text style={RoomAndBedSettingStyle.Title}>Mô tả giường</Text>
                <TextInput
                    value={bedDescription}
                    onChangeText={text => setBedDescription(text)}
                    style={[RoomAndBedSettingStyle.Input, { paddingVertical: 10 }]}
                    placeholder="Nhập mô tả giường"
                    cursorColor={Theme.PrimaryColor}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    outlineColor={Theme.PrimaryColor}
                    mode="outlined"
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                />

                <Button
                    mode="contained"
                    onPress={handleCreateBed}
                    style={RoomAndBedSettingStyle.CreateButton}
                    contentStyle={RoomAndBedSettingStyle.ButtonContent}

                >
                    <Text style={RoomAndBedSettingStyle.ButtonText}>Tạo giường</Text>
                </Button>
            </View>
        </DismissKeyboard>
    );
};

export default CreateRoom;