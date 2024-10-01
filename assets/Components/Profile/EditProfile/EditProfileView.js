import { useAccount } from '../../../Store/Contexts/AccountContext';
import { userFields, studentField } from '../../../Utils/Fields';
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton, TextInput } from 'react-native-paper';
import Theme from '../../../Styles/Theme';
import { useState } from 'react';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';

const EditProfileView = ({ tempAccount, setTempAccount }) => {
    const currentAccount = useAccount();
    const [selectedDate, setSelectedDate] = useState(tempAccount.dob ? new Date(tempAccount.dob) : null);

    const onChangeDate = (event, date) => {
        if (event.type === 'set' && date) {
            setSelectedDate(date);
            const formattedDate = moment(date).format('DD-MM-YYYY');
            updateTempAccount('dob', formattedDate);
        }
    };

    const showDatePicker = () => {
        DateTimePickerAndroid.open({
            value: selectedDate || new Date(),
            onChange: (event, date) => onChangeDate(event, date),
            mode: 'date',
            is24Hour: true,
        });
    };

    const updateTempAccount = (field, value) => {
        setTempAccount((prevTempAccount) => {
            const isUserInstanceField = ['student_id', 'university', 'faculty', 'major', 'academic_year'].includes(field);

            return {
                ...prevTempAccount,
                data: {
                    ...prevTempAccount.data,
                    ...(isUserInstanceField ? {
                        user_instance: {
                            ...prevTempAccount.data.user_instance,
                            [field]: value
                        }
                    } : {
                        [field]: value
                    })
                }
            };
        });
    };


    return (
        <View style={[EditProfileViewStyle.FormContainer, EditProfileViewStyle.SectionContainer]}>
            {userFields(currentAccount).map((field, index) => {
                const isDateField = field.name === 'dob';
                const value = tempAccount.data[field.name] || currentAccount.data[field.name];

                return (
                    <View key={index} style={EditProfileViewStyle.FormWrap}>
                        <Text style={EditProfileViewStyle.FormText}>{field.label}</Text>
                        <TextInput
                            style={EditProfileViewStyle.Input}
                            value={isDateField ? value : String(value)}
                            placeholder={field.label}
                            onChangeText={(value) => updateTempAccount(field.name, value)}
                            editable={!isDateField}
                            disabled={field.disabled}
                            keyboardType={field.keyboardType}
                            right={
                                isDateField ? (
                                    <TextInput.Icon
                                        icon="calendar"
                                        onPress={showDatePicker}
                                    />
                                ) : (
                                    <TextInput.Icon
                                        icon={field.icon}
                                    />
                                )
                            }
                            onPressIn={isDateField ? showDatePicker : null}
                        />
                    </View>
                );
            })}

            {currentAccount.data.role === "STU" && (
                studentField(currentAccount).map((field, index) => (
                    <View key={index} style={EditProfileViewStyle.FormWrap}>
                        <Text style={EditProfileViewStyle.FormText}>{field.label}</Text>
                        <TextInput
                            style={EditProfileViewStyle.Input}
                            value={
                                field.name === 'academic_year'
                                    ? String(tempAccount.data.user_instance[field.name] || currentAccount.data.user_instance[field.name])
                                    : tempAccount.data.user_instance[field.name] || currentAccount.data.user_instance[field.name]
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

            <View>
                <Text style={EditProfileViewStyle.FormText}>Giới tính</Text>
                <View style={EditProfileViewStyle.FormWrap}>
                    <View style={EditProfileViewStyle.RadioGroup}>
                        <View style={EditProfileViewStyle.RadioWrap}>
                            <Text style={EditProfileViewStyle.RadioText}>Nam</Text>
                            <RadioButton
                                value="M"
                                color={Theme.PrimaryColor}
                                status={tempAccount.data.gender === 'M' ? 'checked' : 'unchecked'}
                                onPress={() => updateTempAccount('gender', 'M')}
                            />
                        </View>

                        <View style={EditProfileViewStyle.RadioWrap}>
                            <Text style={EditProfileViewStyle.RadioText}>Nữ</Text>
                            <RadioButton
                                value="F"
                                color={Theme.PrimaryColor}
                                status={tempAccount.data.gender === 'F' ? 'checked' : 'unchecked'}
                                onPress={() => updateTempAccount('gender', 'F')}
                            />
                        </View>
                    </View>
                </View>
            </View>
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
    RadioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    RadioWrap: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    RadioText: {
        fontSize: 16,
        fontFamily: Theme.SemiBold,
    },
});

export default EditProfileView;