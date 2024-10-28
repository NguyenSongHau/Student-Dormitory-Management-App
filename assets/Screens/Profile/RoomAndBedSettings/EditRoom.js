import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import Theme from '../../../Styles/Theme';
import { defaultImage, gender, genderSymbol, statusCode, typeRoom, typeRoomName } from '../../../Configs/Constants';
import RoomAndBedSettingStyle from './RoomAndBedSettingStyle';
import { getTokens } from '../../../Utils/Utilities';
import { authAPI, endPoints } from '../../../Configs/APIs';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

const EditRoom = ({ route, navigation }) => {
    const { room } = route.params;
    const roomID = room.id;
    const [selectedImage, setSelectedImage] = useState(room.image);
    const [name, setName] = useState(room.name);
    const [type, setType] = useState(room.type);
    const [roomFor, setRoomFor] = useState(room.room_for);
    const [modalTypeVisible, setModalTypeVisible] = useState(false);
    const [modalForVisible, setModalForVisible] = useState(false);
    const [selectionOptions, setSelectionOptions] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState(room.type === typeRoomName.SERVICE ? typeRoom.SERVICE : typeRoom.NORMAL);
    const [selectedRoomFor, setSelectedRoomFor] = useState(room.room_for === genderSymbol.M ? gender.M : gender.F);

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
            setType(item === typeRoom.SERVICE ? typeRoomName.SERVICE : typeRoomName.NORMAL);
        } else if (type === "roomFor") {
            setSelectedRoomFor(item);
            setRoomFor(item === gender.M ? genderSymbol.M : genderSymbol.F);
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

    const handleEditRoom = async () => {
        if(name === "") {
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: "Thông báo",
                textBody: "Cập nhập phòng thành công.",
                button: "Đóng"
            });

            setTimeout(() => {
                navigation.goBack();
            }, 2000);
            
            return;
        }

        const formData = new FormData();
        let hasEntries = false;

        if (selectedImage !== room.image) {
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
            hasEntries = true;
        }

        if (name !== room.name) {
            formData.append('name', name);
            hasEntries = true;
        }
        if (selectedRoomType !== room.type) {
            formData.append('type', selectedRoomType === typeRoom.SERVICE ? typeRoomName.SERVICE : typeRoomName.NORMAL);
            hasEntries = true;
        }
        if (selectedRoomFor !== room.room_for) {
            formData.append('room_for', selectedRoomFor === gender.M ? genderSymbol.M : genderSymbol.F);
            hasEntries = true;
        }
    
        if (!hasEntries) {
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: "Thông báo",
                textBody: "Cập nhập phòng thành công.",
                button: "Đóng"
            });

            setTimeout(() => {
                navigation.goBack();
            }, 2000);
            return;
        }
    
        try {
            const { accessToken } = await getTokens();
            const response = await authAPI(accessToken).patch(endPoints['room-detail'](roomID), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === statusCode.HTTP_200_OK) {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Thành công",
                    textBody: "Cập nhật phòng thành công",
                    button: "Đóng"
                });
    
                setTimeout(() => {
                    navigation.goBack();
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Lỗi",
                textBody: "Cập nhật phòng thất bại!",
                button: "Đóng"
            });
        }
    };
    

    return (
        <View style={RoomAndBedSettingStyle.Container}>
            <TouchableOpacity style={RoomAndBedSettingStyle.BoxImage} onPress={handleImageSelection}>
                <Image
                    style={RoomAndBedSettingStyle.Image}
                    source={{ uri: selectedImage ? selectedImage : defaultImage.DEFAULT_ROOM }}
                />
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
                    value={selectedRoomType}
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
                    value={selectedRoomFor}
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
                style={RoomAndBedSettingStyle.CreateButton}
                contentStyle={RoomAndBedSettingStyle.ButtonContent}
                onPress={handleEditRoom}
            >
                <Text style={RoomAndBedSettingStyle.ButtonText}>Lưu thay đổi</Text>
            </Button>
        </View>
    );
};

export default EditRoom;