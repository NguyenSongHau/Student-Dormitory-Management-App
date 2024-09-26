import React, { useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import moment from 'moment';
import Theme from '../../Styles/Theme';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const AuthDateTimePicker = ({ selectedDate, setSelectedDate }) => {
    const [icon] = useState('calendar');

    const onChange = (event, date) => {
        if (event.type === 'set' && date) {
            setSelectedDate(date);
        }
    };

    const showDatePicker = () => {
        DateTimePickerAndroid.open({
            value: selectedDate || new Date(),
            onChange,
            mode: 'date', 
            is24Hour: true,
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : ""}
                style={styles.input}
                placeholder="Ngày sinh"
                onPressIn={showDatePicker}
                right={<TextInput.Icon icon={icon} onPress={showDatePicker} />}
                editable={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    input: {
        borderWidth: 2,
        borderColor: Theme.PrimaryColor,
        backgroundColor: Theme.SecondaryColor,
        marginBottom: 20,
    },
});

export default AuthDateTimePicker;