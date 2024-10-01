import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import Theme from '../../Styles/Theme';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';

const AuthInput = ({ field, account, setAccount }) => {
    const isDateField = field.name === 'dob';
    const [icon, setIcon] = useState(field.icon);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const isPassword = field.name === 'password' || field.name === 'confirm';
    const [selectedDate, setSelectedDate] = useState(account[field.name] || null);

    const updateAccount = (field, value) => {
        setAccount((prevAccount) => ({
            ...prevAccount,
            [field]: value,
        }));
    };

    const handlePress = () => {
        setPasswordVisible(!passwordVisible);
        setIcon(!passwordVisible ? 'eye-off-outline' : 'eye-outline');
    };

    const onChangeDate = (event, date) => {
        if (event.type === 'set' && date) {
            setSelectedDate(date);
            updateAccount(field.name, moment(date).format('DD-MM-YYYY'));
        }
    };

    const showDatePicker = () => {
        DateTimePickerAndroid.open({
            value: selectedDate || new Date(),
            onChange: onChangeDate,
            mode: 'date',
            is24Hour: true,
        });
    };

    return (
        <TextInput
            key={field.name}
            value={isDateField && selectedDate ? moment(selectedDate).format('DD-MM-YYYY') : account[field.name]}
            style={InputStyle.Input}
            placeholder={field.label}
            keyboardType={field.keyboardType}
            cursorColor={Theme.PrimaryColor}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            onChangeText={(value) => updateAccount(field.name, value)}
            secureTextEntry={isPassword ? !passwordVisible : false}
            right={
                isDateField ? (
                    <TextInput.Icon
                        icon="calendar"
                        onPress={showDatePicker}
                    />
                ) : (
                    <TextInput.Icon
                        icon={icon}
                        onPress={isPassword ? handlePress : null}
                        pointerEvents={isPassword ? 'auto' : 'none'}
                    />
                )
            }
            editable={!isDateField}
            onPressIn={isDateField ? showDatePicker : null}
        />
    );
};

const InputStyle = StyleSheet.create({
    Input: {
        borderWidth: 2,
        marginBottom: 20,
        borderColor: Theme.PrimaryColor,
        backgroundColor: Theme.SecondaryColor,
    }
});

export default AuthInput;