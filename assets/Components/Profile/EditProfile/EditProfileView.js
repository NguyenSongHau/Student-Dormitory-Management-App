import { useAccount } from '../../../Store/Contexts/AccountContext';
import { userFields, studentField } from '../../../Utils/Fields';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import Theme from '../../../Styles/Theme';
import { useState } from 'react';

const EditProfileView = ({ tempAccount, setTempAccount }) => {
    const currentAccount = useAccount();

    const updateTempAccount = (fieldName, value) => {
        setTempAccount((prevAccount) => ({
            ...prevAccount,
            [fieldName]: value,
        }));
    };

    return (
        <View style={[EditProfileViewStyle.FormContainer, EditProfileViewStyle.SectionContainer]}>
            {userFields(currentAccount).map((field, index) => (
                <View key={index} style={EditProfileViewStyle.FormWrap}>
                    <Text style={EditProfileViewStyle.FormText}>{field.label}</Text>
                    <TextInput
                        style={EditProfileViewStyle.Input}
                        value={(field.name === 'id' ? String(tempAccount[field.name] || currentAccount.data[field.name]) : tempAccount[field.name] || currentAccount.data[field.name])}
                        placeholder={field.label}
                        onChangeText={(value) => updateTempAccount(field.name, value)}
                        editable={!field.disabled}
                        keyboardType={field.keyboardType}
                        disabled={field.disabled}
                        right={
                            <TextInput.Icon
                                icon={field.icon}
                            />
                        }
                    />
                </View>
            ))}

            {currentAccount.data.role === "STU" && (
                studentField(currentAccount).map((field, index) => (
                    <View key={index} style={EditProfileViewStyle.FormWrap}>
                        <Text style={EditProfileViewStyle.FormText}>{field.label}</Text>
                        <TextInput
                            style={EditProfileViewStyle.Input}
                            value={
                                field.name === 'academic_year'
                                    ? String(tempAccount[field.name] || currentAccount.data.user_instance[field.name])
                                    : tempAccount[field.name] || currentAccount.data.user_instance[field.name]
                            }
                            placeholder={field.label}
                            onChangeText={(value) => updateTempAccount(field.name, value)}
                            keyboardType={field.keyboardType}
                            right={
                                <TextInput.Icon
                                    icon={field.icon}
                                />
                            }
                        />
                    </View>
                ))
            )}
        </View>
    );
};

const EditProfileViewStyle = StyleSheet.create({
    Input: {
        borderWidth: 2,
        marginBottom: 20,
        borderColor: Theme.PrimaryColor,
        backgroundColor: Theme.SecondaryColor,
        borderRadius: 5,
    },
    SectionContainer: {
        borderRadius: 8,
        marginHorizontal: 16,
    },
    FormContainer: {
        marginTop: -20,
        marginBottom: 6,
        flexDirection: 'column',
    },
    FormWrap: {
        marginVertical: 6,
    },
    FormText: {
        fontSize: 16,
        marginBottom: 4,
        fontFamily: Theme.SemiBold,
    },
    FormData: {
        borderRadius: 0,
        borderWidth: 2,
        backgroundColor: Theme.SecondaryColor,
        borderColor: Theme.PrimaryColor,
    },
    RadioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    RadioWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    RadioText: {
        fontSize: 16,
        fontFamily: Theme.SemiBold,
    },
    SnackbarText: {
        fontFamily: Theme.SemiBold,
        color: 'white',
        marginRight: 8,
    },
});

export default EditProfileView;