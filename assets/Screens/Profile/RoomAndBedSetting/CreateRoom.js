import { TouchableOpacity, View, Image, Modal, FlatList, Text } from "react-native";
import { Button, Icon, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import DismissKeyboard from "../../../Components/Common/DismissKeyboard";
import Theme from "../../../Styles/Theme";
import { getTokens } from "../../../Utils/Utilities";
import { authAPI, endPoints } from "../../../Configs/APIs";
import { gender, genderSymbol, statusCode, typeRoom, typeRoomName } from '../../../Configs/Constants';
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import RoomAndBedSettingStyle from './RoomAndBedSettingStyle'

const CreateRoom = ({ navigation }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [roomFor, setRoomFor] = useState("");
    const [modalTypeVisible, setModalTypeVisible] = useState(false);
    const [modalForVisible, setModalForVisible] = useState(false);
    const [selectionOptions, setSelectionOptions] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState(null);
    const [selectedRoomFor, setSelectedRoomFor] = useState(null);

    const handleImageSelection = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Lỗi",
                textBody: "Không có quyền truy cập!",
                button: "Đóng"
            });
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

    const handleSelectOption = (item, type) => {
        if (type === "roomType") {
            setSelectedRoomType(item);
            setType(item === typeRoom.SERVICE ? typeRoom.SERVICE : typeRoom.NORMAL);
        } else if (type === "roomFor") {
            setSelectedRoomFor(item);
            setRoomFor(item === gender.M ? gender.M : gender.F);
        }
        closeModal(type);
    };

    const openModal = (type) => {
        if (type === "roomType") {
            setSelectionOptions([typeRoom.SERVICE, typeRoom.NORMAL]);
            setModalTypeVisible(true);
        } else if (type === "roomFor") {
            setSelectionOptions([gender.F, gender.M]);
            setModalForVisible(true);
        }
    };

    const closeModal = (type) => {
        if (type === "roomType") {
            setModalTypeVisible(false);
        } else if (type === "roomFor") {
            setModalForVisible(false);
        }
    };

    const handleCreateRoom = async () => {
        if (name === "" || type === "" || roomFor === "") {
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
    
        const roomTypeValue = type === typeRoom.SERVICE ? typeRoomName.SERVICE : typeRoomName.NORMAL;
        const roomForValue = roomFor === gender.M ? genderSymbol.M : genderSymbol.F;
    
        formData.append('name', name);
        formData.append('type', roomTypeValue);
        formData.append('room_for', roomForValue);
    
        try {
            const { accessToken } = await getTokens();
            const response = await authAPI(accessToken).post(endPoints['rooms'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
    
            if (response.status === statusCode.HTTP_201_CREATED) {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Thành công",
                    textBody: "Tạo phòng thành công.",
                    button: "Đóng",
                });
    
                setTimeout(() => {
                    navigation.goBack();
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Lỗi",
                textBody: "Hệ thống đang lỗi, vui lòng thử lại sau!",
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

                <Text style={RoomAndBedSettingStyle.Title}>Tên phòng</Text>
                <TextInput
                    value={name}
                    onChangeText={text => setName(text)}
                    style={RoomAndBedSettingStyle.Input}
                    placeholder="Nhập tên phòng"
                    cursorColor={Theme.PrimaryColor}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    outlineColor={Theme.PrimaryColor}
                    mode="outlined"
                    right={<TextInput.Icon icon="door-open" />}
                />

                <Text style={RoomAndBedSettingStyle.Title}>Loại phòng</Text>
                <TouchableOpacity onPress={() => openModal("roomType")}>
                    <TextInput
                        value={type}
                        editable={false}
                        style={RoomAndBedSettingStyle.Input}
                        placeholder="Chọn loại phòng"
                        cursorColor={Theme.PrimaryColor}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        outlineColor={Theme.PrimaryColor}
                        mode="outlined"
                        right={<TextInput.Icon icon="format-list-bulleted-type" />}
                    />
                </TouchableOpacity>

                <Text style={RoomAndBedSettingStyle.Title}>Phòng cho</Text>
                <TouchableOpacity onPress={() => openModal("roomFor")}>
                    <TextInput
                        value={roomFor}
                        editable={false}
                        style={RoomAndBedSettingStyle.Input}
                        placeholder="Phòng cho"
                        cursorColor={Theme.PrimaryColor}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        outlineColor={Theme.PrimaryColor}
                        mode="outlined"
                        right={<TextInput.Icon icon="gender-female" />}
                    />
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalTypeVisible}
                    onRequestClose={() => closeModal("roomType")}
                >
                    <View style={RoomAndBedSettingStyle.ModalContainer}>
                        <View style={RoomAndBedSettingStyle.ModalContent}>
                            <Text style={RoomAndBedSettingStyle.ModalTitle}>Loại phòng</Text>
                            <FlatList
                                data={selectionOptions}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleSelectOption(item, "roomType")}>
                                        <Text style={[
                                            RoomAndBedSettingStyle.OptionText,
                                            selectedRoomType === item && { color: Theme.PrimaryColor, fontFamily: Theme.Bold }
                                        ]}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity onPress={() => closeModal("roomType")} style={RoomAndBedSettingStyle.CloseTextContainer}>
                                <Text style={RoomAndBedSettingStyle.CloseText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalForVisible}
                    onRequestClose={() => closeModal("roomFor")}
                >
                    <View style={RoomAndBedSettingStyle.ModalContainer}>
                        <View style={RoomAndBedSettingStyle.ModalContent}>
                            <Text style={RoomAndBedSettingStyle.ModalTitle}>Phòng cho</Text>
                            <FlatList
                                data={selectionOptions}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleSelectOption(item, "roomFor")}>
                                        <Text style={[
                                            RoomAndBedSettingStyle.OptionText,
                                            selectedRoomFor === item && { color: Theme.PrimaryColor, fontFamily: Theme.Bold }
                                        ]}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity onPress={() => closeModal("roomFor")} style={RoomAndBedSettingStyle.CloseTextContainer}>
                                <Text style={RoomAndBedSettingStyle.CloseText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Button
                    mode="contained"
                    onPress={handleCreateRoom}
                    style={RoomAndBedSettingStyle.CreateButton}
                    contentStyle={RoomAndBedSettingStyle.ButtonContent}
                >
                    <Text style={RoomAndBedSettingStyle.ButtonText}>Tạo phòng</Text>
                </Button>
            </View>
        </DismissKeyboard>
    );
};

export default CreateRoom;