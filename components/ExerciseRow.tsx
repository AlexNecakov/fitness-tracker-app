import { useState } from 'react';
import { Text, View, StyleSheet, } from "react-native";

import IconButton from "@/components/IconButton";

type Props = {
    label: string;
    numReps: number;
    setNumReps: (numReps: number) => void;
};

export default function ExerciseRow({ label, numReps, setNumReps }: Props) {

    const onPlus = () => {
        setNumReps(numReps + 1);
    };
    const onMinus = () => {
        setNumReps(Math.max(0, numReps - 1));
    };


    return (
        <View style={styles.entriesRow}>
            <View style={styles.entriesCell}>
                <Text style={styles.text}>{label}</Text>
            </View>
            <View style={styles.entriesCell}>
                <Text style={styles.text}>5</Text>
            </View>
            <View style={styles.entriesCell}>
                <IconButton icon="minus" onPress={onMinus} ></IconButton>
                <Text style={styles.text}>{numReps}</Text>
                <IconButton icon="plus" onPress={onPlus} ></IconButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 40,
        color: '#ffff',
    },
    entriesRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    entriesCell: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 20,
    }
});
