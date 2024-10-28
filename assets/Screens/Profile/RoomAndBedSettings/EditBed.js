import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import RoomAndBedSettingStyle from "./RoomAndBedSettingStyle";
import { TextInput, Button } from "react-native-paper";
import Theme from "../../../Styles/Theme";
import { defaultImage, statusBed, statusBedName, statusCode } from "../../../Configs/Constants";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { getTokens } from "../../../Utils/Utilities";
import { authAPI, endPoints } from "../../../Configs/APIs";

const EditBed = ({ route, navigation }) => {
    const { bed } = route.params;
    const bedID = bed.id;
    const [selectedImage, setSelectedImage] = useState(bed.image);
    const [name, setName] = useState(bed.name);
    const [description, setDescription] = useState(bed.description);
    const [bedStatus, setBedStatus] = useState(bed.status);
    const [modalStatusVisible, setModalStatusVisible] = useState(false);
    const [selectionOptions, setSelectionOptions] = useState([]);
    const [selectedBedStatus, setSelectedBedStatus] = useState(bed.status === statusBedName.VACUITY ? statusBed.VACUITY : statusBed.NONVACUITY);

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
        if (type === "bedStatus") {
            setSelectedBedStatus(item);
            setBedStatus(item === statusBed.VACUITY ? statusBedName.VACUITY : statusBedName.NONVACUITY);
        }

        closeModal(type);
    };

    const openModal = (type) => {
        if (type === "bedStatus") {
            setSelectionOptions([statusBed.VACUITY, statusBed.NONVACUITY]);
            setModalStatusVisible(true);
        }
    };


    const closeModal = (type) => {
        if (type === "bedStatus") {
            setModalStatusVisible(false);
        }
    };

    const handleEditBed = async () => {
        if(name === "" || description === "") {
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

        if (selectedImage !== bed.image) {
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

        if (name !== bed.name) {
            formData.append('name', name);
            hasEntries = true;
        }

        if (selectedBedStatus !== bed.status) {
            formData.append('status', selectedBedStatus === statusBed.VACUITY ? statusBedName.VACUITY : statusBedName.NONVACUITY);
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
            const response = await authAPI(accessToken).patch(endPoints['bed-detail'](bedID), formData, {
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

            <Text style={RoomAndBedSettingStyle.Title}>Tên giường</Text>
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

            <Text style={RoomAndBedSettingStyle.Title}>Mô tả giường</Text>
            <TextInput
                value={description}
                onChangeText={text => setDescription(text)}
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

            <Text style={RoomAndBedSettingStyle.Title}>Trạng thái</Text>
            <TouchableOpacity onPress={() => openModal("bedStatus")}>
                <TextInput
                    value={selectedBedStatus}
                    editable={false}
                    style={RoomAndBedSettingStyle.Input}
                    placeholder="Chọn trạng thái"
                    cursorColor={Theme.PrimaryColor}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    outlineColor={Theme.PrimaryColor}
                    mode="outlined"
                    right={<TextInput.Icon icon="list-status" color={Theme.PrimaryColor} />}
                />
            </TouchableOpacity>


            <Button
                mode="contained"
                style={RoomAndBedSettingStyle.CreateButton}
                contentStyle={RoomAndBedSettingStyle.ButtonContent}
                onPress={handleEditBed}
            >
                <Text style={RoomAndBedSettingStyle.ButtonText}>Lưu thay đổi</Text>
            </Button>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalStatusVisible}
                onRequestClose={() => closeModal("bedStatus")}
            >
                <View style={RoomAndBedSettingStyle.ModalContainer}>
                    <View style={RoomAndBedSettingStyle.ModalContent}>
                        <Text style={RoomAndBedSettingStyle.ModalTitle}>Trạng thái</Text>
                        <FlatList
                            data={selectionOptions}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelectOption(item, "bedStatus")}>
                                    <Text style={[
                                        RoomAndBedSettingStyle.OptionText,
                                        selectedBedStatus === item && { color: Theme.PrimaryColor, fontFamily: Theme.Bold }
                                    ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => closeModal("bedStatus")} style={RoomAndBedSettingStyle.CloseTextContainer}>
                            <Text style={RoomAndBedSettingStyle.CloseText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default EditBed;