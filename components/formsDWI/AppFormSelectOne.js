import React, { useState } from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { useFormikContext } from "formik";

import Chip from '../Chip';

function AppFormSelectOne({array, name, ...otherProps}) {
    const { setFieldValue, values } = useFormikContext()
    const [chosenIndex, setChosenIndex] = useState()

    let chipArr = [] 

    for (let i = 0; i < array.length; i++) {
        chipArr.push(
            <Chip 
                key={i}
                style={styles.chip}
                selected={i === chosenIndex}
                onPress={() => {
                    //chosenIndex = i
                    setChosenIndex(i)
                    setFieldValue(name, array[i])
                    console.log(array[i])
                }}
            >{array[i]}</Chip> 
        )
    }
    
    return (
        <View style={styles.chips}>
            {chipArr}
        </View>
    );
}

const styles = StyleSheet.create({
    chips: {
        marginBottom: 20,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center"
    },
    chip: {
        marginBottom: 6,
        marginRight: 4,
    },
})

export default AppFormSelectOne;