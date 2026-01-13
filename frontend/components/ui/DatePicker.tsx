import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, StyleProp, ViewStyle } from "react-native";

export const DatePicker = ({
    value,
    onChange,
    style
}: {
    value: string;
    onChange: (...event: any[]) => void;
    style?: StyleProp<ViewStyle>
}) => {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    /* 
        A tester avec un Android pour voir si c'est vraiment utile
    */
    // const onChange = (event: string, selectedDate: Date) => {
    //     if (selectedDate) {
    //         setDate(selectedDate);
    //     }
    //     if (Platform.OS === "android") {
    //         setShow(false); // Android ferme après sélection
    //     }
    // };
    // const showPicker = () => {
    //     setShow(true);
    // };

    return (
        <DateTimePicker
            style={style}
            locale="fr"
            value={value ? new Date(value) : new Date()}
            mode="date"
            display="default" // ✅ ICI
            onChange={(event, selectedDate) => {
                if (Platform.OS === "android") setShow(false);
                if (selectedDate) {
                    onChange(selectedDate.toISOString().split("T")[0]);
                    setDate(selectedDate);
                }
            }}
            maximumDate={new Date(2100, 11, 31)}
            minimumDate={new Date(1900, 0, 1)}
        />
    );
};
