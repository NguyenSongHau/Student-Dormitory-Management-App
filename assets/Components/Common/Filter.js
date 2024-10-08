import React, { useState } from "react";
import { StyleSheet, View, Modal, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import Theme from "../../Styles/Theme";

const Filter = ({ type, onSelectType }) => {
    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const handleSelectType = (selectedType) => {
        const typeValue = selectedType === 'Tất cả' ? 'ALL' : 
                          selectedType === 'Phòng thường' ? 'NORMAL' : 
                          'SERVICE';
        onSelectType(typeValue);
        hideModal();
    };

    return (
        <View>
            <TouchableOpacity style={FilterStyle.Button} onPress={showModal}>
                <Icon
                    source="filter"
                    color={Theme.SecondaryColor}
                    size={30}
                />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={hideModal}
            >
                <View style={FilterStyle.ModalOverlay}>
                    <View style={FilterStyle.ModalContent}>
                        <Text style={FilterStyle.ModalTitle}>Chọn loại phòng</Text>
                        <Text 
                            style={[
                                FilterStyle.ModalText, 
                                type === 'ALL' && { color: Theme.PrimaryColor, fontFamily: Theme.Bold}
                            ]}
                            onPress={() => handleSelectType('Tất cả')}
                        >
                            Tất cả
                        </Text>
                        <Text 
                            style={[
                                FilterStyle.ModalText, 
                                type === 'NORMAL' && { color: Theme.PrimaryColor, fontFamily: Theme.Bold }
                            ]}
                            onPress={() => handleSelectType('Phòng thường')}
                        >
                            Phòng thường
                        </Text>
                        <Text 
                            style={[
                                FilterStyle.ModalText, 
                                type === 'SERVICE' && { color: Theme.PrimaryColor, fontFamily: Theme.Bold }
                            ]}
                            onPress={() => handleSelectType('Phòng dịch vụ')}
                        >
                            Phòng dịch vụ
                        </Text>
                        <TouchableOpacity onPress={hideModal}>
                            <Text style={FilterStyle.CloseText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const FilterStyle = StyleSheet.create({
    Button: {
        backgroundColor: Theme.PrimaryColor,
        width: 55,
        height: 55,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    ModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    ModalContent: {
        width: 250,
        padding: 20,
        backgroundColor: Theme.WhiteColor,
        borderRadius: 10,
        alignItems: "center",
    },
    ModalTitle: {
        fontFamily: Theme.Bold,
        fontSize: 20,
        marginBottom: 10,
        color: Theme.PrimaryColor
    },
    ModalText: {
        fontSize: 18,
        marginVertical: 8,
        fontFamily: Theme.Medium,
        color: Theme.BlackColor
    },
    CloseText: {
        fontSize: 20,
        color: Theme.PrimaryColor,
        marginTop: 20,
        fontFamily: Theme.Bold
    },
});

export default Filter;